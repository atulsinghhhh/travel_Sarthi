<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

    public function update(Request $request, Hotel $hotel)
    {
        $hotel->update($request->all());
        return response()->json($hotel);
    }

    public function destroy(Hotel $hotel)
    {
        $hotel->delete();
        return response()->json(null, 204);
    }
}
