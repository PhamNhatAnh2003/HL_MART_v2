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
        Schema::create('shipping', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('receiver_name');
            $table->string('receiver_phone');
            $table->text('address');
            $table->string('shipping_status')->default('pending'); // pending, shipped, delivered, failed
            $table->string('shipping_method')->default('standard'); // express, standard
            $table->string('tracking_number')->nullable();
            $table->date('estimated_delivery')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping');
    }
};
