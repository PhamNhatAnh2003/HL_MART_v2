<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([
            [
                'name' => 'Điện tử',
                'parent_id' => null, // Danh mục gốc
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Thời trang',
                'parent_id' => null, // Danh mục gốc
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Điện thoại',
                'parent_id' => null, // Con của "Điện tử"
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Laptop',
                'parent_id' => null, // Con của "Điện tử"
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Quần áo nam',
                'parent_id' => null, // Con của "Thời trang"
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
             [
                'name' => 'Quần áo nu',
                'parent_id' => null, // Con của "Thời trang"
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
             [
                'name' => 'Quần áo na',
                'parent_id' => null, // Con của "Thời trang"
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
