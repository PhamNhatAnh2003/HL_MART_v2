<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    //
    public function uploadImages(Request $request)
    {

        $imageNames = [];

        foreach($request->file('images') as $image) {
            $imageName = time() . '_' . uniqid() . '.' . $image->extension();
            $image->storeAs('images', $imageName, 'public');
            $imageNames[] = "/storage/images/$imageName";
        }

        return response()->json([
            'message' => 'Hình ảnh đã được tải lên thành công.',
            'images' => $imageNames,
            'image_paths' => json_encode($imageNames)
        ], 201);
    }

    public static function deleteImage(string $image)
    {
        $imageName = basename($image);
        Storage::delete("public/images/$imageName");
    }


    public function uploadImage(Request $request)
    {
        $image = $request->file('image');
        $imageName = time() . '_' . uniqid() . '.' . $image->extension();
        $image->storeAs('images', $imageName, 'public');
        $imageName = "/storage/images/$imageName";

        return response()->json([
            'message' => 'Hình ảnh đã được tải lên thành công.',
            'image' => $imageName
        ], 201);
    }
}
