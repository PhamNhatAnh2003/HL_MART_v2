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
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AdminController extends Controller
{
    public function getRevenueByTime(Request $request)
    {
        $timeFrame = $request->query('time_frame', 'daily');

        $query = DB::table('orders')
            ->where('status', 'completed') // Chỉ lấy đơn hàng đã hoàn thành
            ->selectRaw('SUM(total_price) as revenue');

        switch ($timeFrame) {
            case 'daily':
                $query->selectRaw('DATE(ordered_at) as date')
                    ->groupBy('date')
                    ->orderBy('date', 'asc');
                break;
            case 'monthly':
                $query->selectRaw("DATE_FORMAT(ordered_at, '%Y-%m') as month")
                    ->groupBy('month')
                    ->orderBy('month', 'asc');
                break;
            case 'yearly':
                $query->selectRaw("YEAR(ordered_at) as year")
                    ->groupBy('year')
                    ->orderBy('year', 'asc');
                break;
            default:
                return response()->json(['error' => 'Invalid time frame'], 400);
        }

        $data = $query->get();

        return response()->json([
            'data' => $data,
            'time_frame' => $timeFrame,
        ]);
    }


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
                ->select('product_id', DB::raw('SUM(quantity * price_at_time) as total_price'))
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
                        'price_at_time' => $product->price_at_time,
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
                        'product' => new ProductResource($product),
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
        $category = $request->query('category');
        $minPrice = $request->query('minPrice');
        $maxPrice = $request->query('maxPrice');
        $name = $request->query('name');

        $query = Product::query();

        // Lọc theo danh mục (join bảng categories)
        if (!empty($category)) {
            $query->join('categories', 'products.category_id', '=', 'categories.id')
                 ->where('categories.name', $category);
        }

        // Lọc theo tên sản phẩm (dùng đúng tên cột trong bảng products)
        if (!empty($name)) {
            $query->where('products.name', 'like', '%' . $name . '%'); // Đổi từ 'product_name' thành 'name'
        }

        // Lọc theo giá
        if (is_numeric($minPrice) && is_numeric($maxPrice)) {
            $query->whereBetween('products.price', [$minPrice, $maxPrice]);
        }

        // Lấy sản phẩm sau khi lọc
        $products = $query->get();

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($products),
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

    public function deleteProduct($id)
    {
     try {
        // Tìm sản phẩm theo ID
        $product = Product::findOrFail($id);

        // Xóa avatar nếu có
        if ($product->avatar) {
            UploadController::deleteImage($product->avatar);
        }

        // Xóa media nếu có
        if ($product->media) {
            $mediaImages = json_decode($product->media, true);
            if (is_array($mediaImages)) {
                foreach ($mediaImages as $mediaImage) {
                    UploadController::deleteImage($mediaImage);
                }
            }
        }

        // Xóa sản phẩm
        $product->delete();

        return response()->json([
            'message' => 'Sản phẩm đã được xóa thành công!',
        ], 200);
     } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Không tìm thấy sản phẩm.',
        ], 404);
     }
    }

    public function getFilteredUsers(Request $request)
    {
        $query = User::query();

        // Thêm các điều kiện lọc theo tên, email, điện thoại, và địa chỉ
        if ($request->has('name')) {
        $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->has('email')) {
        $query->where('email', 'like', '%' . $request->email . '%');
        }

        if ($request->has('phone')) {
        $query->where('phone', 'like', '%' . $request->phone . '%');
        }

        if ($request->has('address')) {
        $query->where('address', 'like', '%' . $request->address . '%');
        }

        // Sử dụng with() để tải luôn quan hệ cartItems của mỗi người dùng
        $users = $query->with('cartItems.product')->get(); // Thêm 'cartItems.product' để lấy thông tin sản phẩm của mỗi cart item

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function deleteUser($id)
    {
        // Tìm người dùng theo ID
        $user = User::find($id);

        // Nếu không tìm thấy người dùng, trả về lỗi
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Xóa người dùng
        $user->delete();

        // Trả về phản hồi thành công
        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }

    public function changeRole(Request $request)
    {
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'role' => 'required|in:user,admin,staff', // tuỳ vào roles bạn sử dụng
    ]);

    $user = User::find($request->user_id);
    $user->role = $request->role;
    $user->save();

    return response()->json(['success' => true, 'message' => 'Vai trò đã được cập nhật']);
    }

    public function getOrderDetailByUser($id)
    {
        $order = Order::with(['orderItems.product'])
                      ->where('id', $id)
                      ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        $data = $order->orderItems->map(function ($item) {
            return [
                'order_item_id'  => $item->id,
                'product_name'   => $item->product->name ?? 'N/A',
                'avatar'         => $item->product->avatar ?? '',
                'quantity'       => $item->quantity,
                'price_at_time'  => $item->price_at_time,
            ];
        });

        return response()->json([
            'success' => true,
            'order_id' => $order->id,
            'data'    => $data,
        ]);
    }
    
    public function deleteOrder($id)
{
    $order = Order::find($id);

    if (!$order) {
        return response()->json([
            'success' => false,
            'message' => 'Đơn hàng không tồn tại.',
        ], 404);
    }

    try {
        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa đơn hàng thành công.',
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Xóa đơn hàng thất bại.',
            'error' => $e->getMessage(),
        ], 500);
    }
}


}
