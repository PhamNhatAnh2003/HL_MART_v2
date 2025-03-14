<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'name' => 'Sản phẩm A',
                'description' => 'Mô tả sản phẩm A',
                'price' => 500000,
                'discount_price' => 450000,
                'avatar' => 'images/productA.jpg',
                'media' => json_encode(['images/productA1.jpg', 'images/productA2.jpg']),
                'stock' => 100,
                'sold' => 10,
                'category_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sản phẩm B',
                'description' => 'Mô tả sản phẩm B',
                'price' => 750000,
                'discount_price' => null,
                'avatar' => 'images/productB.jpg',
                'media' => json_encode(['images/productB1.jpg', 'images/productB2.jpg']),
                'stock' => 50,
                'sold' => 5,
                'category_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sản phẩm C',
                'description' => 'Mô tả sản phẩm C',
                'price' => 300000,
                'discount_price' => 250000,
                'avatar' => 'images/productC.jpg',
                'media' => json_encode(['images/productC1.jpg']),
                'stock' => 200,
                'sold' => 20,
                'category_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
