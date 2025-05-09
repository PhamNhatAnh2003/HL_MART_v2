<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BilliardTable;
use Carbon\Carbon;
class BilliardTableSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 20; $i++) {
            BilliardTable::create([
                'name' => "Bàn $i",
                'booking_time' => Carbon::now()->addHours(1), // Đặt bàn trong 1 giờ
                'status' => 'available',
            ]);
        }
    }
}
