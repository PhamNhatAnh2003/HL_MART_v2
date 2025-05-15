<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use App\Services\CartServiceInterface;

class CartController extends Controller {

    protected $cartService;

    public function __construct(CartServiceInterface $cartService)
    {
        $this->cartService = $cartService;
    }

    public function updateCart(Request $request, $product_id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'quantity' => 'required|integer|min:1'
        ]);

        return $this->cartService->updateCart($request->user_id, $product_id, $request->quantity);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public function removeProduct(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
        ]);

        return $this->cartService->removeProduct($request->user_id, $request->product_id);
    }

        // Thêm sản phẩm vào giỏ hàng
    public function addToCart(Request $request) 
    {
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
        // Lấy dữ liệu từ body request
        $userId = $request->input('user_id');
        $selectedProductIds = $request->input('selected_items'); // mảng [1, 3, 5]

        // Validate
        $validator = Validator::make([
        'user_id' => $userId,
        'selected_items' => $selectedProductIds
         ], [
        'user_id' => 'required|exists:users,id',
        'selected_items' => 'required|array',
        'selected_items.*' => 'exists:cart_items,product_id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Fetch the cart items for the given user and selected product ids
            $cartItems = CartItem::where('user_id', $userId)
                ->whereIn('product_id', $selectedProductIds)
                ->with('product') // Load related product data
                ->get();

            // Format the response data
            $items = $cartItems->map(function ($item) {
            $product = $item->product;

            return [
                'cart_item_id' => $item->id,
                'product_id' => $product->id ?? null,
                'product_name' => $product->name ?? 'Không xác định',
                'quantity' => $item->quantity,
                'unit' => $product->unit ?? 'N/A', // Default to 'N/A' if unit is not available
                'price' => $product->price,
                'discount_price' =>$product->discount_price, // Assuming this field exists in the product table
                'avatar' => $product->avatar ?? null, // Assuming avatar represents the main image URL
                'media' => $product->media ?? [], // Assuming media is an array of image URLs
                'subtotal' => number_format($item->price_at_time * $item->quantity, 2), // Calculating subtotal
                'created_at' => $item->created_at->toIso8601String(),
                'updated_at' => $item->updated_at->toIso8601String(),
            ];
        });

        // Calculate the total price
        $total = $items->sum(function ($item) {
            return floatval($item['subtotal']);
        });

        return response()->json([
            'status' => true,
            'data' => [
                'items' => $items->toArray(),  // Convert to an array to ensure it returns in a list format
                'total' => number_format($total, 2)
            ]
        ]);
        } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Lỗi server khi lấy sản phẩm được chọn',
            'error' => $e->getMessage()
        ], 500);
        }
    }

}