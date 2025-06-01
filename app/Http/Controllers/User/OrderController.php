<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use App\Http\Resources\OrderResource;
use App\Models\Voucher;

class OrderController extends Controller
{
    public function createOrder(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'payment_method' => 'required|string',
            'items' => 'required|array',
            'total_price' => 'required|numeric',
            'shipping_address' => 'required|string',
            'voucher_code' => 'nullable|string',
        ]);
    
        $discount = 0;
        $voucher = null;
        if (!empty($validated['voucher_code'])) {
            $voucher = Voucher::where('code', $validated['voucher_code'])
                ->where('is_active', true)
                ->where(function ($query) {
                    $now = now();
                    $query->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
                })
                ->where(function ($query) {
                    $now = now();
                    $query->whereNull('expires_at')->orWhere('expires_at', '>=', $now);
                })
                ->first();
    
            if (!$voucher) {
                return response()->json([
                    'status' => false,
                    'message' => 'Mã voucher không hợp lệ hoặc đã hết hạn.',
                ], 422);
            }
    
            if ($voucher->min_order > $validated['total_price']) {
                return response()->json([
                    'status' => false,
                    'message' => "Đơn hàng phải đạt tối thiểu " . number_format($voucher->min_order) . "đ để áp dụng voucher này.",
                ], 422);
            }
    
            if ($voucher->max_usage !== null && $voucher->used >= $voucher->max_usage) {
                return response()->json([
                    'status' => false,
                    'message' => 'Mã voucher đã đạt giới hạn số lượt sử dụng.',
                ], 422);
            }
    
            $discount = $voucher->type === 'percent' 
                ? $validated['total_price'] * ($voucher->value / 100) 
                : $voucher->value;
    
            $discount = min($discount, $validated['total_price']);
        }
    
        $order = Order::create([
            'user_id' => $validated['user_id'],
            'status' => 'pending',
            'payment_method' => $validated['payment_method'],
            'total_price' => $validated['total_price'] - $discount,
            'discount' => $discount,
            'voucher_code' => $voucher->code ?? null,
            'shipping_address' => $validated['shipping_address'],
            'ordered_at' => Carbon::now(),
        ]);
    
        foreach ($validated['items'] as $item) {
            $totalItemPrice = $item['quantity'] * $item['price_at_time'];
    
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price_at_time' => $item['price_at_time'],
                'total_price' => $totalItemPrice,
            ]);
    
            $product = Product::findOrFail($item['product_id']);
    
            if ($product->stock < $item['quantity'] && $validated['payment_method'] === 'CK') {
                return response()->json([
                    'status' => false,
                    'message' => "Không thể thanh toán bằng Chuyển Khoản. Sản phẩm '{$product->name}' không đủ hàng trong kho.",
                ], 400);
            }
    
            if ($product->stock < $item['quantity']) {
                return response()->json([
                    'status' => false,
                    'message' => "Sản phẩm '{$product->name}' không đủ hàng trong kho.",
                ], 400);
            }
    
            $product->stock -= $item['quantity'];
            $product->sold += $item['quantity'];
            $product->save();
        }
    
        if (!empty($voucher)) {
            $voucher->used += 1;
            $voucher->save();
        }
    
        return response()->json([
            'status' => true,
            'message' => 'Đặt hàng thành công!',
            'order_id' => $order->id,
            'qr_url' => match ($validated['payment_method']) {
                'CK' => $this->generateMomoQr($order),
                'vnpay' => $this->generateVnpayUrl($order),
                default => null,
            },
        ]);
    }
    

private function generateVnpayUrl($order)
{
    $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    $vnp_Returnurl = "http://localhost:8080/weblinhkienmaytinh/checkout";
    $vnp_TmnCode = "1VYBIYQP"; // Từ VNPAY
    $vnp_HashSecret = "NOH6MBGNLQL9O9OMMFMZ2AX8NIEP50W1"; // Từ VNPAY

    $vnp_TxnRef = $order->id;
    $vnp_OrderInfo = 'Thanh toán đơn hàng #' . $order->id;
    $vnp_OrderType = 'billpayment';
    $vnp_Amount = $order->total_price * 100; // Nhân 100 vì VNPAY yêu cầu
    $vnp_Locale = 'vn';
    $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];

    $inputData = array(
        "vnp_Version" => "2.1.0",
        "vnp_TmnCode" => $vnp_TmnCode,
        "vnp_Amount" => $vnp_Amount,
        "vnp_Command" => "pay",
        "vnp_CreateDate" => date('YmdHis'),
        "vnp_CurrCode" => "VND",
        "vnp_IpAddr" => $vnp_IpAddr,
        "vnp_Locale" => $vnp_Locale,
        "vnp_OrderInfo" => $vnp_OrderInfo,
        "vnp_OrderType" => $vnp_OrderType,
        "vnp_ReturnUrl" => $vnp_Returnurl,
        "vnp_TxnRef" => $vnp_TxnRef,
    );

    ksort($inputData);
    $query = "";
    $hashdata = "";
    $i = 0;
    foreach ($inputData as $key => $value) {
        if ($i == 1) {
            $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
        } else {
            $hashdata .= urlencode($key) . "=" . urlencode($value);
            $i = 1;
        }
        $query .= urlencode($key) . "=" . urlencode($value) . '&';
    }

    $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
    $vnp_Url .= "?" . $query . 'vnp_SecureHash=' . $vnpSecureHash;

    return $vnp_Url;
}

