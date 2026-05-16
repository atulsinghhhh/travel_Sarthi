<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Package;
use App\Models\Coupon;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user() && $request->user()->is_admin) {
            return response()->json(Booking::with(['user', 'package'])->get());
        }
        return response()->json($request->user()->bookings()->with('package')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'package_id' => 'required|exists:packages,id',
            'coupon_code' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $package = Package::findOrFail($validated['package_id']);
        $totalAmount = $package->budget;
        $couponId = null;

        if (!empty($validated['coupon_code'])) {
            $coupon = Coupon::where('code', $validated['coupon_code'])
                ->where('expiry_date', '>=', now())
                ->first();
            if ($coupon) {
                $totalAmount -= ($totalAmount * ($coupon->discount_percent / 100));
                $couponId = $coupon->id;
            }
        }

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'package_id' => $package->id,
            'total_amount' => $totalAmount,
            'coupon_id' => $couponId,
            'status' => 'pending',
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
        ]);

        return response()->json($booking, 201);
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);

        $booking->update(['status' => $validated['status']]);

        return response()->json($booking);
    }
}
