<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'unit',
        'quantity',
        'price_at_time',
    ];

    /**
     * Quan hệ với người dùng (user).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'cart_id', 'id');
    }

    /**
     * Quan hệ với sản phẩm (product).
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
