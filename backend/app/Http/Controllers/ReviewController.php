<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Booking;
use App\Models\Package;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function packageReviews(Request $request, $id)
    {
        $package = Package::findOrFail($id);
        $query = $package->reviews()->with('user');
        
        if ($request->sort === 'helpful') {
            $query->orderBy('helpful_count', 'desc');
        } else {
            $query->latest();
        }

        return response()->json($query->paginate(5));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'package_id' => 'required|exists:packages,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string',
            'comment' => 'required|string|min:20',
            'images' => 'nullable|array'
        ]);

        if (Review::where('user_id', $request->user()->id)->where('package_id', $validated['package_id'])->exists()) {
            return response()->json(['message' => 'You have already reviewed this package.'], 400);
        }

        $booking = Booking::where('package_id', $validated['package_id'])
            ->where('user_id', $request->user()->id)
            ->whereIn('status', ['confirmed', 'completed'])
            ->first();

        if (!$booking) {
            return response()->json(['message' => 'You must have a completed booking to review this package.'], 403);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'package_id' => $validated['package_id'],
            'booking_id' => $booking->id,
            'rating' => $validated['rating'],
            'title' => $validated['title'],
            'comment' => $validated['comment'],
            'images' => $validated['images'] ?? null,
        ]);

        return response()->json($review, 201);
    }

    public function helpful($id)
    {
        $review = Review::findOrFail($id);
        $review->increment('helpful_count');
        return response()->json(['message' => 'Marked as helpful', 'helpful_count' => $review->helpful_count]);
    }
}
