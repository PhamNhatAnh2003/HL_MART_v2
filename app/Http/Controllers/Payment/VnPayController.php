<?php

namespace App\Http\Controllers\Payment;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class VnPayController extends Controller
{
    public function createPayment(Request $request)
    {
        $vnp_TmnCode = config('vnpay.vnp_TmnCode');
        $vnp_HashSecret = config('vnpay.vnp_HashSecret');
        $vnp_Url = config('vnpay.vnp_Url');
        $vnp_Returnurl = config('vnpay.vnp_ReturnUrl');

        // Validate input
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1000',
            'user_id' => 'required|exists:users,id',
            'shipping_address' => 'required|string',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price_at_time' => 'required|numeric|min:0',
        ]);

        // Tạo mã giao dịch duy nhất
        $vnp_TxnRef = time() . '_' . rand(1000, 9999);
        $vnp_OrderInfo = "Thanh toán hóa đơn";
        $vnp_OrderType = 'billpayment';
        $vnp_Amount = $validated['amount'] * 100; // VND x 100
        $vnp_Locale = 'vn';
        $vnp_IpAddr = $request->ip();

        $inputData = [
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
        ];

        ksort($inputData);
        $query = "";
        $hashdata = "";
        $i = 0;
        foreach ($inputData as $key => $value) {
            $hashdata .= ($i ? '&' : '') . urlencode($key) . "=" . urlencode($value);
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
            $i = 1;
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if ($vnp_HashSecret) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        // Tạo đơn hàng trước
        $order = Order::create([
            'user_id' => $validated['user_id'],
            'status' => 'pending',
            'total_price' => $validated['amount'],
            'payment_method' => 'VNPay',
            'shipping_address' => $validated['shipping_address'],
            'ordered_at' => Carbon::now(),
        ]);

        // Thêm các item vào bảng order_items và cập nhật tồn kho
        foreach ($validated['items'] as $item) {
            $totalItemPrice = $item['quantity'] * $item['price_at_time'];

            // Tìm sản phẩm
            $product = Product::findOrFail($item['product_id']);

            // Kiểm tra tồn kho
            if ($product->stock < $item['quantity']) {
                return response()->json([
                    'status' => false,
                    'message' => "Sản phẩm '{$product->name}' không đủ hàng trong kho.",
                ], 400);
            }

            // Tạo order item
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price_at_time' => $item['price_at_time'],
                'total_price' => $totalItemPrice,
            ]);

            // Cập nhật tồn kho
            $product->stock -= $item['quantity'];
            $product->sold += $item['quantity'];
            $product->save();
        }

        return response()->json([
            'payment_url' => $vnp_Url,
            'order_id' => $order->id,
        ], 200);
    }

    public function vnpayReturn(Request $request)
    {
        $vnp_HashSecret = config('vnpay.vnp_HashSecret');
        $inputData = $request->all();
        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';
        unset($inputData['vnp_SecureHash']);

        ksort($inputData);
        $hashData = "";
        $i = 0;
        foreach ($inputData as $key => $value) {
            $hashData .= ($i ? '&' : '') . urlencode($key) . "=" . urlencode($value);
            $i = 1;
        }

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        if ($secureHash == $vnp_SecureHash) {
            if ($inputData['vnp_ResponseCode'] == '00') {
                // Thanh toán thành công
                $order = Order::find($inputData['vnp_TxnRef']);
                if ($order) {
                    $order->status = 'success';
                    $order->save();
                    return view('vnpay_return', ['status' => 'success', 'data' => $inputData, 'order' => $order]);
                }
            } else {
                return view('vnpay_return', ['status' => 'error', 'data' => $inputData]);
            }
        } else {
            return view('vnpay_return', ['status' => 'invalid_signature']);
        }
    }
}
