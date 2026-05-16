<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function index()
    {
        return response()->json(Coupon::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code',
            'discount_percent' => 'required|numeric|min:0|max:100',
            'expiry_date' => 'required|date|after:today',
        ]);

        $coupon = Coupon::create($validated);
        return response()->json($coupon, 201);
    }

    public function validateCoupon(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
        ]);

        $coupon = Coupon::where('code', $validated['code'])
            ->where('expiry_date', '>=', now())
            ->first();

        if (!$coupon) {
            return response()->json(['message' => 'Invalid or expired coupon'], 400);
        }

        return response()->json($coupon);
    }
}
