<?php
use App\Http\Controllers\ProductController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\User\ReviewController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\UploadController;
use App\Http\Controllers\API\AddressController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\User\OrderController;
use App\Http\Controllers\API\FavoriteController;
use App\Http\Controllers\Billiard\TableBookingController;
use App\Http\Controllers\Payment\VnPayController;
use App\Http\Controllers\Staff\ProductManageController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// User
Route::post('/login', [UserController::class, 'login']); 
Route::post('/register', [UserController::class, 'register']); // Đăng ký user
Route::get('/user', [UserController::class, 'getUser']); // Lấy user theo ID\
Route::post('/user/{id}', [UserController::class, 'updateUser']);


//Product
Route::get('/products/latest', [ProductController::class, 'getLatestProducts']);
Route::get('/product', [ProductController::class, 'getProduct']);
Route::post('/product/create', [ProductController::class, 'createProduct']);
Route::post('/product/category/create', [ProductController::class, 'productCategoryCreate']);
Route::get('/products', [ProductController::class, 'getProducts']);
Route::get('/category/{category_id}', [ProductController::class, 'getProductsByCategory']);
Route::post('/product/update/{id}', [ProductController::class, 'updateProduct']);
Route::get('product_v/{id}', [ProductController::class, 'getProduct_v']);
Route::get('/top-products', [ProductController::class, 'getTopProducts']);


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
Route::post('create_categories', [CategoryController::class, 'addCategory']);
Route::put('update_categories/{id}', [CategoryController::class, 'update']);
Route::delete('delete_categories/{id}', [CategoryController::class, 'delete']);


//Order
Route::post('/create-order', [OrderController::class, 'CreateOrder']);
Route::get('/orders/user/{userId}', [OrderController::class, 'getOrdersByUser']);
Route::get('/orders/{id}', [OrderController::class, 'getOrderDetail']);
Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);
Route::get('/orders', [OrderController::class, 'getOrders']);
Route::post('orders/{id}/status', [OrderController::class, 'updateStatus']);
Route::post('check-stock', [OrderController::class, 'checkStock']);


//address
Route::get('/addresses', [AddressController::class, 'getAddresses']);
Route::post('/add-address', [AddressController::class, 'addAddress']);
Route::post('address/update/{id}', [AddressController::class, 'updateAddress']);
Route::delete('/delete-address/{id}', [AddressController::class, 'deleteAddress']);
Route::post('/set-default-address', [AddressController::class, 'setDefault']);


//admin
Route::get('dashboard/stats', [AdminController::class, 'dashboardStats']);
Route::get('/product/most-sold', [AdminController::class, 'getMostSoldProduct']);
Route::get('/product/highest-income', [AdminController::class, 'getHighestIncomeProduct']);
Route::get('products/filter', [AdminController::class, 'filter']);
Route::get('/productlist', [AdminController::class, 'getProductList']);
Route::delete('/product/delete/{id}', [AdminController::class, 'deleteProduct']);
Route::get('/v1/users', [AdminController::class, 'getFilteredUsers']);
Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
Route::post('/admin/change-role', [AdminController::class, 'changeRole']);
Route::get('/revenue-by-time', [AdminController::class, 'getRevenueByTime']);


// favorite
Route::post('/favorite-toggle', [FavoriteController::class, 'toggleFavorite']);
Route::get('/is-favorite', [FavoriteController::class, 'isFavorite']);
Route::get('/favorites_home', [FavoriteController::class, 'getFavoritesInHome']);


// Billiard
Route::get('/billiard-tables', [TableBookingController::class, 'listtable']);
Route::post('/book-table', [TableBookingController::class, 'bookTable']);
Route::get('/my-bookings', [TableBookingController::class, 'myBookings']);
Route::post('/cancel-booking', [TableBookingController::class, 'cancel']);

// Vnpay
Route::post('/vnpay-payment', [VNPayController::class, 'createPayment']); // Cho phép POST
Route::get('/vnpay-return', [VnPayController::class, 'vnpayReturn'])->name('vnpay.return');

//staff
Route::get('/staff/all_product', [ProductManageController::class, 'getAllProduct']);
Route::delete('/staff/product/delete/{id}', [ProductManageController::class, 'deleteProduct_v']);
Route::post('/products/{id}/stock', [ProductManageController::class, 'updateStock']);
