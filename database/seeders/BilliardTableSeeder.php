<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BilliardTable;

class BilliardTableSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 20; $i++) {
            BilliardTable::create([
                'name' => "Bàn $i",
                'status' => 'available',
            ]);
        }
    }
}
