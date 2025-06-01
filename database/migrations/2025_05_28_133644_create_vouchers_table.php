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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();               
            $table->enum('type', ['percent', 'fixed']);     
            $table->decimal('value', 10, 2);                
            $table->decimal('min_order', 10, 2)->default(0);
            $table->integer('max_usage')->nullable();       
            $table->integer('used')->default(0);            
            $table->string('title');                        
            $table->text('description')->nullable();                  
            $table->timestamp('starts_at')->nullable();     
            $table->timestamp('expires_at')->nullable();    
            $table->boolean('is_active')->default(true);    
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
