<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index(Request $request)
    {
        $query = Package::query();

        if ($request->has('budget_min')) {
            $query->where('budget', '>=', $request->budget_min);
        }
        if ($request->has('budget_max')) {
            $query->where('budget', '<=', $request->budget_max);
        }
        if ($request->has('destination')) {
            $query->where('destination', 'like', '%' . $request->destination . '%');
        }
        if ($request->has('duration')) {
            $query->where('duration', $request->duration);
        }
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        return response()->json($query->get());
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

    public function show(Package $package)
    {
        return response()->json($package->load('reviews.user'));
    }

    public function update(Request $request, Package $package)
    {
        $package->update($request->all());
        return response()->json($package);
    }

    public function destroy(Package $package)
    {
        $package->delete();
        return response()->json(null, 204);
    }
}
