<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CartController extends Controller {

    // Cập nhật số lượng sản phẩm
   public function updateCart(Request $request, $product_id) {
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'quantity' => 'required|integer|min:1'
    ]);

    // 🔍 Kiểm tra sản phẩm có trong giỏ hàng không
    $cartItem = CartItem::where('user_id', $request->user_id)
                        ->where('product_id', $product_id)
                        ->first();

    if (!$cartItem) {
        return response()->json([
            'success' => false,
            'message' => 'Sản phẩm không có trong giỏ hàng'
        ], 404);
    }

    // 🔄 Cập nhật số lượng sản phẩm
    $cartItem->update(['quantity' => $request->quantity]);

    return response()->json([
        'success' => true,
        'message' => 'Cập nhật số lượng sản phẩm thành công',
        'cart_item' => $cartItem
    ], 200);
   }

    // Xóa sản phẩm khỏi giỏ hàng
public function removeProduct(Request $request) {
    // Xác thực request
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'product_id' => 'required|exists:products,id',
    ]);

    // Tìm sản phẩm trong giỏ hàng
    $cartItem = CartItem::where('user_id', $request->user_id)
                        ->where('product_id', $request->product_id)
                        ->first();

    // Kiểm tra nếu không tìm thấy
    if (!$cartItem) {
        return response()->json([
            'success' => false,
            'message' => 'Sản phẩm không có trong giỏ hàng'
        ], 404);
    }

    // Xóa sản phẩm
    $cartItem->delete();

    return response()->json([
        'success' => true,
        'message' => 'Xóa sản phẩm thành công'
    ], 200);
}


        // Thêm sản phẩm vào giỏ hàng
public function addToCart(Request $request) {
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'product_id' => 'required|exists:products,id',
        'unit' => 'nullable|string|max:50',
        'quantity' => 'nullable|integer|min:1',
        'price_at_time' => 'required|numeric|min:0'
    ]);

    // 🔍 Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    $cartItem = CartItem::where('user_id', $request->user_id)
                        ->where('product_id', $request->product_id)
                        ->first();

    if ($cartItem) {
        // Nếu đã có, tăng số lượng sản phẩm
        $cartItem->increment('quantity', $request->input('quantity', 1));
    } else {
        // Nếu chưa có, thêm mới vào giỏ hàng
        $cartItem = CartItem::create([
            'user_id' => $request->user_id,
            'product_id' => $request->product_id,
            'unit' => $request->unit ?? 'default_unit', // Đảm bảo có đơn vị tính
            'quantity' => $request->input('quantity', 1),
            'price_at_time' => $request->price_at_time
        ]);
    }

   return response()->json([
        'success' => true,
        'message' => 'Thêm vào giỏ hàng thành công',
        'cart_item' => $cartItem
    ], 200);
   }

    // Lấy danh sách giỏ hàng của người dùng
       public function getCartItems($userId)
    {
        $cartItems = CartItem::where('user_id', $userId)
            ->with('product') // Load thông tin sản phẩm từ model Product
            ->get();

        return response()->json([
            'success' => true,
            'cart_items' => $cartItems
        ], 200);
    }
    
public function getSelectedItems(Request $request)
{
    try {
        // Xác thực dữ liệu gửi lên từ client
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id', // Thêm xác thực user_id
            'selected_items' => 'required|array',
            'selected_items.*' => 'exists:cart_items,id'
        ]);

        // Lấy user_id từ request thay vì dùng Auth
        $userId = $validated['user_id'];

        // Truy vấn các item được chọn thuộc user
        $cartItems = CartItem::whereIn('id', $validated['selected_items'])
            ->where('user_id', $userId)
            ->with('product') // Quan hệ CartItem -> Product
            ->get();

        // Format lại dữ liệu trả về
        $items = $cartItems->map(function ($item) {
            $product = $item->product;

            return [
                'cart_item_id' => $item->id,
                'product_id' => $product->id,
                'product_name' => $product->name ?? 'Không xác định',
                'unit' => $item->unit ?? 'Chưa rõ',
                'quantity' => $item->quantity,
                'unit_price' => round($item->price_at_time),
                'subtotal' => round($item->price_at_time * $item->quantity),
                'image_url' => $product->image_url ?? null // nếu có cột ảnh trong bảng products
            ];
        });

        // Tổng tiền
        $total = $items->sum('subtotal');

        // Trả về response JSON
        return response()->json([
            'status' => true,
            'data' => [
                'items' => $items,
                'total' => $total
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Có lỗi xảy ra khi lấy sản phẩm được chọn',
            'error' => $e->getMessage()
        ], 500);
    }
}


}