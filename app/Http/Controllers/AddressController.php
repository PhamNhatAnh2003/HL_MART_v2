<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Models\CartItem;
use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class AddressController extends Controller
{
    public function getAddresses(Request $request)
{
    $userId = $request->query('user_id');

    $addresses = Address::where('user_id', $userId)->get();

    if ($addresses->isEmpty()) {
        return response()->json([
            'status' => false,
            'message' => 'No addresses found.'
        ]);
    }

    return response()->json([
        'status' => true,
        'data' => $addresses
    ]);
}

public function addAddress(Request $request)
{
    $userId = $request->input('user_id'); // Lấy user_id từ body

    if (!$userId) {
        return response()->json([
            'status' => false,
            'message' => 'User ID is required.'
        ], 400);
    }

    // Validate input
    $validated = $request->validate([
        'receiver_name' => 'required|string',
        'phone' => 'required|string',
        'province' => 'required|string',
        'district' => 'required|string',
        'ward' => 'required|string',
        'street_address' => 'required|string',
        'is_default' => 'nullable|boolean' // Có thể null, nếu có thì phải là boolean
    ]);

    // Nếu là địa chỉ mặc định → Reset các địa chỉ cũ
    if (!empty($validated['is_default']) && $validated['is_default']) {
        Address::where('user_id', $userId)->update(['is_default' => false]);
    }

    // Thêm địa chỉ
    $address = Address::create([
        'user_id' => $userId,
        'receiver_name' => $validated['receiver_name'],
        'phone' => $validated['phone'],
        'province' => $validated['province'],
        'district' => $validated['district'],
        'ward' => $validated['ward'],
        'street_address' => $validated['street_address'],
        'is_default' => $validated['is_default'] ?? false
    ]);

    return response()->json([
        'status' => true,
        'message' => 'Đã thêm địa chỉ mới',
        'data' => $address
    ]);
}


public function updateAddress(Request $request, $id)
{
    // Lấy user_id từ body request (form data hoặc JSON)
    $userId = $request->input('user_id');

    // Kiểm tra nếu thiếu user_id hoặc address_id ($id)
    if (!$userId || !$id) {
        return response()->json([
            'status' => false,
            'message' => 'User ID và Address ID là bắt buộc.'
        ], 400);
    }

    // Tìm địa chỉ phù hợp với user_id và address_id
    $address = Address::where('address_id', $id)
        ->where('user_id', $userId)
        ->first();

    // Nếu không tìm thấy địa chỉ
    if (!$address) {
        return response()->json([
            'status' => false,
            'message' => 'Không tìm thấy địa chỉ.'
        ], 404);
    }

    // Xác thực dữ liệu đầu vào
    $validated = $request->validate([
        'receiver_name' => 'required|string|max:255',
        'phone' => 'required|string|max:20',
        'province' => 'required|string|max:255',
        'district' => 'required|string|max:255',
        'ward' => 'required|string|max:255',
        'street_address' => 'required|string|max:255',
        'is_default' => 'boolean'
    ]);

    // Nếu địa chỉ mới được đánh dấu là mặc định, reset địa chỉ cũ
    if (isset($validated['is_default']) && $validated['is_default']) {
        Address::where('user_id', $userId)
            ->update(['is_default' => false]);
    }

    // Cập nhật địa chỉ
    $address->update($validated);

    // Trả về kết quả
    return response()->json([
        'status' => true,
        'message' => 'Địa chỉ đã được cập nhật thành công.',
        'data' => $address
    ]);
}


public function deleteAddress(Request $request, $id)
{
    // Lấy user_id từ query string
    $userId = $request->query('user_id');

    // Kiểm tra xem user_id có hợp lệ không
    if (!$userId) {
        return response()->json([
            'status' => false,
            'message' => 'User ID is required.'
        ], 400); // Trả về lỗi nếu không có user_id
    }

    // Tìm địa chỉ theo id và user_id
    $address = Address::where('address_id', $id)->where('user_id', $userId)->first();

    if (!$address) {
        return response()->json([
            'status' => false,
            'message' => 'Address not found.'
        ], 404); // Trả về lỗi nếu không tìm thấy địa chỉ
    }

    // Nếu địa chỉ xóa là địa chỉ mặc định, cần phải gán một địa chỉ khác làm mặc định
    if ($address->is_default == 1) {
        // Tìm một địa chỉ khác để gán làm mặc định
        $newDefaultAddress = Address::where('user_id', $userId)
            ->where('address_id', '!=', $id) // Loại trừ địa chỉ sẽ xóa
            ->first();

        if ($newDefaultAddress) {
            // Gán địa chỉ mới là mặc định
            $newDefaultAddress->is_default = 1;
            $newDefaultAddress->save();
        } else {
            // Nếu không có địa chỉ khác, bạn có thể chọn giữ trạng thái mặc định như hiện tại hoặc trả về lỗi
            return response()->json([
                'status' => false,
                'message' => 'Không có địa chỉ nào khác để gán làm mặc định.'
            ], 400);
        }
    }

    // Xóa địa chỉ
    $address->delete();

    // Trả về phản hồi thành công
    return response()->json([
        'status' => true,
        'message' => 'Địa chỉ đã được xóa'
    ]);
}

public function setDefault(Request $request)
{
     $userId = $request->input('user_id'); // Lấy user_id từ body
    $addressId = $request->input('address_id'); // Lấy address_id từ body

    // Kiểm tra nếu user_id hoặc address_id không có trong request
    if (!$userId || !$addressId) {
        return response()->json(['message' => 'Thiếu thông tin user_id hoặc address_id'], 400);
    }

    // Lấy user từ database
    $user = User::find($userId);

    if (!$user) {
        return response()->json(['message' => 'User không tồn tại'], 404);
    }

    // Kiểm tra xem địa chỉ có thuộc về user hay không
    $address = $user->addresses()->where('address_id', $addressId)->first();

    if (!$address) {
        return response()->json(['message' => 'Địa chỉ không hợp lệ hoặc không thuộc user'], 404);
    }

    // Đặt tất cả các địa chỉ của user thành không phải mặc định
    $user->addresses()->update(['is_default' => false]);

    // Cập nhật địa chỉ này thành mặc định
    $address->is_default = true;
    $address->save();

    return response()->json(['message' => 'Cập nhật địa chỉ mặc định thành công']);
}

}

