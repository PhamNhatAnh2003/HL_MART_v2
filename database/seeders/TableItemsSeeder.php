<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TableItemsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('table_items')->insert([
            [
                'table_booking_id' => 1, // Liên kết với table_booking_id của bàn 1
                'product_id' => 1,
                'quantity' => 2,
                'unit_price' => 100000,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'table_booking_id' => 2, // Liên kết với table_booking_id của bàn 2
                'product_id' => 2,
                'quantity' => 3,
                'unit_price' => 150000,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Thêm các bản ghi khác nếu cần
        ]);
    }
}
