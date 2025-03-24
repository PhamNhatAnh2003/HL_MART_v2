<?php
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\CartController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// User
Route::post('/login', [UserController::class, 'login']); // Lấy danh sách user
Route::post('/register', [UserController::class, 'register']); // Đăng ký user
Route::get('/user', [UserController::class, 'getUser']); // Lấy user theo ID\


//Product
Route::get('/products/latest', [ProductController::class, 'getLatestProducts']);
Route::get('/product', [ProductController::class, 'getProduct']);
Route::post('/product/create', [ProductController::class, 'createProduct']);

//Review
Route::get('/reviews', [ReviewController::class, 'getReviews']);
Route::post('/review/create', [ReviewController::class, 'createReview']);

//Cart

// Route::middleware('auth:sanctum')->group(function () {
    // Route::get('/cart/{userId}', [CartController::class, 'getCart']);
    Route::post('/addtocart', [CartController::class, 'addtoCart']);
    Route::post('/cart/update/{id}', [CartController::class, 'updateCart']);
    Route::delete('/cart/remove', [CartController::class, 'removeProduct']);
    Route::delete('/cart/clear', [CartController::class, 'deleteCart']);
    Route::get('/cart/{userId}', [CartController::class, 'getCartItems']);
// });
