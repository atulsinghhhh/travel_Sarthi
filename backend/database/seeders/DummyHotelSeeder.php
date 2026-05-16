<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Hotel;
use App\Models\User;
use App\Models\Review;
use Carbon\Carbon;

class DummyHotelSeeder extends Seeder
{
    public function run()
    {
        $hotelsData = [
            [
                'name' => 'The St. Regis Bali Resort',
                'location' => 'Bali, Indonesia',
                'rating' => 4.9,
                'image' => "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                'description' => 'Overlooking a pristine beach, this luxury resort features expansive suites and private villas with round-the-clock butler service and world-class dining.',
                'city' => 'Nusa Dua',
                'type' => 'Resort',
                'price_per_night' => 550,
            ],
            [
                'name' => 'Waldorf Astoria Maldives',
                'location' => 'Male, Maldives',
                'rating' => 5.0,
                'image' => "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                'description' => 'Spanning across three private islands, Waldorf Astoria Maldives offers overwater reef villas, 11 exceptional dining venues, and an immaculate private lagoon.',
                'city' => 'South Male Atoll',
                'type' => 'Luxury',
                'price_per_night' => 1200,
            ],
            [
                'name' => 'Aman Tokyo',
                'location' => 'Tokyo, Japan',
                'rating' => 4.8,
                'image' => "https://images.unsplash.com/photo-1542314831-c6a4d14d8373?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                'description' => 'Perched high above the Japanese capital, Aman Tokyo is a serene sanctuary blending traditional ryokan materials with modern architectural mastery.',
                'city' => 'Chiyoda',
                'type' => 'Boutique',
                'price_per_night' => 850,
            ],
            [
                'name' => 'Bora Bora Pearl Beach',
                'location' => 'Bora Bora, French Polynesia',
                'rating' => 4.7,
                'image' => "https://images.unsplash.com/photo-1582610116397-edb318620f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                'description' => 'Unwind in idyllic overwater bungalows boasting direct access to turquoise lagoons, vibrant coral nurseries, and majestic views of Mount Otemanu.',
                'city' => 'Vaitape',
                'type' => 'Beachfront',
                'price_per_night' => 650,
            ]
        ];

        $users = User::where('role', 'user')->get();
        if ($users->isEmpty()) {
            $users = collect([User::first()]);
        }

        $comments = [
            'Absolutely incredible stay! The hospitality was flawless and the views were even better than the pictures.',
            'Five stars across the board. The room was immaculate, the bed was heavenly, and the amenities were top-tier.',
            'A spectacular experience from check-in to check-out. Will definitely be returning next summer!',
            'The staff went above and beyond to make our anniversary unforgettable. Perfect location and exquisite food.'
        ];

        foreach ($hotelsData as $hData) {
            $hotel = Hotel::firstOrCreate(['name' => $hData['name']], $hData);

            // Seed 2-3 reviews per hotel
            $numReviews = rand(2, 3);
            for ($i = 0; $i < $numReviews; $i++) {
                $user = $users->random();
                Review::firstOrCreate([
                    'user_id' => $user->id,
                    'hotel_id' => $hotel->id,
                ], [
                    'rating' => rand(4, 5),
                    'title' => 'Fantastic Stay!',
                    'comment' => $comments[array_rand($comments)],
                    'created_at' => Carbon::now()->subDays(rand(1, 30)),
                    'updated_at' => Carbon::now()->subDays(rand(1, 30)),
                ]);
            }
        }
    }
}
