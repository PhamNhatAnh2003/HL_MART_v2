<?php

namespace App\Repositories;

interface CartRepositoryInterface
{
    public function getCartItemByUserAndProduct($userId, $productId);
    public function updateCartItemQuantity($cartItem, $quantity);
    public function removeCartItem($cartItem);
}