<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'discount_price',
        'avatar',
        'media',
        'unit',
        'stock',
        'sold',
        'category_id',
    ];

    protected $casts = [
        'media' => 'array',
    ];
    protected $appends = ['category_name'];

    public function categories()
    {
    return $this->belongsToMany(Category::class, 'category_product', 'product_id', 'category_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getCategoryNameAttribute()
    {
        return $this->category ? $this->category->name : null;
    }
}
