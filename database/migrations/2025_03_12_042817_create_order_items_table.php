<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('order_items', function (Blueprint $table) {
    $table->id(); // ID của order item
    $table->foreignId('order_id')->constrained()->onDelete('cascade'); // Khóa ngoại đến bảng orders
    $table->foreignId('product_id')->constrained()->onDelete('cascade'); // Khóa ngoại đến bảng products
    $table->integer('quantity'); // Số lượng sản phẩm trong đơn hàng
    $table->integer('price'); // Giá sản phẩm tại thời điểm đặt hàng
    $table->integer('total_price'); // Tổng giá trị của sản phẩm (giá * số lượng)
    $table->timestamps(); // Thời gian tạo và cập nhật bản ghi
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_sellers');
    }
};
