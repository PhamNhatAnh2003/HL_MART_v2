<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Lấy 5 sản phẩm mới nhất
     */
    public function getLatestProducts()
    {
        $products = Product::orderBy('created_at', 'desc')->take(5)->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }
}
