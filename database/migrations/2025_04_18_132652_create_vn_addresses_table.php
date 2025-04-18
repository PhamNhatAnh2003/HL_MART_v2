<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('vn_addresses', function (Blueprint $table) {
        $table->id();
        $table->string('province');
        $table->string('district');
        $table->string('ward');
        $table->string('type');    // ví dụ: "Thành phố", "Quận", "Phường"
        $table->string('prefix');  // ví dụ: "TP.", "Q.", "P."
        $table->string('code');    // mã hành chính nếu có
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vn_addresses');
    }
};
