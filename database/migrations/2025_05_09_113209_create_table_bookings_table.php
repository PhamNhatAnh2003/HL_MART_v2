<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableBookingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
{
    Schema::create('table_bookings', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('billiard_table_id');
        $table->unsignedBigInteger('user_id');
        $table->enum('status', ['available', 'using', 'reserved'])->default('reserved');
        $table->timestamp('booking_time')->nullable(); // Thời điểm đặt bàn trước
        $table->timestamp('start_time')->nullable(); // Thực tế bắt đầu dùng
        $table->timestamp('end_time')->nullable();
        $table->timestamps();

        // Thêm khóa ngoại cho `billiard_table_id` tham chiếu tới `id` của `billiard_tables`
        $table->foreign('billiard_table_id')->references('id')->on('billiard_tables')->onDelete('cascade');
        
        // Thêm khóa ngoại cho `user_id` tham chiếu tới `id` của `users`
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('table_bookings');
    }
}