<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use App\Models\User;
use App\Models\Product;

class ReviewSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

// Lấy danh sách user_id có role là 'user'
$userIds = User::where('role', 'user')->pluck('id')->toArray();

// Lấy danh sách product_id như bình thường
$productIds = Product::pluck('id')->toArray();

if (empty($userIds) || empty($productIds)) {
    $this->command->info('Không có user (role user) hoặc product trong database để tạo review.');
    return;
}

// Tạo 50 review giả
for ($i = 0; $i < 50; $i++) {
    DB::table('reviews')->insert([
        'user_id' => $faker->randomElement($userIds),
        'product_id' => $faker->randomElement($productIds),
        'rating' => $faker->numberBetween(1, 5),
        'comment' => $faker->optional()->paragraph(),
        'image' => $faker->optional()->imageUrl(640, 480, 'products', true), // ảnh giả
        'created_at' => now(),
        'updated_at' => now(),
    ]);
}
    }
}
