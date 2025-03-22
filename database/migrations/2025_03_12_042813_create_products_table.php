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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable(); // Định nghĩa ngay sau `price`
            $table->string('avatar')->nullable();
            $table->text('media')->nullable();
             $table->string('unit')->default('pcs'); // 🔥 Thêm trường đơn vị tính, mặc định là "pcs"
            $table->integer('stock');
            $table->integer('sold')->default(0); // Không cần `AFTER stock`
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
