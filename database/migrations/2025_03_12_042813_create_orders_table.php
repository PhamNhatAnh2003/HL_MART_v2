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
        Schema::create('orders', function (Blueprint $table) {
             $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('pending'); // Trạng thái: pending, processing, completed, canceled
            $table->decimal('total_price', 10, 2); // Tổng giá trị đơn hàng
            $table->string('payment_method'); // Phương thức thanh toán: COD, Chuyển khoản
            $table->string('shipping_address');
            $table->timestamp('ordered_at')->useCurrent(); // Ngày đặt hàng
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
