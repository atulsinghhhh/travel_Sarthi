<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    public function index(Request $request)
    {
        $query = Hotel::query()->with('rooms');
        if ($request->has('available') && $request->available == 'true') {
            $query->whereHas('rooms', function ($q) {
                $q->where('availability', true);
            });
        }
        return response()->json($query->get());
    }

    public function show($id)
    {
        $hotel = Hotel::with(['rooms', 'reviews.user'])->findOrFail($id);
        
        $formattedReviews = $hotel->reviews->map(function ($r) {
            return [
                'id' => $r->id,
                'userName' => $r->user->name ?? 'Guest Traveler',
                'userImage' => $r->user->avatar ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
                'date' => $r->created_at ? $r->created_at->diffForHumans() : 'Recently',
                'rating' => $r->rating,
                'text' => $r->comment ?? 'Wonderful experience and stay.',
                'title' => $r->title ?? 'Great Stay!'
            ];
        });

        $hotelData = $hotel->toArray();
        $hotelData['reviews'] = $formattedReviews;
        
        return response()->json($hotelData);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'location' => 'required|string',
            'rating' => 'numeric|min:0|max:5',
            'image' => 'nullable|string',
        ]);
        $hotel = Hotel::create($validated);
        return response()->json($hotel, 201);
    }

    public function update(Request $request, $id)
    {
        $hotel = Hotel::findOrFail($id);
        $hotel->update($request->all());
        return response()->json($hotel);
    }

    public function destroy($id)
    {
        $hotel = Hotel::findOrFail($id);
        $hotel->delete();

        return response()->json(null, 204);
    }

    public function uploadImages(Request $request, $id)
    {
        $request->validate([
            'images' => 'required|array|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        $hotel = Hotel::findOrFail($id);
        $uploadedUrls = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('hotels', 'public');
                $uploadedUrls[] = asset('storage/' . $path);
            }
        }

        $existingImages = $hotel->images ? json_decode($hotel->images, true) : [];
        $mergedImages = array_merge($existingImages, $uploadedUrls);
        
        $hotel->update(['images' => json_encode($mergedImages)]);

        return response()->json(['urls' => $uploadedUrls, 'all_images' => $mergedImages]);
    }
}
