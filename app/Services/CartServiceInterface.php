<?php
namespace App\Services;

interface CartServiceInterface
{
    public function updateCart($userId, $productId, $quantity);
    public function removeProduct($userId, $productId);
}
