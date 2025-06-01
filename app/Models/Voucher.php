<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $fillable = [
        'code', 'type', 'value', 'min_order', 'max_usage', 'used',
        'title', 'description', 
        'starts_at', 'expires_at', 'is_active',
    ];
    
}
