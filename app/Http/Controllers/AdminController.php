<?php

namespace App\Http\Controllers;

use App\Models\Order;  // Nếu có bảng orders
use App\Models\Product;
use App\Models\User;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function dashboardStats()
    {
        // Tổng số người dùng
       $totalUsers = User::where('role', 'user')->count();

        // Tổng số sản phẩm đã bán
        $totalSoldProducts = Product::sum('sold'); // Tính tổng số sản phẩm đã bán

        // Tổng số doanh thu (Giả sử có bảng `orders` lưu thông tin đơn hàng)
        $totalRevenue = Order::sum('total_price'); // Nếu bạn có trường `total_price` trong bảng `orders`

        return response()->json([
            'message' => 'Lấy thông tin thống kê thành công.',
            'data' => [
                'total_users' => $totalUsers,
                'total_sold_products' => $totalSoldProducts,
                'total_revenue' => $totalRevenue,
            ]
        ]);
    }


    public function getHighestIncomeProduct()
    {
        try {
            // Lấy sản phẩm có doanh thu cao nhất từ bảng `order_items`
            $highestIncomeProduct = DB::table('order_items')
                ->select('product_id', DB::raw('SUM(quantity * price) as total_price'))
                ->groupBy('product_id')
                ->orderByDesc('total_price')
                ->first();  // Chọn sản phẩm có doanh thu cao nhất

            // Kiểm tra nếu có sản phẩm
            if ($highestIncomeProduct) {
                // Lấy thông tin chi tiết sản phẩm từ bảng `products`
                $product = Product::find($highestIncomeProduct->product_id);

                return response()->json([
                    'success' => true,
                    'data' => [
                        'product_name' => $product->name,
                        'total_price' => $highestIncomeProduct->total_price,
                        'price' => $product->price,
                    ],
                    'message' => 'Lấy sản phẩm có doanh thu cao nhất thành công.'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Không có sản phẩm có doanh thu cao nhất.'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ]);
        }
    }

    public function getMostSoldProduct()
    {
        try {
            // Lấy sản phẩm bán chạy nhất từ bảng `order_items`
            $mostSoldProduct = DB::table('order_items')
                ->select('product_id', DB::raw('SUM(quantity) as quantity'))
                ->groupBy('product_id')
                ->orderByDesc('quantity')
                ->first();  // Chọn sản phẩm bán chạy nhất

            // Kiểm tra nếu có sản phẩm
            if ($mostSoldProduct) {
                // Lấy thông tin chi tiết sản phẩm từ bảng `products`
                $product = Product::find($mostSoldProduct->product_id);

                return response()->json([
                    'success' => true,
                    'data' => [
                        'product_name' => $product->name,
                        'quantity' => $mostSoldProduct->quantity,
                        'price' => $product->price,
                    ],
                    'message' => 'Lấy sản phẩm bán chạy nhất thành công.'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Không có sản phẩm bán chạy nhất.'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi: ' . $e->getMessage()
            ]);
        }
    }


    public function filter(Request $request)
    {
        // Lấy các tham số đầu vào từ request
        $category = $request->input('category');
        $minPrice = $request->input('minPrice');
        $maxPrice = $request->input('maxPrice');
        $name = $request->input('name');

        // Xây dựng query để lọc sản phẩm
        $query = Product::query();

        // Thêm điều kiện lọc cho từng tham số nếu có
        if ($category) {
            $query->where('category_name', $category);
        }
        
        if ($name) {
            $query->where('product_name', 'like', '%' . $name . '%');
        }

        if ($minPrice && $maxPrice) {
            $query->whereBetween('price', [$minPrice, $maxPrice]);
        }

        // Lấy danh sách sản phẩm sau khi lọc
        $products = $query->get();

        // Trả về kết quả dưới dạng JSON
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

     public function getProductList()
    {
        $products = Product::with('category') // nếu có quan hệ với Category
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách sản phẩm thành công.',
            'products' => ProductResource::collection($products),
        ]);
    }
}
