<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Lấy 5 sản phẩm mới nhất
     */
    public function getLatestProducts()
    {
    $products = Product::orderBy('created_at', 'desc')->take(4)->get();
    return response()->json([
        'success' => true,
        'data' => ProductResource::collection($products),
    ]);
    }

    public function getProduct(Request $request)
    {
        $id = $request->query('id');
        $userId = $request->query('user_id') ?? null;

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Sản phẩm không tồn tại.'
            ], 404);
        }

        return response()->json([
            'message' => 'Lấy sản phẩm thành công.',
            'product' => new ProductResource($product),
        ], 200);
    }
    
    public function createProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'media.*' => 'nullable|mimes:jpg,jpeg,png,mp4,avi,mkv|max:20480000',
            'description' => 'nullable|string',
            'price' => 'required|integer|min:0',
            'discount_price' => 'nullable|integer|min:0',
            'stock' => 'required|integer|min:0',
            'sold' => 'nullable|integer|min:0',
            'unit' => 'required|string|max:50', // 🔥 Thêm đơn vị tính, bắt buộc nhập
        ]);

        if ($request->filled('discount_price') && $request->input('price') <= $request->input('discount_price')) {
            return response()->json(['message' => 'Giá khuyến mãi phải nhỏ hơn giá gốc'], 422);
        }

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 422);
        }

        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $avatarName = time() . '_avatar_' . uniqid() . '.' . $avatar->extension();
            $avatar->storeAs('images', $avatarName, 'public');
            $avatarPath = "/storage/images/$avatarName";
        }

        $mediaPaths = [];
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $mediaFile) {
                $mediaName = time() . '_media_' . uniqid() . '.' . $mediaFile->extension();
                $mediaFile->storeAs('images', $mediaName, 'public');
                $mediaPaths[] = "/storage/images/$mediaName";
            }
        }

        $product = Product::create([
            'name' => $request->input('name'),
            'avatar' => $avatarPath,
            'media' => json_encode($mediaPaths),
            'description' => $request->input('description'),
            'price' => $request->input('price'),
            'discount_price' => $request->input('discount_price'),
            'unit' => $request->input('unit'),
            'stock' => $request->input('stock'),
            'sold' => $request->input('sold'),
        ]);

        return response()->json([
            'message' => 'Tạo sản phẩm thành công',
            'product' => $product,
        ], 200);
    }

    public function productCategoryCreate(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
                'category_id' => 'required|exists:categories,id'
            ]);

            $product = Product::find($request->product_id);

            // Kiểm tra xem style đã tồn tại chưa
            if ($product->categories()->where('category_id', $request->category_id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'da ton tai'
                ], 400);
            }

            // Thêm style mới
            $product->categories()->attach($request->category_id);
            $product->category_id = $request->category_id;
            $product->save();

            return response()->json([
                'success' => true,
                'message' => 'thanh cong。'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'hihni',
                'error' => $e->getMessage()
            ], 500);
        }
    }


public function getProductsByCategory($categoryId, Request $request)
{
    // Kiểm tra danh mục có tồn tại không
    $category = Category::find($categoryId);
    if (!$category) {
        return response()->json([
            'message' => 'Danh mục không tồn tại',
            'products' => []
        ], 404);
    }

    // Lấy danh sách sản phẩm theo category_id
    $products = Product::where('category_id', $categoryId);

    // Xử lý sắp xếp theo giá (price)
    $sortPrice = $request->query('sort_price'); // 'asc' hoặc 'desc'
    if (in_array($sortPrice, ['asc', 'desc'])) {
        $products->orderBy('price', $sortPrice);
    }

    // Xử lý sắp xếp theo đánh giá (rating)
    $sortRating = $request->query('sort_rating'); // 'asc' hoặc 'desc'
    if (in_array($sortRating, ['asc', 'desc'])) {
        $products->orderBy('rating', $sortRating);
    }

    // Lấy số lượng sản phẩm mỗi trang (mặc định: 10)
    $perPage = $request->query('per_page', 10);
    $products = $products->paginate($perPage);

    // Trả về danh sách sản phẩm
    return response()->json([
        'message' => 'Lấy danh sách sản phẩm thành công',
        'category' => $category->name,
        'products' => ProductResource::collection($products),
    ], 200);
}


public function getProducts(Request $request)
{
    $categoryId = $request->query('category_id');
    $ratings = $request->query('ratings');
    $rating = $request->query('rating');
    $name = $request->query('name');
    $start = $request->query('start');
    $end = $request->query('end');
    $sort_rating = $request->query('sort_rating');
    $sort_price = $request->query('sort_price');
    $sort_time = $request->query('sort_time');
    $userId = $request->query('user_id');
    $perPage = $request->query('per_page', 10);

    $products = Product::withAvg('reviews', 'rating');

    // 🏷️ Lọc theo danh mục
    if ($categoryId) {
        $products->where('category_id', $categoryId);
    }

    // ⭐ Lọc theo đánh giá trung bình
    if ($rating) {
        $products->havingRaw('reviews_avg_rating >= ?', [$rating]);
    } elseif ($ratings) {
        $ratingsArray = explode(',', $ratings);
        $products->havingRaw('reviews_avg_rating IN (' . implode(',', array_map('intval', $ratingsArray)) . ')');
    }

    // 🔍 Lọc theo tên sản phẩm
    if ($name) {
        $products->where('name', 'like', "%{$name}%");
    }

    // 💰 Lọc theo khoảng giá
    if ($start !== null && $end !== null) {
        $products->whereBetween(DB::raw('COALESCE(discount_price, price)'), [$start, $end]);
    } elseif ($start !== null) {
        $products->whereRaw('COALESCE(discount_price, price) >= ?', [$start]);
    } elseif ($end !== null) {
        $products->whereRaw('COALESCE(discount_price, price) <= ?', [$end]);
    }

    // 🏷️ Kiểm tra nếu không có sản phẩm phù hợp
    if (!$products->exists()) {
        return response()->json([
            'message' => 'Không tìm thấy sản phẩm nào.',
            'products' => [
                'data' => [],
                'meta' => [
                    'current_page' => 1,
                    'last_page' => 1,
                    'total' => 0,
                    'per_page' => $perPage,
                ],
            ],
        ], 200);
    }

    // 📊 Sắp xếp theo giá
    if ($sort_price === "asc") {
        $products->orderByRaw("COALESCE(discount_price, price) ASC");
    } elseif ($sort_price === "desc") {
        $products->orderByRaw("COALESCE(discount_price, price) DESC");
    }

    // ⭐ Sắp xếp theo đánh giá
    if ($sort_rating === "asc") {
        $products->orderBy('reviews_avg_rating', 'asc');
    } elseif ($sort_rating === "desc") {
        $products->orderBy('reviews_avg_rating', 'desc');
    }

    // 🕒 Sắp xếp theo thời gian tạo sản phẩm
    if ($sort_time === "asc") {
        $products->orderBy('created_at', 'asc');
    } elseif ($sort_time === "desc") {
        $products->orderBy('created_at', 'desc');
    }

    // ⏳ Phân trang
    $products = $products->paginate($perPage);

    return response()->json([
        'message' => 'Lấy danh sách sản phẩm thành công.',
        'products' => [
            'data' => ProductResource::collection($products->map(function ($product) use ($userId) {
                return new ProductResource($product, $userId);
            })),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'total' => $products->total(),
                'per_page' => $products->perPage(),
            ],
        ],
    ], 200);
}


}
