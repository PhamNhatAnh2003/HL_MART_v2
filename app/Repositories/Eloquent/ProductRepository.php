<?php

namespace App\Repositories\Eloquent;

use App\Models\Product;
use App\Repositories\ProductRepositoryInterface;

class ProductRepository implements ProductRepositoryInterface
{
    public function getLatest($limit)
    {
        return Product::orderBy('created_at', 'desc')->take($limit)->get();
    }

    public function create(array $data)
    {
        return Product::create($data);
    }

    public function update($id, array $data)
    {
        $product = Product::find($id);
        if (!$product) {
            return null;
    }
        $product->update($data);
            return $product;
    }


}
