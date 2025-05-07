<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'status', 'total_price', 'payment_method', 'shipping_address', 'ordered_at','customer_name', 'phone'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function orderItems() 
    {
        return $this->hasMany(OrderItem::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function address()
    {
        return $this->hasOne(Address::class, 'user_id', 'user_id'); // Đảm bảo rằng mối quan hệ với địa chỉ được định nghĩa chính xác
    }
}

