<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TableItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'table_booking_id',
        'item_name',
        'quantity',
        'unit_price',
    ];

    public function booking()
    {
        return $this->belongsTo(TableBooking::class);
    }
}

