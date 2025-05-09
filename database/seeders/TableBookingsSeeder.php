<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TableBookingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('table_bookings')->insert([
            [
                'table_number' => 1,
                'user_id' => 1,
                'status' => 'reserved',
                'booking_time' => Carbon::now()->addHours(1), // Đặt bàn trong 1 giờ
                'start_time' => null,
                'end_time' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'table_number' => 2,
                'user_id' => 2,
                'status' => 'using',
                'booking_time' => Carbon::now()->addHours(2), // Đặt bàn trong 2 giờ
                'start_time' => null,
                'end_time' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Thêm các bản ghi khác nếu cần
        ]);
    }
}
