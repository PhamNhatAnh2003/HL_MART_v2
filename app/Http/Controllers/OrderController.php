<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class OrderController extends Controller
{
public function createOrder(Request $request)
{
    // Validate dữ liệu từ frontend
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'payment_method' => 'required|string',
        'items' => 'required|array',
        'total_price' => 'required|numeric',
        'shipping_address' => 'required|string',
    ]);

    // Tạo đơn hàng
    $order = Order::create([
        'user_id' => $validated['user_id'],
        'status' => 'pending',
        'payment_method' => $validated['payment_method'],
        'total_price' => $validated['total_price'],
        'shipping_address' => $validated['shipping_address'],
        'ordered_at' => Carbon::now(),
    ]);

    // Thêm các item vào bảng order_items
    foreach ($validated['items'] as $item) {
    $totalItemPrice = $item['quantity'] * $item['price_at_time'];

    OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $item['product_id'],
        'quantity' => $item['quantity'],
        'price_at_time' => $item['price_at_time'],
        'total_price' => $totalItemPrice,
    ]);

    // ✅ Cập nhật số lượng tồn kho và đã bán
    $product = Product::findOrFail($item['product_id']);

    // Kiểm tra tồn kho trước khi trừ (phòng tránh gian lận)
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

    return response()->json([
        'status' => true,
        'message' => 'Đặt hàng thành công!',
        'order_id' => $order->id,
        'qr_url' => $validated['payment_method'] === 'momo' 
        ? $this->generateMomoQr($order) 
        : null,
    ]);
}

private function generateMomoQr($order)
{
    // 🧪 Giả lập link QR thanh toán Momo (bạn có thể tích hợp SDK thật ở đây)
    return 'https://dummy-momo-qr.com/images/qr_3.png' . $order->id;
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


}
