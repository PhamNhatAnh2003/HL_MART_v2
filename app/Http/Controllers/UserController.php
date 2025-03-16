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
        $id = $request->query('id'); // Lấy ID từ query parameter

        if (!$id) {
            return response()->json(['message' => 'Thiếu ID người dùng'], 400);
        }

        $user = User::find($id); // Hoặc dùng with() nếu có liên kết khác

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        return response()->json([
            'message' => "Lấy thông tin người dùng thành công.",
            'user' => $user
        ], 200);
    }

}
