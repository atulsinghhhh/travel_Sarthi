<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    public function stats()
    {
        $now = now();
        $startOfMonth = now()->startOfMonth();

        $totalUsers = User::count();
        $newUsersThisMonth = User::where('created_at', '>=', $startOfMonth)->count();

        $totalBookings = Booking::count();
        $bookingsThisMonth = Booking::where('created_at', '>=', $startOfMonth)->count();

        $totalRevenue = Booking::whereIn('status', ['confirmed', 'completed'])->sum('total_amount');
        $revenueThisMonth = Booking::whereIn('status', ['confirmed', 'completed'])
            ->where('created_at', '>=', $startOfMonth)
            ->sum('total_amount');

        $pendingBookings = Booking::where('status', 'pending')->count();
        $totalPackages = Package::count();

        return response()->json([
            'total_users' => $totalUsers,
            'new_users_this_month' => $newUsersThisMonth,
            'total_bookings' => $totalBookings,
            'bookings_this_month' => $bookingsThisMonth,
            'total_revenue' => (float)$totalRevenue,
            'revenue_this_month' => (float)$revenueThisMonth,
            'pending_bookings' => $pendingBookings,
            'total_packages' => $totalPackages,
        ]);
    }

    public function bookingsTrend(Request $request)
    {
        $days = (int) $request->query('days', 30);
        $startDate = now()->subDays($days);

        $trend = Booking::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as bookings'),
            DB::raw('SUM(total_amount) as revenue')
        )
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($trend);
    }

    public function popularPackages()
    {
        $packages = Package::withCount('bookings')
            ->withAvg('reviews', 'rating')
            ->orderBy('bookings_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($package) {
                return [
                    'id' => $package->id,
                    'name' => $package->title,
                    'image' => $package->image,
                    'bookings_count' => $package->bookings_count,
                    'revenue' => (float) ($package->budget * $package->bookings_count),
                    'avg_rating' => $package->reviews_avg_rating ? (float) $package->reviews_avg_rating : 4.5,
                ];
            });

        return response()->json($packages);
    }

    public function userGrowth()
    {
        $growth = User::select(
            DB::raw('DATE_FORMAT(created_at, "%b %Y") as month'),
            DB::raw('COUNT(*) as new_users'),
            DB::raw('MIN(created_at) as sort_date')
        )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('sort_date')
            ->get();

        return response()->json($growth);
    }

    public function bookingsByType()
    {
        $types = Package::select('type', DB::raw('COUNT(*) as count'))
            ->groupBy('type')
            ->get();

        return response()->json($types);
    }
}
