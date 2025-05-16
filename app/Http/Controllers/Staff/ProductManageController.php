<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Http\Controllers\UploadController;
use Illuminate\Http\Request;
use App\Models\Order;  // Nếu có bảng orders
use App\Models\Product;
use App\Models\User;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class ProductManageController extends Controller
{
    public function getAllProduct()
    {
        $products = Product::with('category') // nếu có quan hệ với Category
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách sản phẩm thành công.',
            'products' => ProductResource::collection($products),
        ]);
    }

    public function deleteProduct_v($id)
    {
        try {
        // Tìm sản phẩm theo ID
        $product = Product::findOrFail($id);

        // Xóa avatar nếu có
        if ($product->avatar) {
            UploadController::deleteImage($product->avatar);
        }

        // Xóa media nếu có
        if ($product->media) {
            $mediaImages = json_decode($product->media, true);
            if (is_array($mediaImages)) {
                foreach ($mediaImages as $mediaImage) {
                    UploadController::deleteImage($mediaImage);
                }
            }
        }

        // Xóa sản phẩm
        $product->delete();

        return response()->json([
            'message' => 'Sản phẩm đã được xóa thành công!',
        ], 200);
     } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Không tìm thấy sản phẩm.',
        ], 404);
     }
    }

    public function updateStock(Request $request, $id)
{
    $request->validate([
        'stock' => 'required|integer|min:0',
    ]);

    $product = Product::findOrFail($id);
    $product->stock = $request->stock;
    $product->save();

    return response()->json(['message' => 'Cập nhật số lượng thành công'], 200);
}

}
