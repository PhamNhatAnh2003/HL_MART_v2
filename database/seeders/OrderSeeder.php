<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Đảm bảo bảng users có dữ liệu (thêm user giả nếu cần)
        DB::table('users')->insertOrIgnore([
            [
                'id' => 1,
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Dữ liệu giả cho bảng orders
        $orders = [
            [
                'user_id' => 3,
                'status' => 'completed',
                'total_price' => 1000000.00,
                'payment_method' => 'cash',
                'shipping_address' => '123 Đường Láng, Hà Nội',
                'ordered_at' => Carbon::parse('2025-05-01 10:00:00'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 3,
                'status' => 'completed',
                'total_price' => 1200000.00,
                'payment_method' => 'credit_card',
                'shipping_address' => '456 Cầu Giấy, Hà Nội',
                'ordered_at' => Carbon::parse('2025-05-02 12:00:00'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 3,
                'status' => 'completed',
                'total_price' => 800000.00,
                'payment_method' => 'cash',
                'shipping_address' => '789 Ba Đình, Hà Nội',
                'ordered_at' => Carbon::parse('2025-05-03 15:00:00'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 3,
                'status' => 'completed',
                'total_price' => 1500000.00,
                'payment_method' => 'credit_card',
                'shipping_address' => '101 Hai Bà Trưng, Hà Nội',
                'ordered_at' => Carbon::parse('2025-04-01 09:00:00'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 3,
                'status' => 'completed',
                'total_price' => 2000000.00,
                'payment_method' => 'cash',
                'shipping_address' => '202 Hoàn Kiếm, Hà Nội',
                'ordered_at' => Carbon::parse('2024-01-01 14:00:00'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('orders')->insert($orders);
    }
}