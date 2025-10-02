# Hướng dẫn cài đặt và chạy dự án HL_MART_v2

## Yêu cầu hệ thống

-   Node.js
-   XAMPP
-   Composer
-   Laravel

## Cài đặt

### 1. Cài đặt Node.js

Tải và cài đặt Node.js từ trang chủ: [Node.js](https://nodejs.org/)

### 2. Cài đặt XAMPP

Tải và cài đặt XAMPP từ trang chủ: [XAMPP](https://www.apachefriends.org/index.html)

### 3. Cài đặt Composer

Tải và cài đặt Composer từ trang chủ: [Composer](https://getcomposer.org/)

### 4. Cài đặt Laravel

Mở terminal và chạy lệnh sau để cài đặt Laravel:

```sh
composer global require laravel/installer
```

## Cách chạy project

### 1. Clone repository

Clone repository từ GitHub vào folder htdocs của xampp:

```sh
git clone [https://github.com/PhamNhatAnh2003/HL_MART_v2.git]
```

### 2. Cài đặt các package cần thiết

Chạy các lệnh sau trong thư mục dự án để cài đặt các package cần thiết:

```sh
composer install
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` từ file mẫu `.env.example`:

```sh
cp .env.example .env
php artisan key:generate
```

Thay đổi các thông số cần thiết trong file `.env`:


### 4. Chạy XAMPP

Mở XAMPP và khởi động Apache và MySQL.

### 5. Chạy migration và seed database

Chạy các lệnh sau để tạo bảng và seed dữ liệu:

```sh
php artisan migrate
php artisan db:seed
php artisan storage:link
```

### 6. Chạy server

Chạy các lệnh sau:

```sh
npm run dev
php artisan serve
```

Mở trình duyệt và truy cập `http://localhost:8000` để xem kết quả.

