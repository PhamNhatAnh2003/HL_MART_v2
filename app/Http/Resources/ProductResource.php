<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
     public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'discount_price' => $this->discount_price,
            'avatar' => $this->avatar,
            'media' => json_decode($this->media, true),
            'stock' => $this->stock,
            'unit' => $this->unit,
            'sold' => $this->sold,
            'category_id' => $this->category_id,
            'category_name' => $this->category_name ?? null,
            'rating' => round($this->reviews->avg('rating'), 2),
            'number' => $this->reviews->count(),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
