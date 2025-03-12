<?php

use App\Http\Controllers\UserController;

Route::post('/login', [UserController::class, 'login']); // Lấy danh sách user
Route::post('/register', [UserController::class, 'register']); // Đăng ký user
Route::get('/users/{id}', [UserController::class, 'show']); // Lấy user theo ID
