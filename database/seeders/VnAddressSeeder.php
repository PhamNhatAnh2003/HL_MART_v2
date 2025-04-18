<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class VnAddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('vn_addresses')->insert([
        [
            'province' => 'Hồ Chí Minh',
            'district' => 'Quận 1',
            'ward' => 'Phường Bến Nghé',
            'type' => 'Phường',
            'prefix' => 'P.',
            'code' => '70001'
        ],
        [
            'province' => 'Hồ Chí Minh',
            'district' => 'Quận 1',
            'ward' => 'Phường Bến Thành',
            'type' => 'Phường',
            'prefix' => 'P.',
            'code' => '70002'
        ],
        [
            'province' => 'Hà Nội',
            'district' => 'Quận Hoàn Kiếm',
            'ward' => 'Phường Hàng Bạc',
            'type' => 'Phường',
            'prefix' => 'P.',
            'code' => '10001'
        ],
        // Bạn có thể thêm nhiều dòng khác tương tự ở đây
    ]);
}}
