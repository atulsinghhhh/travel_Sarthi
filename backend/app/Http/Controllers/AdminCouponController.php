<?php
namespace App\Http\Controllers;
use App\Models\Coupon;
use Illuminate\Http\Request;

class AdminCouponController extends Controller
{
    public function index() { return response()->json(Coupon::latest()->get()); }
    public function store(Request $request) {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons',
            'type' => 'required|in:fixed,percentage',
            'value' => 'required|numeric',
            'usage_limit' => 'required|integer',
            'valid_until' => 'required|date',
            'is_active' => 'boolean'
        ]);
        return response()->json(Coupon::create($validated), 201);
    }
    public function update(Request $request, $id) {
        $coupon = Coupon::findOrFail($id);
        $coupon->update($request->all());
        return response()->json($coupon);
    }
    public function destroy($id) {
        Coupon::destroy($id);
        return response()->json(null, 204);
    }
}
