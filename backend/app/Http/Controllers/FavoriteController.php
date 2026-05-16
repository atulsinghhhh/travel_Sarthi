<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Package;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        // Simplistic approach for getting favorites with basic relations
        $favorites = $request->user()->favorites()->withCount('reviews')->withAvg('reviews', 'rating')->get();
        // The favorites relation returns Package models
        return response()->json($favorites);
    }

    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'package_id' => 'required|exists:packages,id'
        ]);

        $user = $request->user();
        $isFavorited = $user->favorites()->where('package_id', $validated['package_id'])->exists();

        if ($isFavorited) {
            $user->favorites()->detach($validated['package_id']);
            return response()->json(['message' => 'Removed from favorites', 'is_favorited' => false]);
        }

        $user->favorites()->attach($validated['package_id']);
        return response()->json(['message' => 'Added to favorites', 'is_favorited' => true]);
    }
}
