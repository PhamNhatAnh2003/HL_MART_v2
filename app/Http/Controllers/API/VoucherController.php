<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VoucherController extends Controller
{
public function createVoucher(Request $request)
{
    $validator = Validator::make($request->all(), [
        'code' => 'required|unique:vouchers,code',
        'type' => 'required|in:percent,fixed',
        'value' => 'required|numeric|min:0',
        'min_order' => 'nullable|numeric|min:0',
        'max_usage' => 'nullable|integer|min:1',
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'starts_at' => 'nullable|date',
        'expires_at' => 'nullable|date|after_or_equal:starts_at',
        'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $voucher = Voucher::create([
        'code' => strtoupper($request->code),
        'type' => $request->type,
        'value' => $request->value,
        'min_order' => $request->min_order ?? 0,
        'max_usage' => $request->max_usage,
        'used' => 0,
        'title' => $request->title,
        'description' => $request->description,
        'brand' => $request->brand,
        'image' => $request->image,
        'starts_at' => $request->starts_at,
        'expires_at' => $request->expires_at,
        'is_active' => $request->is_active ?? true,
    ]);

    return response()->json([
        'message' => 'Voucher created successfully!',
        'voucher' => $voucher
    ], 201);
}

public function updateVoucher(Request $request, $id)
{
    $voucher = Voucher::find($id);

    if (!$voucher) {
        return response()->json(['message' => 'Voucher không tồn tại.'], 404);
    }

    $validator = Validator::make($request->all(), [
        'code' => 'unique:vouchers,code,' . $voucher->id,
        'type' => 'in:percent,fixed',
        'value' => 'numeric|min:0',
        'min_order' => 'nullable|numeric|min:0',
        'max_usage' => 'nullable|integer|min:1',
        'title' => 'string|max:255',
        'description' => 'nullable|string',
        'starts_at' => 'nullable|date',
        'expires_at' => 'nullable|date|after_or_equal:starts_at',
        'is_active' => 'boolean',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $voucher->update([
        'code' => strtoupper($request->code ?? $voucher->code),
        'type' => $request->type ?? $voucher->type,
        'value' => $request->value ?? $voucher->value,
        'min_order' => $request->min_order ?? $voucher->min_order,
        'max_usage' => $request->max_usage ?? $voucher->max_usage,
        'title' => $request->title ?? $voucher->title,
        'description' => $request->description ?? $voucher->description,
        'brand' => $request->brand ?? $voucher->brand,
        'image' => $request->image ?? $voucher->image,
        'starts_at' => $request->starts_at ?? $voucher->starts_at,
        'expires_at' => $request->expires_at ?? $voucher->expires_at,
        'is_active' => $request->is_active ?? $voucher->is_active,
    ]);

    return response()->json([
        'message' => 'Voucher cập nhật thành công!',
        'voucher' => $voucher
    ]);
}

public function deleteVoucher($id)
{
    $voucher = Voucher::find($id);

    if (!$voucher) {
        return response()->json(['message' => 'Voucher không tồn tại.'], 404);
    }

    $voucher->delete();

    return response()->json(['message' => 'Voucher đã được xóa thành công.'], 200);
}


public function getAvailableVouchers()
{
    $now = now();

    $vouchers = Voucher::where('is_active', true)
        ->where(function ($query) use ($now) {
            $query->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
        })
        ->where(function ($query) use ($now) {
            $query->whereNull('expires_at')->orWhere('expires_at', '>=', $now);
        })
        ->where(function ($query) {
            $query->whereNull('max_usage')->orWhereColumn('used', '<', 'max_usage');
        })
        ->orderBy('starts_at', 'desc')
        ->get();

    return response()->json([
        'message' => 'Danh sách voucher khả dụng.',
        'vouchers' => $vouchers
    ]);
}

public function getVouchers()
{
    $vouchers = Voucher::orderBy('created_at', 'desc')->get();

    return response()->json([
        'success' => true,
        'vouchers' => $vouchers,
    ]);
}

}