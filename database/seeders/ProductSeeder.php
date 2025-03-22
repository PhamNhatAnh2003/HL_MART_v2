<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $faker = Faker::create();
        $units = ['kg', 'g', 'lit', 'chai', 'hộp', 'cái','thùng']; // 🔥 Danh sách đơn vị tính

        foreach (range(1, 30) as $index){
        DB::table('products')->insert([
            [
                'name' => $faker ->unique()->name,
                'description' => 'Mô tả sản phẩm A',
                'price' => $faker->numberBetween(10000, 500000),
                'discount_price' => $faker->numberBetween(20000, 100000),
                'unit' => $units[array_rand($units)], // 🔥 Chọn đơn vị ngẫu nhiên
                'avatar' => 'images/productA.jpg',
                'media' => json_encode(['images/productA1.jpg', 'images/productA2.jpg']),
                'stock' => $faker->numberBetween(10, 50),
                'sold' => $faker->numberBetween(60, 200),
                'category_id' => $faker->numberBetween(1,2),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
}
