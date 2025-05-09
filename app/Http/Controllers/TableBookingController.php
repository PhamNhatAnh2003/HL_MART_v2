<?php

namespace App\Http\Controllers;

use App\Models\BilliardTable;
use App\Models\TableBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class TableBookingController extends Controller
{
    // API lấy danh sách bàn
    public function listtable()
    {
        return response()->json([
            'success' => true,
            'data' => BilliardTable::all()
        ]);
    }

    // API đặt bàn trước
    public function reserve(Request $request)
    {
        $validated = $request->validate([
            'table_number' => 'required|integer',
            'user_id' => 'required|exists:users,id',
            'booking_time' => 'required|date|after:now',
        ]);

        $booking = TableBooking::create([
            'table_number' => $validated['table_number'],
            'user_id' => $validated['user_id'],
            'status' => 'reserved',
            'booking_time' => $validated['booking_time'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đặt bàn thành công!',
            'data' => $booking,
        ]);
    }

    // API bắt đầu dùng bàn (tính giờ)
    public function startUsing($id)
    {
        $booking = TableBooking::findOrFail($id);

        if ($booking->status !== 'reserved') {
            return response()->json([
                'success' => false,
                'message' => 'Bàn không ở trạng thái đã đặt.',
            ], 400);
        }

        $booking->update([
            'status' => 'using',
            'start_time' => Carbon::now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bắt đầu sử dụng bàn.',
            'data' => $booking,
        ]);
    }

    // API lấy danh sách tất cả bàn đã đặt/dùng
    public function index()
    {
        $bookings = TableBooking::with('user')->orderBy('booking_time')->get();

        return response()->json([
            'success' => true,
            'data' => $bookings,
        ]);
    }

    // API huỷ đặt bàn
    public function cancel($id)
    {
        $booking = TableBooking::findOrFail($id);

        if ($booking->status === 'using') {
            return response()->json([
                'success' => false,
                'message' => 'Không thể huỷ khi bàn đang được sử dụng.',
            ], 400);
        }

        $booking->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã huỷ đặt bàn.',
        ]);
    }
}

