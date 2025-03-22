<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CartItemSeeder extends Seeder
{
    public function run()
    {
        // Xóa dữ liệu cũ trước khi thêm mới
        DB::table('cart_items')->truncate();

        // Thêm dữ liệu vào giỏ hàng
        DB::table('cart_items')->insert([
            [
                'user_id' => 1,
                'product_id' => 1,
                'unit' => 'Thùng',
                'quantity' => 2,
                'price_at_time' => 200000,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => 1,
                'product_id' => 2,
                'unit' => 'Lon',
                'quantity' => 5,
                'price_at_time' => 15000,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => 1,
                'product_id' => 3,
                'unit' => 'Thùng',
                'quantity' => 1,
                'price_at_time' => 250000,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ]);
    }
}
