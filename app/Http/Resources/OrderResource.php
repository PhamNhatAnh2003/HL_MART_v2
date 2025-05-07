<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'receiver_name' => $this->address ? $this->address->receiver_name : null, // Truyền thông tin tên người nhận từ bảng addresses
            'phone' => $this->address ? $this->address->phone : null,
            'total_price' => $this->total_price,
            'payment_method' => $this->payment_method,
            'status' => $this->status,
            'shipping_address' => $this->shipping_address,
            'created_at' => $this->created_at,
        ];
    }
}
