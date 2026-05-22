<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Hotel;
use App\Models\Package;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingConfirmed;
use App\Mail\BookingCancelled;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        // For simplicity, checking if is_admin property exists
        if ($request->user() && $request->user()->is_admin) {
            return response()->json(Booking::with(['user', 'package', 'hotel'])->get());
        }
        return response()->json($request->user()->bookings()->with(['package', 'hotel'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'package_id' => 'nullable|exists:packages,id',
            'hotel_id' => 'nullable|exists:hotels,id',
            'coupon_code' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        if (empty($validated['package_id']) && empty($validated['hotel_id'])) {
            return response()->json(['message' => 'A hotel or package must be selected.'], 422);
        }

        $package = !empty($validated['package_id']) ? Package::findOrFail($validated['package_id']) : null;
        $hotel = !empty($validated['hotel_id']) ? Hotel::findOrFail($validated['hotel_id']) : null;
        $totalAmount = $package?->budget ?? ($hotel?->price_per_night ?? $hotel?->price ?? 0);
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
            'package_id' => $package?->id,
            'hotel_id' => $hotel?->id,
            'total_amount' => $totalAmount,
            'coupon_id' => $couponId,
            'status' => 'pending',
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
        ]);

        return response()->json($booking, 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);
        $booking = Booking::findOrFail($id);
        $booking->update(['status' => $validated['status']]);

        if ($validated['status'] === 'confirmed') {
            // Mail::to($booking->user->email)->queue(new BookingConfirmed($booking));
        } elseif ($validated['status'] === 'cancelled') {
            // Mail::to($booking->user->email)->queue(new BookingCancelled($booking));
        }

        return response()->json($booking);
    }
}
