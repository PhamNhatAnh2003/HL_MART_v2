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


public function getUserCart(Request $request)
    {
        // Lấy user đang đăng nhập
        $user = $request->user();

        // Kiểm tra nếu user chưa đăng nhập
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // Lấy danh sách giỏ hàng của user
        $cartItem = Cart::where('user_id', $user->id)->with('product')->get();

        // Kiểm tra nếu giỏ hàng rỗng
        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 200);
        }

        // Tính tổng tiền
        $totalPrice = $cartItems->sum(function ($cart) {
            return $cart->quantity * $cart->price_at_time;
        });

        return response()->json([
            'cart' => $cartItems,
            'total_price' => $totalPrice
        ], 200);

    }


    // Cập nhật số lượng sản phẩm
    public function updateCart(Request $request, $id) {
        $cartItem = CartItem::where('user_id', Auth::id())->where('id', $id)->first();
        if (!$cartItem) {
            return response()->json(['message' => 'Không tìm thấy sản phẩm'], 404);
        }
        $cartItem->update(['quantity' => $request->quantity]);
        return response()->json($cartItem);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public function removeProduct($id) {
        $cartItem = CartItem::where('user_id', Auth::id())->where('id', $id)->first();
        if ($cartItem) {
            $cartItem->delete();
            return response()->json(['message' => 'Đã xóa sản phẩm']);
        }
        return response()->json(['message' => 'Không tìm thấy sản phẩm'], 404);
    }

    // Xóa toàn bộ giỏ hàng
    public function deleteCart() {
        CartItem::where('user_id', Auth::id())->delete();
        return response()->json(['message' => 'Đã xóa toàn bộ giỏ hàng']);
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
        ]);
    }
}