<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Booking;
use App\Models\Package;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    public function stats()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth()->toDateString();

        return response()->json([
            'total_users' => User::count(),
            'new_users_this_month' => User::where('created_at', '>=', $startOfMonth)->count(),
            'total_bookings' => Booking::count(),
            'bookings_this_month' => Booking::where('created_at', '>=', $startOfMonth)->count(),
            'total_revenue' => Booking::where('status', '!=', 'cancelled')->sum('total_amount'),
            'revenue_this_month' => Booking::where('status', '!=', 'cancelled')
                                            ->where('created_at', '>=', $startOfMonth)
                                            ->sum('total_amount'),
            'total_packages' => Package::count(),
            'pending_bookings' => Booking::where('status', 'pending')->count()
        ]);
    }

    public function bookingsTrend(Request $request)
    {
        $days = $request->query('days', 30);
        $startDate = Carbon::now()->subDays($days)->toDateString();

        $trend = Booking::selectRaw('DATE(created_at) as date, count(id) as bookings, sum(total_amount) as revenue')
            ->where('created_at', '>=', $startDate)
            ->where('status', '!=', 'cancelled')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($trend);
    }

    public function popularPackages(Request $request)
    {
        $limit = $request->query('limit', 5);
        $packages = Package::withCount('bookings')
            ->withSum(['bookings' => function($q) { $q->where('status', '!=', 'cancelled'); }], 'total_amount')
            ->withAvg('reviews', 'rating')
            ->orderByDesc('bookings_count')
            ->limit($limit)
            ->get()
            ->map(function ($pkg) {
                return [
                    'id' => $pkg->id,
                    'name' => $pkg->title,
                    'image' => $pkg->image ?: ($pkg->images ? json_decode($pkg->images)[0] ?? null : null),
                    'bookings_count' => $pkg->bookings_count,
                    'revenue' => $pkg->bookings_sum_total_amount ?? 0,
                    'avg_rating' => $pkg->reviews_avg_rating ?? 0,
                ];
            });
        return response()->json($packages);
    }

    public function userGrowth(Request $request)
    {
        $months = $request->query('months', 6);
        $startDate = Carbon::now()->subMonths($months)->startOfMonth();

        // Database agnostic fallback if MySQL DATE_FORMAT is an issue (e.g., using sqlite for testing)
        // using laravel collection mapping for months.
        $users = User::where('created_at', '>=', $startDate)->get();
        
        $growth = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthKey = $date->format('M Y');
            $growth[] = [
                'month' => $monthKey,
                'new_users' => $users->filter(function ($u) use ($date) {
                    return $u->created_at->format('M Y') === $date->format('M Y');
                })->count()
            ];
        }

        return response()->json($growth);
    }

    public function bookingsByType()
    {
        $types = Booking::join('packages', 'bookings.package_id', '=', 'packages.id')
            ->where('bookings.status', '!=', 'cancelled')
            ->selectRaw('packages.type, count(bookings.id) as count')
            ->groupBy('packages.type')
            ->get();

        $total = $types->sum('count');
        $types->transform(function ($item) use ($total) {
            $item->percentage = $total > 0 ? round(($item->count / $total) * 100) : 0;
            return $item;
        });

        return response()->json($types);
    }
}
