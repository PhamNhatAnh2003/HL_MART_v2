<?php
namespace App\Services;

use App\Repositories\CartRepositoryInterface;

class CartService implements CartServiceInterface
{
    protected $cartRepo;

    public function __construct(CartRepositoryInterface $cartRepo)
    {
        $this->cartRepo = $cartRepo;
    }

    public function updateCart($userId, $productId, $quantity)
    {
        // Kiểm tra sản phẩm có trong giỏ hàng không
        $cartItem = $this->cartRepo->getCartItemByUserAndProduct($userId, $productId);

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm không có trong giỏ hàng'
            ], 404);
        }

        // Cập nhật số lượng sản phẩm
        $this->cartRepo->updateCartItemQuantity($cartItem, $quantity);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật số lượng sản phẩm thành công',
            'cart_item' => $cartItem
        ], 200);
    }

    public function removeProduct($userId, $productId)
    {
        // Kiểm tra sản phẩm có trong giỏ hàng không
        $cartItem = $this->cartRepo->getCartItemByUserAndProduct($userId, $productId);

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm không có trong giỏ hàng'
            ], 404);
        }

        // Xóa sản phẩm khỏi giỏ hàng
        $this->cartRepo->removeCartItem($cartItem);

        return response()->json([
            'success' => true,
            'message' => 'Xóa sản phẩm thành công'
        ], 200);
    }
    
}