<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BilliardTable extends Model
{
    protected $fillable = ['name', 'status'];
    
    public function latestBooking()
{
    return $this->hasOne(TableBooking::class)->latestOfMany();
}

}