public function getOrdersByUser($userId)
{
    $orders = Order::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
    return response()->json(['orders' => $orders]);
}

public function getOrderDetail($id)
{
    $order = Order::with(['orderItems.product'])->findOrFail($id);

    $items = $order->orderItems->map(function ($item) {
        return [
            'id' => $item->id,
            'product_name' => $item->product->name,
            'quantity' => $item->quantity,
            'price_at_time' => $item->price_at_time,
            'avatar' => $item->product->avatar,
        ];
    });

    return response()->json([
        'order_items' => $items
    ]);
}

public function cancel($id)
{
    try {
        $order = Order::with('orderItems')->findOrFail($id);

        if ($order->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ có thể huỷ đơn hàng đang chờ xử lý.'
            ], 400);
        }

        // ✅ Cập nhật lại số lượng tồn kho và đã bán
        foreach ($order->orderItems as $item) {
            $product = Product::find($item->product_id);
            if ($product) {
                $product->stock += $item->quantity;
                $product->sold -= $item->quantity;
                if ($product->sold < 0) {
                    $product->sold = 0; // Đảm bảo không âm
                }
                $product->save();
            }
        }

        // Xóa order_items trước khi xóa order
        $order->orderItems()->delete();

        // Xóa đơn hàng
        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đơn hàng đã được huỷ và cập nhật lại kho.'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Lỗi khi huỷ đơn hàng.',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function getOrders(Request $request)
{
    $status = $request->query('status');
    $name = $request->query('name');
    $startDate = $request->query('start_date');
    $endDate = $request->query('end_date');

    $query = Order::query(); // 👈 Đưa lên đầu tiên

    // Lọc theo ngày
    if ($startDate && $endDate) {
        $query->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
    }

    // Lọc theo trạng thái
    if ($status) {
        $query->where('status', $status);
    }

    // Lọc theo tên khách hàng từ bảng address
    if ($name) {
        $query->whereHas('address', function ($q) use ($name) {
            $q->where('receiver_name', 'like', '%' . $name . '%');
        });
    }

    // Eager load 'address'
    $orders = $query->with('address')->get();

    return response()->json([
        'success' => true,
        'data' => OrderResource::collection($orders),
    ]);
}

// Cập nhật trạng thái đơn hàng
public function updateStatus(Request $request, $id)
{
    // Tìm đơn hàng theo ID
    $order = Order::find($id);
    if (!$order) {
        return response()->json(['success' => false, 'message' => 'Đơn hàng không tồn tại'], 404);
    }

    // Kiểm tra trạng thái mới
    $note = $request->input('note');
    $newStatus = $request->input('status');
    if (!$newStatus) {
        return response()->json(['success' => false, 'message' => 'Trạng thái không hợp lệ'], 400);
    }

    // Cập nhật trạng thái đơn hàng
    $order->note = $note;
    $order->status = $newStatus;
    $order->save();

    return response()->json([
        'success' => true,
        'message' => 'Trạng thái đơn hàng đã được cập nhật!',
        'data' => $order
    ]);
}

private function generateMomoQr($order)
{
    // 🧪 Giả lập link QR thanh toán Momo (bạn có thể tích hợp SDK thật ở đây)
    return 'https://dummy-momo-qr.com/images/qr_3.png' . $order->id;
}

public function checkStock(Request $request)
{
    $items = $request->input('items');
    foreach ($items as $item) {
        $product = Product::find($item['product_id']);
        if (!$product || $product->stock < $item['quantity']) {
            return response()->json([
                'status' => false,
                'message' => "Sản phẩm '{$product->name}' không đủ hàng trong kho.",
            ]);
        }
    }

    return response()->json(['status' => true]);
}

}



