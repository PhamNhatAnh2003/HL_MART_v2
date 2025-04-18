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
    Schema::create('addresses', function (Blueprint $table) {
        $table->id('address_id');
        $table->foreignId('user_id')->constrained('users', 'id')->onDelete('cascade');
        $table->string('receiver_name');
        $table->string('phone');
        $table->string('province');
        $table->string('district');
        $table->string('ward');
        $table->string('street_address');
        $table->boolean('is_default')->default(false);
        $table->string('note')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
