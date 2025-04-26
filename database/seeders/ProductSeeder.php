<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $units = ['kg', 'g', 'lít', 'chai', 'hộp', 'bịch', 'thùng'];

        $products = [
            // Lương thực (1)
            [1, 'Gạo ST25', 'Gạo thơm ngon, dẻo mềm', 'rice.jpg'],
            [1, 'Gạo Lứt', 'Giàu chất xơ, tốt cho sức khỏe', 'brown_rice.jpg'],
            [1, 'Nếp cái hoa vàng', 'Dẻo thơm, nấu xôi ngon', 'sticky_rice.jpg'],
            [1, 'Bột mì', 'Dùng để làm bánh và chiên rán', 'flour.jpg'],
            [1, 'Bột gạo', 'Bột xay mịn, dùng làm bánh', 'rice_flour.jpg'],

            // Gia vị & Dầu ăn (2)
            [2, 'Muối i-ốt', 'Muối sạch, bổ sung i-ốt', 'salt.jpg'],
            [2, 'Đường cát trắng', 'Dùng pha nước, nấu ăn', 'sugar.jpg'],
            [2, 'Hạt nêm Knorr', 'Gia vị nêm nếm thơm ngon', 'knorr.jpg'],
            [2, 'Nước mắm Phú Quốc', 'Nước mắm truyền thống', 'fish_sauce.jpg'],
            [2, 'Dầu ăn Tường An', 'Dầu thực vật tốt cho sức khỏe', 'cooking_oil.jpg'],

            // Đồ khô - Đồ hộp (3)
            [3, 'Cá hộp Ba Cô Gái', 'Cá sốt cà chua ngon miệng', 'canned_fish.jpg'],
            [3, 'Đậu đen khô', 'Dùng nấu chè, xôi', 'black_bean.jpg'],
            [3, 'Tôm khô', 'Tôm phơi khô tự nhiên', 'dried_shrimp.jpg'],
            [3, 'Mộc nhĩ khô', 'Dùng trong món xào và canh', 'wood_ear.jpg'],
            [3, 'Nấm hương khô', 'Thơm và bổ dưỡng', 'shiitake.jpg'],

            // Sữa & Đồ uống (4)
            [4, 'Sữa tươi Vinamilk', 'Bổ sung canxi', 'milk.jpg'],
            [4, 'Sữa đậu nành Fami', 'Giàu protein thực vật', 'soy_milk.jpg'],
            [4, 'Sữa chua uống', 'Tốt cho tiêu hóa', 'yogurt.jpg'],
            [4, 'Nước cam ép', 'Giàu vitamin C', 'orange_juice.jpg'],
            [4, 'Sữa đặc Ông Thọ', 'Pha cà phê hoặc làm bánh', 'condensed_milk.jpg'],

            // Rau củ quả (5)
            [5, 'Rau cải xanh', 'Tươi sạch, không thuốc trừ sâu', 'vegetable.jpg'],
            [5, 'Bắp cải', 'Rau củ bổ dưỡng', 'cabbage.jpg'],
            [5, 'Cà rốt', 'Giàu vitamin A', 'carrot.jpg'],
            [5, 'Khoai tây', 'Dùng nấu canh hoặc chiên', 'potato.jpg'],
            [5, 'Củ hành tím', 'Gia vị nấu ăn thơm ngon', 'onion.jpg'],

            // Trái cây tươi (6)
            [6, 'Cam sành', 'Ngọt, mọng nước', 'orange.jpg'],
            [6, 'Chuối tiêu', 'Nhiều kali và chất xơ', 'banana.jpg'],
            [6, 'Xoài cát Hòa Lộc', 'Thơm ngon đặc sản', 'mango.jpg'],
            [6, 'Dưa hấu ruột đỏ', 'Ngọt mát', 'watermelon.jpg'],
            [6, 'Ổi lê', 'Giòn ngọt', 'guava.jpg'],

            // Bánh kẹo (7)
            [7, 'Bánh quy Cosy', 'Giòn, vị bơ', 'biscuit.jpg'],
            [7, 'Kẹo dừa Bến Tre', 'Đặc sản miền Tây', 'coconut_candy.jpg'],
            [7, 'Socola KitKat', 'Sô cô la thanh giòn', 'kitkat.jpg'],
            [7, 'Snack Oishi', 'Ăn vặt ngon miệng', 'snack.jpg'],
            [7, 'Bánh bông lan', 'Mềm, thơm, ngọt nhẹ', 'sponge_cake.jpg'],

            // Mì - Miến - Bún (8)
            [8, 'Mì Hảo Hảo', 'Tôm chua cay', 'instant_noodle.jpg'],
            [8, 'Miến dong', 'Dùng nấu lẩu hoặc xào', 'vermicelli.jpg'],
            [8, 'Bún khô', 'Ăn với bún chả hoặc nem', 'dried_rice_noodle.jpg'],
            [8, 'Phở khô', 'Nấu phở tại nhà tiện lợi', 'pho.jpg'],
            [8, 'Mì trứng', 'Dẻo dai thơm ngon', 'egg_noodle.jpg'],

            // Thực phẩm đông lạnh (9)
            [9, 'Chả giò đông lạnh', 'Chiên giòn nhanh chóng', 'spring_roll.jpg'],
            [9, 'Xúc xích tiệt trùng', 'Dễ chế biến', 'sausage.jpg'],
            [9, 'Thịt viên đông lạnh', 'Nấu canh hoặc chiên', 'meatball.jpg'],
            [9, 'Cá viên', 'Dùng cho lẩu hoặc xào', 'fish_ball.jpg'],
            [9, 'Tôm đông lạnh', 'Tiện lợi, giữ nguyên độ tươi', 'frozen_shrimp.jpg'],

            // Nước ngọt & nước khoáng (10)
            [10, 'Nước suối Lavie', 'Thanh lọc cơ thể', 'lavie.jpg'],
            [10, 'Pepsi lon', 'Nước ngọt có gas', 'pepsi.jpg'],
            [10, 'Trà xanh 0 độ', 'Giải khát, thanh nhiệt', 'green_tea.jpg'],
            [10, 'Nước tăng lực Redbull', 'Tăng tỉnh táo', 'redbull.jpg'],
            [10, 'Nước khoáng có ga', 'Giàu khoáng chất', 'sparkling.jpg'],
        ];

        foreach ($products as [$categoryId, $name, $description, $image]) {
            DB::table('products')->insert([
                'name' => $name,
                'description' => $description,
                'price' => $faker->numberBetween(10000, 100000),
                'discount_price' => $faker->numberBetween(5000, 90000),
                'unit' => $units[array_rand($units)],
                'avatar' => 'images/products/' . $image,
                'media' => json_encode([
                    'images/products/' . str_replace('.jpg', '_1.jpg', $image),
                    'images/products/' . str_replace('.jpg', '_2.jpg', $image),
                ]),
                'stock' => $faker->numberBetween(20, 100),
                'sold' => $faker->numberBetween(0, 300),
                'category_id' => $categoryId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
