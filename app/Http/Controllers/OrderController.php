<?php

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        // Xác thực user
        $userId = Auth::id();

        // Kiểm tra dữ liệu từ request
        $request->validate([
            'total_price' => 'required|numeric|min:1',
            'payment_method' => 'required|string',
            'shipping_address' => 'required|string',
        ]);

        // Tạo đơn hàng mới với total_price từ UI
        $order = Order::create([
            'user_id' => $userId,
            'status' => 'pending',
            'total_price' => $request->total_price, // Nhận total_price từ UI
            'payment_method' => $request->payment_method,
            'shipping_address' => $request->shipping_address,
            'ordered_at' => now(),
        ]);

        return response()->json([
            'message' => 'Đơn hàng đã được tạo thành công!',
            'order' => $order
        ], 201);
    }
}

