<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TableBookingsSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        DB::table('table_bookings')->insert([
            [
                'billiard_table_id' => 1,
                'user_id' => 3,
                'status' => 'reserved',
                'booking_time' => $now->copy()->addHour(),
                'start_time' => $now->copy()->addHour(),
                'end_time' => $now->copy()->addHours(3),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'billiard_table_id' => 2,
                'user_id' => 3,
                'status' => 'using',
                'booking_time' => $now->copy()->subHour(),
                'start_time' => $now->copy()->subHour(),
                'end_time' => $now->copy()->addHour(),
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'billiard_table_id' => 3,
                'user_id' => 2,
                'status' => 'reserved',
                'booking_time' => $now->copy()->addDays(1),
                'start_time' => null,
                'end_time' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
