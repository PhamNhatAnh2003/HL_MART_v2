<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\QueryException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
   
    public function register(Request $request)
    {
        $messageValidation = '';

        if (!$request->input('name')) {
            $messageValidation = 'Tên người dùng là bắt buộc';
        } else if (!$request->input('email')) {
            $messageValidation = 'Địa chỉ email là bắt buộc.';
        } else if (!$request->input('password')) {
            $messageValidation = 'Mật khẩu là bắt buộc.';
        } else {
            $user = User::where('email', $request->input('email'))->first();
            if ($user) {
                $messageValidation = 'Địa chỉ email này đã được sử dụng.';
            }
        }

        if ($messageValidation) {
            return response()->json([
                'message' => $messageValidation,
            ], 422);
        }

        try {
            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = bcrypt($request->password);
            $user->save();
        } catch (QueryException $e) {
            throw new \Exception('Lỗi tạo hồ sơ: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Tài khoản đã được tạo thành công.',
        ], 201);
    }

    public function login(Request $request)
    {
        $messageValidation = '';

        if (!$request->input('email')) {
            $messageValidation = 'Địa chỉ email là bắt buộc.';
        } else if (!$request->input('password')) {
            $messageValidation = 'Mật khẩu là bắt buộc.';
        }

        if ($messageValidation) {
            return response()->json([
                'message' => $messageValidation,
            ], 422);
        }

        $email = $request->input("email");
        $user = User::where('email', $email)->first();
        try {
            if (!Auth::attempt($request->only('email', 'password'))) {
                if (!$user) {
                    return response()->json([
                        'type' => 'email',
                        'message' => 'Địa chỉ email không chính xác!',
                    ], 422);
                } else {
                    return response()->json([
                        'type' => 'password',
                        'message' => 'Mật khẩu không chính xác!',
                    ], 422);
                }
            }

            $token = $user->createToken('token_name')->plainTextToken;

            return response()->json([
                'message' => 'Đăng nhập thành công.',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi đăng nhập: ' . $e->getMessage()
            ], 500);
        }
    }

public function getUser(Request $request)
{
    $id = $request->query('id');

    if (!$id) {
        return response()->json(['message' => 'Thiếu ID người dùng'], 400);
    }

    // Lấy user cùng địa chỉ mặc định
    $user = User::with(['addresses' => function ($query) {
        $query->where('is_default', true);
    }])->find($id);

    if (!$user) {
        return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
    }

    // Lấy địa chỉ mặc định nếu có
    $defaultAddress = $user->addresses->first();

    return response()->json([
        'message' => "Lấy thông tin người dùng thành công.",
        'user' => $user,
        'default_address' => $defaultAddress
    ], 200);
}



public function updateUser(Request $request, $id)
    {
        // Tìm người dùng theo ID
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Không tìm thấy người dùng!',
            ], 404);
        }

        // Kiểm tra dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'phone' => 'nullable|numeric|unique:users,phone,' . $id,
            'address' => 'nullable|string|max:255',
            // 'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'password' => 'nullable|string|min:8|confirmed', // Nếu có thay đổi mật khẩu
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Cập nhật thông tin người dùng
        if ($request->has('name')) {
            $user->name = $request->input('name');
        }

        if ($request->has('email')) {
            $user->email = $request->input('email');
        }

        if ($request->has('phone')) {
            $user->phone = $request->input('phone');
        }

        if ($request->has('address')) {
            $user->address = $request->input('address');
        }

        // Xử lý ảnh đại diện
       if ($request->hasFile('avatar')) {
            $image = $request->file('avatar');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('images', $imageName, 'public');
            $imagePath = "/storage/images/$imageName";

            // Xóa ảnh cũ nếu tồn tại
            if ($user->avatar) {
                $oldImageName = basename($user->avatar);
                Storage::delete("public/images/$oldImageName");
            }

            $user->avatar = $imagePath;
        }

        // Cập nhật mật khẩu nếu có
        if ($request->has('password')) {
            $user->password = Hash::make($request->input('password'));
        }

        // Lưu thông tin người dùng
        $user->save();

        return response()->json([
            'message' => 'Cập nhật thông tin người dùng thành công!',
            'user' => $user,
        ], 200);
    }

}
