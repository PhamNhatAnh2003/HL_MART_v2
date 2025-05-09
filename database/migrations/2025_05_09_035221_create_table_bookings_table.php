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
            $table->unsignedBigInteger('table_number');
            $table->unsignedBigInteger('user_id');
            $table->enum('status', ['available', 'using', 'reserved'])->default('reserved');
            $table->timestamp('booking_time'); // Thời điểm đặt bàn trước
            $table->timestamp('start_time')->nullable(); // Thực tế bắt đầu dùng
            $table->timestamp('end_time')->nullable();
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
        Schema::dropIfExists('table_bookings');
    }
}
