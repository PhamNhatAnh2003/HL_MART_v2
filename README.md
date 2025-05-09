bảng màu mặc định:
Mức độ	    Mã màu	        Ghi chú
1	      #e6f7ff	       Rất nhạt (lightest)
2	      #bae7ff	       Nhạt
3	      #91d5ff	       Trung bình nhạt
4	      #69c0ff	       Trung bình
5	      #40a9ff	       Màu chủ đạo (primary color)
6	      #1890ff	       Màu chính mặc định
7	      #096dd9	       Đậm
8	      #0050b3	       Rất đậm
9	      #003a8c	       Gần như đen xanh
10	      #002766	       Tối nhất
ahhihia


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
