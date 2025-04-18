<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Tạo dữ liệu giả cho các địa chỉ
        DB::table('addresses')->insert([
            [
                'user_id' => 1, // giả sử có người dùng có ID = 1
                'receiver_name' => 'Nguyễn Văn A',
                'phone' => '0987654321',
                'province' => 'Hà Nội',
                'district' => 'Ba Đình',
                'ward' => 'Phúc Xá',
                'street_address' => 'Số 10, ngõ 123, phố Hoàng Quốc Việt',
                'is_default' => true,
                'note' => 'Địa chỉ mặc định',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 1,
                'receiver_name' => 'Trần Thị B',
                'phone' => '0912345678',
                'province' => 'Hà Nội',
                'district' => 'Cầu Giấy',
                'ward' => 'Dịch Vọng',
                'street_address' => 'Số 20, ngõ 10, phố Nguyễn Khang',
                'is_default' => false,
                'note' => 'Địa chỉ tạm thời',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Bạn có thể thêm nhiều địa chỉ khác ở đây
        ]);
    }
}
