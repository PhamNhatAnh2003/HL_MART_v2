<?php
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// User
Route::post('/login', [UserController::class, 'login']); // Lấy danh sách user
Route::post('/register', [UserController::class, 'register']); // Đăng ký user
Route::get('/user', [UserController::class, 'getUser']); // Lấy user theo ID\


//Product
Route::get('/products/latest', [ProductController::class, 'getLatestProducts']);
