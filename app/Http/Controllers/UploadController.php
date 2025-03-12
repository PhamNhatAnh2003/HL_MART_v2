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
        // $request->validate([
        //     'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        // ]);

        $imageNames = [];

        foreach($request->file('images') as $image) {
            $imageName = time() . '_' . uniqid() . '.' . $image->extension();
            $image->storeAs('images', $imageName, 'public');
            $imageNames[] = "/storage/images/$imageName";
        }

        return response()->json([
            'message' => '画像が正常に追加されました。',
            'images' => $imageNames,
            'image_paths' => json_encode($imageNames)
        ], 201);
    }

    public function uploadImage(Request $request)
    {
        $image = $request->file('image');
        $imageName = time() . '_' . uniqid() . '.' . $image->extension();
        $image->storeAs('images', $imageName, 'public');
        $imageName = "/storage/images/$imageName";

        return response()->json([
            'message' => '画像が正常に追加されました。',
            'image' => $imageName
        ], 201);
    }

    public static function deleteImage(string $image)
    {
        $imageName = basename($image);
        Storage::delete("public/images/$imageName");
    }
}