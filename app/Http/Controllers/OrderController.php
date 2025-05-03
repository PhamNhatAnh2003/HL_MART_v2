<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
        $totalItemPrice = $item['quantity'] * $item['price_at_time']; // Tính tổng cho mỗi item

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $item['product_id'],
            'quantity' => $item['quantity'],
            'price_at_time' => $item['price_at_time'],
            'total_price' => $totalItemPrice, // Thêm trường này
        ]);
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
    return 'https://dummy-momo-qr.com/order/' . $order->id;
}

}


