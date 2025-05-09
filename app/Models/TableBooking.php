<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TableBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'table_number',
        'user_id',
        'status',
        'booking_time',
        'start_time',
        'name'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(TableItem::class);
    }

    public function billiardTable()
{
    return $this->belongsTo(BilliardTable::class, 'billiard_table_id');
}
}
