<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Package;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AdminAnalyticsSeeder extends Seeder
{
    public function run()
    {
        // 1. Create Dummy Users over the last 6 months
        $users = [];
        $months = [5, 4, 3, 2, 1, 0];
        $names = ['Aarav Sharma', 'Vivaan Gupta', 'Diya Patel', 'Ananya Singh', 'Ishaan Verma', 'Riya Shah', 'Kabir Malhotra', 'Meera Rao', 'Advait Nair', 'Tara Joshi'];

        foreach ($names as $index => $name) {
            $monthOffset = $months[$index % count($months)];
            $createdAt = Carbon::now()->subMonths($monthOffset)->subDays(rand(1, 28));
            
            $users[] = User::firstOrCreate(
                ['email' => strtolower(str_replace(' ', '.', $name)) . '@example.com'],
                [
                    'name' => $name,
                    'password' => Hash::make('password'),
                    'role' => 'user',
                    'status' => 'active',
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt
                ]
            );
        }

        // 2. Create Dummy Packages
        $packagesData = [
            [
                'title' => 'Bali Tropical Paradise & Villa Stays',
                'description' => 'Experience the magic of Bali with private pool villas, sunrise volcano treks, and pristine beaches.',
                'destination' => 'Ubud & Seminyak, Bali',
                'duration' => 7,
                'budget' => 85000,
                'type' => 'Honeymoon',
                'image' => 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Maldives Overwater Sanctuary',
                'description' => 'Unrivaled luxury in the Indian Ocean. All-inclusive overwater bungalow experience with sunset dolphin cruises.',
                'destination' => 'North Male Atoll, Maldives',
                'duration' => 5,
                'budget' => 175000,
                'type' => 'Luxury',
                'image' => 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Tokyo & Mt. Fuji Express Tour',
                'description' => 'Immerse yourself in neon lights, bullet trains, historic shrines, and the breathtaking views of Mt. Fuji.',
                'destination' => 'Tokyo & Kyoto, Japan',
                'duration' => 8,
                'budget' => 140000,
                'type' => 'Cultural',
                'image' => 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Swiss Alps Ski & Train Adventure',
                'description' => 'Ride the Glacier Express across snow-capped peaks, stay in alpine chalets, and ski world-class slopes.',
                'destination' => 'Zermatt, Switzerland',
                'duration' => 6,
                'budget' => 210000,
                'type' => 'Adventure',
                'image' => 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Kerala Backwaters Luxury Cruise',
                'description' => 'Float down emerald canals in a traditional houseboat, surrounded by coconut palms and Ayurvedic spas.',
                'destination' => 'Alleppey, Kerala',
                'duration' => 4,
                'budget' => 45000,
                'type' => 'Nature',
                'image' => 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            ]
        ];

        $createdPackages = [];
        foreach ($packagesData as $pkg) {
            $createdPackages[] = Package::firstOrCreate(['title' => $pkg['title']], $pkg);
        }

        // 3. Create Dummy Bookings across the last 30 days
        $statuses = ['confirmed', 'confirmed', 'confirmed', 'confirmed', 'pending', 'cancelled'];
        
        $createdBookings = [];
        for ($i = 0; $i < 35; $i++) {
            $user = $users[array_rand($users)];
            $package = $createdPackages[array_rand($createdPackages)];
            $status = $statuses[array_rand($statuses)];
            $daysAgo = rand(0, 29);
            $bookingDate = Carbon::now()->subDays($daysAgo)->subHours(rand(1, 23));
            $startDate = Carbon::now()->addDays(rand(2, 60))->format('Y-m-d');
            $endDate = Carbon::parse($startDate)->addDays($package->duration)->format('Y-m-d');

            $createdBookings[] = Booking::create([
                'user_id' => $user->id,
                'package_id' => $package->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'total_amount' => $package->budget,
                'status' => $status,
                'created_at' => $bookingDate,
                'updated_at' => $bookingDate
            ]);
        }

        // 4. Create Dummy Reviews
        foreach ($createdBookings as $booking) {
            if ($booking->status === 'confirmed' && rand(1, 10) > 4) {
                Review::firstOrCreate([
                    'user_id' => $booking->user_id,
                    'package_id' => $booking->package_id,
                ], [
                    'booking_id' => $booking->id,
                    'rating' => rand(4, 5),
                    'title' => 'Unforgettable Trip!',
                    'comment' => 'Absolutely breathtaking experience! The accommodations were flawless and every detail was taken care of.',
                    'created_at' => Carbon::now()->subDays(rand(1, 20)),
                ]);
            }
        }

        // 5. Create Dummy Coupons
        $coupons = [
            ['code' => 'SUMMER25', 'discount_percent' => 25, 'expiry_date' => Carbon::now()->addMonths(2)],
            ['code' => 'WELCOME10', 'discount_percent' => 10, 'expiry_date' => Carbon::now()->addMonths(6)],
            ['code' => 'FESTIVE15', 'discount_percent' => 15, 'expiry_date' => Carbon::now()->addMonths(1)],
            ['code' => 'VIPLUXURY', 'discount_percent' => 20, 'expiry_date' => Carbon::now()->addMonths(3)],
        ];

        foreach ($coupons as $c) {
            \App\Models\Coupon::firstOrCreate(['code' => $c['code']], $c);
        }

        // 6. Create Dummy Notifications for Admin
        $admin = User::where('email', 'admin@travelsarthi.com')->first();
        if ($admin) {
            $notificationData = [
                ['message' => 'New booking #304 received for Bali Tropical Paradise', 'type' => 'booking_created', 'time' => '10m ago'],
                ['message' => 'User Aarav Sharma just left a 5-star review', 'type' => 'review_added', 'time' => '1h ago'],
                ['message' => 'High demand alert: Swiss Alps package is trending', 'type' => 'system_alert', 'time' => '3h ago'],
                ['message' => 'Payout #102 processed successfully (₹1,40,000)', 'type' => 'payout_processed', 'time' => '5h ago'],
            ];

            foreach ($notificationData as $nd) {
                \Illuminate\Support\Facades\DB::table('notifications')->insert([
                    'id' => (string) \Illuminate\Support\Str::uuid(),
                    'type' => 'App\Notifications\AdminAlertNotification',
                    'notifiable_type' => 'App\Models\User',
                    'notifiable_id' => $admin->id,
                    'data' => json_encode($nd),
                    'read_at' => null,
                    'created_at' => Carbon::now()->subHours(rand(1, 12)),
                    'updated_at' => Carbon::now()->subHours(rand(1, 12)),
                ]);
            }
        }
    }
}
