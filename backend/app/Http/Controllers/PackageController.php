<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index(Request $request)
    {
        $query = Package::query()
            ->withCount('reviews')
            ->withAvg('reviews', 'rating');

        $query->search($request->search)
              ->byBudget($request->budget_min, $request->budget_max)
              ->byDestination($request->destination)
              ->byDuration($request->duration)
              ->byType($request->type);

        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price_asc':
                    $query->orderBy('budget', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('budget', 'desc');
                    break;
                case 'rating':
                    $query->orderBy('reviews_avg_rating', 'desc');
                    break;
                case 'popular':
                    $query->withCount('bookings')->orderBy('bookings_count', 'desc');
                    break;
                default:
                    $query->latest();
            }
        } else {
            $query->latest();
        }

        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'destination' => 'required|string',
            'duration' => 'required|integer',
            'budget' => 'required|numeric',
            'type' => 'required|string',
            'image' => 'nullable|string',
        ]);
        $package = Package::create($validated);
        return response()->json($package, 201);
    }

    public function show($id)
    {
        $package = Package::with(['hotel', 'reviews' => function($q) {
            $q->with('user')->latest()->take(5);
        }])
        ->withCount('reviews')
        ->withAvg('reviews', 'rating')
        ->findOrFail($id);

        return response()->json($package);
    }

    public function update(Request $request, $id)
    {
        $package = Package::findOrFail($id);
        $package->update($request->all());
        return response()->json($package);
    }

    public function destroy($id)
    {
        Package::destroy($id);
        return response()->json(null, 204);
    }
}
