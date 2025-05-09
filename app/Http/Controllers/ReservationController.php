<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReservationController extends Controller
{
public function reserve(Request $request)
{
    $request->validate([
        'table_id' => 'required|exists:tables,id',
        'customer_name' => 'required|string',
        'reservation_time' => 'required|date',
    ]);

    // Kiểm tra xem bàn đã được đặt chưa
    $table = Table::find($request->table_id);
    if (!$table->is_available) {
        return response()->json(['error' => 'Bàn đã được đặt!'], 400);
    }

    // Tạo đơn đặt bàn
    Reservation::create([
        'table_id' => $request->table_id,
        'customer_name' => $request->customer_name,
        'reservation_time' => $request->reservation_time,
    ]);

    // Cập nhật trạng thái bàn
    $table->update(['is_available' => false]);

    return response()->json(['success' => 'Đặt bàn thành công!']);
}
}
