<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('table_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('table_booking_id'); // Đảm bảo kiểu là unsignedBigInteger
            $table->unsignedBigInteger('product_id'); // Đảm bảo kiểu là unsignedBigInteger
            $table->foreign('table_booking_id')->references('id')->on('table_bookings')->onDelete('cascade'); // Khóa ngoại tới bảng table_bookings
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade'); // Khóa ngoại tới bảng products
            $table->integer('quantity')->default(1);
            $table->integer('unit_price')->nullable(); // Có thể để null nếu không cần tính tiền
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('table_items');
    }
}
