<?php
namespace App\Repositories\Eloquent;

use App\Models\CartItem;
use App\Repositories\CartRepositoryInterface;

class CartRepository implements CartRepositoryInterface
{
    public function getCartItemByUserAndProduct($userId, $productId)
    {
        return CartItem::where('user_id', $userId)
                        ->where('product_id', $productId)
                        ->first();
    }

    public function updateCartItemQuantity($cartItem, $quantity)
    {
        return $cartItem->update(['quantity' => $quantity]);
    }

    public function removeCartItem($cartItem)
    {
        return $cartItem->delete();
    }

}
