<?php

namespace App\Services;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order;
use App\Repositories\ProductRepositoryInterface;
use App\Repositories\ProductRepository;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ProductService
{
    protected $productRepo;

    public function __construct(ProductRepositoryInterface $productRepo)
    {
        $this->productRepo = $productRepo;
    }

    public function getLatestProducts($limit = 4)
    {
        return $this->productRepo->getLatest($limit);
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
            'unit' => 'required|string|max:50',
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

        // Xử lý avatar
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $avatarName = time() . '_avatar_' . uniqid() . '.' . $avatar->extension();
            $avatar->storeAs('images', $avatarName, 'public');
            $avatarPath = "/storage/images/$avatarName";
        }

        // Xử lý media
        $mediaPaths = [];
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $mediaFile) {
                $mediaName = time() . '_media_' . uniqid() . '.' . $mediaFile->extension();
                $mediaFile->storeAs('images', $mediaName, 'public');
                $mediaPaths[] = "/storage/images/$mediaName";
            }
        }

        $productData = [
            'name' => $request->input('name'),
            'avatar' => $avatarPath,
            'media' => json_encode($mediaPaths),
            'description' => $request->input('description'),
            'price' => $request->input('price'),
            'discount_price' => $request->input('discount_price'),
            'unit' => $request->input('unit'),
            'stock' => $request->input('stock'),
            'sold' => $request->input('sold'),
        ];

        $product = $this->productRepo->create($productData); // ✅ Đúng với constructor


        return response()->json([
            'message' => 'Tạo sản phẩm thành công',
            'product' => $product,
        ], 200);
    }

    public function updateProduct(Request $request, $id)
    {
     try {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Không tìm thấy sản phẩm.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'sold' => 'nullable|integer|min:0',
            'unit' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validatedData = $validator->validated();

        // Avatar
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $avatarName = time() . '_avatar_' . uniqid() . '.' . $avatar->extension();
            $avatar->storeAs('images', $avatarName, 'public');
            $validatedData['avatar'] = "/storage/images/$avatarName";
        }

        // Media
        $oldMedia = $product->media ? json_decode($product->media, true) : [];

        if ($request->input('media') === null) {
            // clear toàn bộ media
            foreach ($oldMedia as $mediaPath) {
                $filePath = public_path($mediaPath);
                if (file_exists($filePath) && is_file($filePath)) {
                    unlink($filePath);
                }
            }
            $validatedData['media'] = null;
        }

        if ($request->hasFile('media')) {
            $newMedia = [];
            foreach ($request->file('media') as $media) {
                $mediaName = time() . '_media_' . uniqid() . '.' . $media->extension();
                $media->storeAs('images', $mediaName, 'public');
                $newMedia[] = "/storage/images/$mediaName";
            }

            $mediaStrings = $request->input('media', []);
            if (!is_array($mediaStrings)) {
                $mediaStrings = [$mediaStrings];
            }

            foreach ($oldMedia as $mediaPath) {
                if (!in_array($mediaPath, $mediaStrings)) {
                    $filePath = public_path($mediaPath);
                    if (file_exists($filePath) && is_file($filePath)) {
                        unlink($filePath);
                    }
                }
            }

            $validatedData['media'] = json_encode(array_merge($newMedia, $mediaStrings));
        } elseif ($request->has('media')) {
            $mediaStrings = $request->input('media');
            if (!is_array($mediaStrings)) {
                $mediaStrings = [$mediaStrings];
            }

            foreach ($oldMedia as $mediaPath) {
                if (!in_array($mediaPath, $mediaStrings)) {
                    $filePath = public_path($mediaPath);
                    if (file_exists($filePath) && is_file($filePath)) {
                        unlink($filePath);
                    }
                }
            }

            $validatedData['media'] = json_encode($mediaStrings);
        }

        // Gọi repo để update
        $updatedProduct = $this->productRepo->update($id, $validatedData);

        return response()->json([
            'message' => 'Cập nhật sản phẩm thành công.',
            'data' => new ProductResource($updatedProduct),
        ], 200);

        } catch (\Exception $e) {
         return response()->json([
            'message' => 'Đã xảy ra lỗi khi cập nhật sản phẩm.',
            'error' => $e->getMessage(),
        ], 500);
        }  
    }


    // Phương thức cho endpoint /api/products/{productId}/recommendations
    public function getRecommendationsByProduct($productId, $limit = 4)
    {
        Log::info("Starting product recommendations for product: {$productId}");
        $product = Product::find($productId);
        if (!$product) {
            Log::warning("Product not found: {$productId}");
            return collect([]);
        }

        $totalProducts = Product::count();
        Log::info("Total products in database: {$totalProducts}");
        if ($totalProducts < $limit) {
            return Product::inRandomOrder()->take($totalProducts)->get();
        }

        $recommendations = Product::where('id', '!=', $productId)
            ->where('category', $product->category)
            ->inRandomOrder()
            ->take($limit)
            ->get();
        Log::info("Category-based recommendations count: {$recommendations->count()}");

        if ($recommendations->count() < $limit) {
            $excludeIds = [$productId, ...$recommendations->pluck('id')->toArray()];
            $additional = Product::whereNotIn('id', $excludeIds)
                ->inRandomOrder()
                ->take($limit - $recommendations->count())
                ->get();
            Log::info("Additional random products count: {$additional->count()}");
            $recommendations = $recommendations->merge($additional);
        }

        Log::info("Final product recommendations count: {$recommendations->count()}");
        return $recommendations->take($limit);
    }
    
    public function getRecommendations($productId, $limit = 4)
    {
        $currentProduct = Product::find($productId);
        if (!$currentProduct) {
            return collect([]);
        }

        $products = Product::where('id', '!=', $productId)->get();

        $recommendations = $products->map(function ($product) use ($currentProduct) {
            $similarity = $this->calculateSimilarity($currentProduct, $product);
            return ['product' => $product, 'similarity' => $similarity];
        })->sortByDesc('similarity')->take($limit);

        return $recommendations->pluck('product');
    }

    private function calculateSimilarity($product1, $product2)
    {
        $text1 = strtolower($product1->name . ' ' . $product1->category . ' ' . $product1->description . ' ' . $product1->tags);
        $text2 = strtolower($product2->name . ' ' . $product2->category . ' ' . $product2->description . ' ' . $product2->tags);

        $words1 = array_filter(explode(' ', \Illuminate\Support\Str::slug($text1, ' ')));
        $words2 = array_filter(explode(' ', \Illuminate\Support\Str::slug($text2, ' ')));

        $commonWords = array_intersect($words1, $words2);
        $totalWords = array_unique(array_merge($words1, $words2));

        return count($totalWords) > 0 ? count($commonWords) / count($totalWords) : 0;
    }


    public function recommendForUser($userId, $limit = 8)
    {
        // 1. Lấy ID sản phẩm đã mua
        $purchasedProductIds = Order::where('user_id', $userId)
            ->with('items.product')
            ->get()
            ->flatMap(function ($order) {
                return $order->items->pluck('product_id');
            })
            ->unique()
            ->toArray();
    
        // 2. Lấy danh mục đã mua
        $categoryIds = Product::whereIn('id', $purchasedProductIds)
            ->pluck('category_id')
            ->unique();
    
        // 3. Gợi ý sản phẩm cùng danh mục, chưa mua
        $recommendations = Product::whereIn('category_id', $categoryIds)
            ->whereNotIn('id', $purchasedProductIds)
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    
        $remaining = $limit - $recommendations->count();
    
        // 4. Nếu chưa đủ, thêm sản phẩm bất kỳ chưa mua
        if ($remaining > 0) {
            $fallbackProducts = Product::whereNotIn('id', $purchasedProductIds)
                ->whereNotIn('id', $recommendations->pluck('id')) // tránh trùng
                ->inRandomOrder()
                ->limit($remaining)
                ->get();
    
            $recommendations = $recommendations->concat($fallbackProducts);
        }
    
        return $recommendations->values(); // đảm bảo là collection tuần tự
    }
}



