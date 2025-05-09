<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBilliardTablesTable extends Migration
{
    public function up(): void
    {
        Schema::create('billiard_tables', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Tên bàn (ví dụ: Bàn 1, Bàn VIP, v.v.)
            $table->enum('status', ['available', 'reserved', 'using'])->default('available');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('billiard_tables');
    }
}
