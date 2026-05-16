<?php

namespace App\Http\Controllers;

use App\Models\Traveller;
use Illuminate\Http\Request;

class TravellerController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->travellers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string',
            'dob' => 'required|date|before:today',
            'gender' => 'required|string',
            'passport_number' => 'required|string',
            'passport_expiry' => 'required|date|after:today',
            'nationality' => 'required|string',
            'phone' => 'required|string',
        ]);

        $traveller = $request->user()->travellers()->create($validated);
        return response()->json($traveller, 201);
    }

    public function update(Request $request, $id)
    {
        $traveller = $request->user()->travellers()->findOrFail($id);
        
        $validated = $request->validate([
            'full_name' => 'sometimes|required|string',
            'dob' => 'sometimes|required|date|before:today',
            'gender' => 'sometimes|required|string',
            'passport_number' => 'sometimes|required|string',
            'passport_expiry' => 'sometimes|required|date|after:today',
            'nationality' => 'sometimes|required|string',
            'phone' => 'sometimes|required|string',
        ]);

        $traveller->update($validated);
        return response()->json($traveller);
    }

    public function destroy(Request $request, $id)
    {
        $traveller = $request->user()->travellers()->findOrFail($id);
        $traveller->delete();
        return response()->json(null, 204);
    }
}
