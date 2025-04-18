<?php
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\AddressController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// User
Route::post('/login', [UserController::class, 'login']); // Lấy danh sách user
Route::post('/register', [UserController::class, 'register']); // Đăng ký user
Route::get('/user', [UserController::class, 'getUser']); // Lấy user theo ID\
Route::post('/user/{id}', [UserController::class, 'updateUser']);


//Product
Route::get('/products/latest', [ProductController::class, 'getLatestProducts']);
Route::get('/product', [ProductController::class, 'getProduct']);
Route::post('/product/create', [ProductController::class, 'createProduct']);
Route::post('/product/category/create', [ProductController::class, 'productCategoryCreate']);
Route::get('/products', [ProductController::class, 'getProducts']);
// Route::get('/products', [ProductController::class, 'getProductsByCategory']);
Route::get('/category/{category_id}', [ProductController::class, 'getProductsByCategory']);


//Upload
Route::post('/upload/images', [UploadController::class, 'uploadImages']);
Route::post('/upload/image', [UploadController::class, 'uploadImage']);

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
    Route::post('/cart/selected-items', [CartController::class, 'getSelectedItems']);
// });


// Catelogy
Route::get('categories', [CategoryController::class, 'index']); // Lấy danh sách danh mục
Route::get('categories/{id}', [CategoryController::class, 'show']); // Lấy chi tiết một danh mục


//address
Route::get('/addresses', [AddressController::class, 'getAddresses']);
Route::post('/add-address', [AddressController::class, 'addAddress']);
Route::post('address/update/{id}', [AddressController::class, 'updateAddress']);
Route::delete('/delete-address/{id}', [AddressController::class, 'deleteAddress']);
Route::post('/set-default-address', [AddressController::class, 'setDefault']);