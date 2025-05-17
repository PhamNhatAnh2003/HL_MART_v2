<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;


class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */



 public function getReviews(Request $request)
    {
        $userId = $request->query('user_id') ?? null;
        $productId = $request->query('product_id') ?? null;
        $limit = $request->query('limit', 20); // Mặc định trả về 10 kết quả

        // Truy vấn bảng reviews với quan hệ tới user và restaurant
        $query = Review::with(['user', 'product']);

        if ($userId) {
            $query->where('user_id', $userId);
        }

        if ($productId) {
            $query->where('product_id', $productId);
        }

        $reviews = $query->orderBy('created_at', 'desc');
        $reviews = $reviews->limit($limit)->get();

        return response()->json([
            'message' => "Lay review thanh cong",
            'reviews' => $reviews
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
public function createReview(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'user_id' => 'required|integer|exists:users,id',
                'product_id' => 'required|integer|exists:products,id',
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string|max:1000',
                // 'image' => 'nullable',
            ]);

                    // Xử lý avatar (nếu có)
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = "hh";
                $image = $request->file('image');
                $imageName = time() . '_image_' . uniqid() . '.' . $image->extension();
                $image->storeAs('images', $imageName, 'public');
                $imagePath = "/storage/images/$imageName";
            }

            $review = Review::create([
                'user_id' => $validatedData['user_id'],
                'product_id' => $validatedData['product_id'],
                'rating' => $validatedData['rating'],
                'comment' => $validatedData['comment'] ?? null,
                'image' => $imagePath
            ]);

            $review->load(['user:id,name', 'product:id,name']);

            return response()->json([
                'success' => true,
                'message' => 'Đánh giá đã được tạo thành công.',
                'image' =>  $imagePath,
            'data' => [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'user' => [
                'id' => $review->user->id,
                'name' => $review->user->name
        ],
            'product' => [
                'id' => $review->product->id,
                'name' => $review->product->name
        ],
        '   created_at' => $review->created_at
     ]
        ], 201);
        } catch (\Exception $e) {
             return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi trong quá trình tạo đánh giá.',
                'error' => $e->getMessage()
        ], 400);
        }
    }

}
