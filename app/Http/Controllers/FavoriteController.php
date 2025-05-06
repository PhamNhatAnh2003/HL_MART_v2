<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;
use App\Models\Favorite;

class FavoriteController extends Controller
{
public function toggleFavorite(Request $request)
{
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'product_id' => 'required|exists:products,id',
    ]);

    $favorite = \App\Models\Favorite::where('user_id', $validated['user_id'])
        ->where('product_id', $validated['product_id'])
        ->first();

    if ($favorite) {
        $favorite->delete();
        return response()->json([
            'status' => true,
            'message' => 'Đã xoá khỏi danh sách yêu thích',
            'is_favorite' => false,
        ]);
    } else {
        $newFavorite = \App\Models\Favorite::create($validated);
        return response()->json([
            'status' => true,
            'message' => 'Đã thêm vào danh sách yêu thích',
            'is_favorite' => true,
        ]);
    }
}

public function isFavorite(Request $request)
{
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'product_id' => 'required|exists:products,id',
    ]);

    $isFavorite = Favorite::where('user_id', $validated['user_id'])
        ->where('product_id', $validated['product_id'])
        ->exists();

    return response()->json([
        'is_favorite' => $isFavorite,
    ]);
}

public function getFavoritesInHome(Request $request) {
    $userId = $request->query('user_id') ?? null;

    if (!$userId) {
        return response()->json([
            'products' => [],
            'message' => 'Chưa chỉ định ID người dùng.',
        ], 400);
    }

    $favorites = Favorite::where('user_id', $userId)
        ->with('product') // Chuyển từ 'restaurant' sang 'product'
        ->limit(5)
        ->get();

    $products = $favorites->map(function ($fav) {
        return $fav->product; // Chuyển từ 'restaurant' sang 'product'
    });

    return response()->json([
        'products' => [
            'data' => ProductResource::collection($products->map(function ($product) use ($userId) {
                return new ProductResource($product, $userId); 
            }))
        ],
        'message' => 'Đã lấy danh sách yêu thích.',
    ], 200);
}

    
}
