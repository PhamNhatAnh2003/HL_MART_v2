<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Cart;
use App\Models\User;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Xóa dữ liệu cũ để tránh lỗi trùng lặp
        Cart::truncate();

        // Lấy danh sách user có trong hệ thống
        $users = User::all();

        // Tạo giỏ hàng cho mỗi user
        foreach ($users as $user) {
            Cart::create([
                'user_id' => $user->id,
            ]);
        }
    }
}



