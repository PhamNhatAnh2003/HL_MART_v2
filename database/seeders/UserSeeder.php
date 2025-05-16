<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
     public function run(): void
    {
        // Tạo user admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('12345'), // đổi mật khẩu nếu cần
            'phone' => '0123456789',
            'address' => '123 Admin Street',
            'avatar' => null,
            'role' => 'admin',
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        // Tạo user seller
        User::create([
            'name' => 'Staff',
            'email' => 'Staff@example.com',
            'password' => Hash::make('12345'),
            'phone' => '0987654321',
            'address' => '456 Seller Road',
            'avatar' => null,
            'role' => 'staff',
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        // Tạo user thông thường
        User::create([
            'name' => 'Phạm Nhật Anh',
            'email' => 'anhpham090423@gmail.com',
            'password' => Hash::make('12345'),
            'phone' => '0912198345',
            'address' => 'Thôn Kim Cương 1, Xẫ Sơn Kim 1, Tỉnh Hà Tĩnh',
            'avatar' => null,
            'role' => 'user',
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);
    }
}