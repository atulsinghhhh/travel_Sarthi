<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Hotel;
use App\Models\Package;
use App\Models\Coupon;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Create a Razorpay order (dummy mode — returns order details for frontend)
     */
    public function createOrder(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'booking_type' => 'required|in:package,hotel,transport',
            'package_id' => 'nullable|exists:packages,id',
            'destination_id' => 'nullable|exists:destinations,id',
        ]);

        $razorpayId = config('services.razorpay.key');
        $razorpaySecret = config('services.razorpay.secret');

        // Generate a dummy order ID (in production, you'd call Razorpay API)
        $orderId = 'order_' . strtoupper(substr(md5(uniqid()), 0, 14));

        return response()->json([
            'order_id' => $orderId,
            'razorpay_key' => $razorpayId,
            'amount' => $validated['amount'] * 100, // Razorpay uses paisa
            'currency' => 'INR',
            'name' => 'TravelSaarthi',
            'description' => ucfirst($validated['booking_type']) . ' Booking Payment',
        ]);
    }

    /**
     * Verify payment and create booking
     */
    public function verifyPayment(Request $request)
    {
        $validated = $request->validate([
            'payment_id' => 'required|string',
            'order_id' => 'required|string',
            'signature' => 'nullable|string',
            'booking_type' => 'required|in:package,hotel,transport',
            'package_id' => 'nullable|exists:packages,id',
            'hotel_id' => 'nullable|exists:hotels,id',
            'destination_id' => 'nullable|exists:destinations,id',
            'coupon_code' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'total_amount' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string',
            'transport_type' => 'nullable|in:flight,bus,taxi',
            'transport_details' => 'nullable|string',
        ]);

        // In demo mode, we accept all payments as successful
        // In production, verify with Razorpay API:
        // $generated = hash_hmac('sha256', $validated['order_id'] . '|' . $validated['payment_id'], $razorpaySecret);
        // if ($generated !== $validated['signature']) { return error; }

        $couponId = null;
        if (!empty($validated['coupon_code'])) {
            $coupon = Coupon::where('code', $validated['coupon_code'])
                ->where('expiry_date', '>=', now())
                ->first();
            if ($coupon) {
                $couponId = $coupon->id;
            }
        }

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'package_id' => $validated['package_id'] ?? null,
            'hotel_id' => $validated['hotel_id'] ?? null,
            'destination_id' => $validated['destination_id'] ?? null,
            'total_amount' => $validated['total_amount'],
            'coupon_id' => $couponId,
            'status' => 'confirmed',
            'payment_id' => $validated['payment_id'],
            'payment_method' => $validated['payment_method'] ?? 'razorpay',
            'razorpay_order_id' => $validated['order_id'],
            'razorpay_signature' => $validated['signature'] ?? null,
            'booking_type' => $validated['booking_type'],
            'transport_type' => $validated['transport_type'] ?? null,
            'transport_details' => $validated['transport_details'] ?? null,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment verified and booking confirmed!',
            'booking' => $booking->load(['package', 'user']),
        ], 201);
    }

    /**
     * Get Razorpay config for frontend
     */
    public function config()
    {
        return response()->json([
            'key' => config('services.razorpay.key'),
            'currency' => 'INR',
            'name' => 'TravelSaarthi',
        ]);
    }
}
