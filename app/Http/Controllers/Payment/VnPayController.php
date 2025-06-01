<?php

namespace App\Http\Controllers\Payment;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use App\Models\Voucher;

class VnPayController extends Controller
{
   
public function createPayment(Request $request)
{
    $vnp_TmnCode = config('vnpay.vnp_TmnCode');
    $vnp_HashSecret = config('vnpay.vnp_HashSecret');
    $vnp_Url = config('vnpay.vnp_Url');
    $vnp_Returnurl = config('vnpay.vnp_ReturnUrl');

    // Validate input thêm voucher_code
    $validated = $request->validate([
        'amount' => 'required|numeric|min:1000',
        'user_id' => 'required|exists:users,id',
        'shipping_address' => 'required|string',
        'items' => 'required|array',
        'items.*.product_id' => 'required|exists:products,id',
        'items.*.quantity' => 'required|integer|min:1',
        'items.*.price_at_time' => 'required|numeric|min:0',
        'voucher_code' => 'nullable|string',  // thêm
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

        if ($voucher->min_order > $validated['amount']) {
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

    }

    $finalAmount = $validated['amount'];

    // Tạo mã giao dịch duy nhất
    $vnp_TxnRef = time() . '_' . rand(1000, 9999);
    $vnp_OrderInfo = "Thanh toán hóa đơn";
    $vnp_OrderType = 'billpayment';
    $vnp_Amount = $finalAmount * 100; // VND x 100
    $vnp_Locale = 'vn';
    $vnp_IpAddr = $request->ip();

    // (phần tạo URL VNPAY giữ nguyên)
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
        'total_price' => $finalAmount,
        'discount' => $discount,
        'voucher_code' => $voucher ? $voucher->code : null,
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

    // Cập nhật số lượt dùng voucher
    if ($voucher) {
        $voucher->used += 1;
        $voucher->save();
    }

    return response()->json([
        'payment_url' => $vnp_Url,
        'order_id' => $order->id,
    ], 200);
}
}