<?php

namespace App\Http\Controllers;

use App\Models\BilliardTable;
use App\Models\TableBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\User;

class TableBookingController extends Controller
{
    // API lấy danh sách bàn
    public function listtable()
    {
        $tables = BilliardTable::with(['latestBooking.user'])->get()->map(function ($table) {
            $data = $table->toArray();
            if ($table->status === 'reserved' && $table->latestBooking) {
                $data['reserved_by'] = $table->latestBooking->user->name ?? 'Không rõ';
                $data['booking_time'] = $table->latestBooking->booking_time;
            }
            return $data;
        });
    
        return response()->json([
            'data' => $tables
        ]);
    }

    // API đặt bàn trước
    public function bookTable(Request $request)
    {
        // Validate dữ liệu gửi lên
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'table_id' => 'required|exists:billiard_tables,id',
            'booking_time' => 'required|date_format:Y-m-d H:i:s', // đổi từ start_time sang booking_time
        ]);
    
        // Kiểm tra xem bàn có còn trống không
        $table = BilliardTable::find($request->table_id);
    
        if ($table->status !== 'available') {
            return response()->json([
                'message' => 'Bàn hiện không còn trống.'
            ], 400);
        }
    
        // Tạo bản ghi đặt bàn trong bảng table_bookings
        $booking = new \App\Models\TableBooking();
        $booking->user_id = $request->user_id;
        $booking->billiard_table_id = $request->table_id;
        $booking->status = 'reserved';
        $booking->booking_time = $request->booking_time; // dùng booking_time thay vì start_time
        $booking->save();
    
        // Cập nhật trạng thái bàn
        $table->status = 'reserved';
        $table->booking_time = $request->booking_time;
        $table->save();
    
        return response()->json([
            'message' => 'Đặt bàn thành công.',
            'data' => $booking
        ], 200);
    }
    
    public function myBookings(Request $request)
    {
    $request->validate([
        'user_id' => 'required|exists:users,id',
    ]);

    $bookings = TableBooking::with('billiardTable')
        ->where('user_id', $request->user_id)
        ->orderByDesc('booking_time')
        ->get();

    return response()->json([
        'data' => $bookings
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
    public function cancel(Request $request)
    {
        $bookingId = $request->input('booking_id');
        $userId = $request->input('user_id');
        
        // Kiểm tra thông tin đặt bàn và người dùng
        if (!$bookingId || !$userId) {
            return response()->json(['message' => 'Thiếu thông tin đặt bàn hoặc người dùng.'], 400);
        }
    
        // Tìm booking dựa trên ID và user_id, và đảm bảo trạng thái là reserved hoặc using
        $booking = TableBooking::where('id', $bookingId)
            ->where('user_id', $userId)
            ->whereIn('status', ['reserved', 'using']) // Chỉ cho phép huỷ khi chưa dùng hoặc đang sử dụng
            ->first();
    
        if (!$booking) {
            return response()->json(['message' => 'Không tìm thấy đặt bàn phù hợp hoặc không thể huỷ.'], 404);
        }
    
        // Cập nhật trạng thái của bàn billiard (billiard_table_id) về 'available'
        $billiardTable = BilliardTable::find($booking->billiard_table_id);
        if ($billiardTable) {
            $billiardTable->status = 'available';
            $billiardTable->save();
        } else {
            return response()->json(['message' => 'Không tìm thấy bàn billiard.'], 404);
        }
    
        // Xóa bản ghi đặt bàn trong bảng table_bookings
        $booking->delete();
    
        return response()->json(['message' => 'Huỷ đặt bàn và xóa thành công.']);
    }
}

