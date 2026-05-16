<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Hotel;

class DummyHotelSeeder extends Seeder
{
    public function run()
    {
        Hotel::create([
            'name' => 'The St. Regis Bali Resort',
            'location' => 'Bali, Indonesia',
            'rating' => 4.9,
            'image' => "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]);

        Hotel::create([
            'name' => 'Waldorf Astoria Maldives',
            'location' => 'Male, Maldives',
            'rating' => 5.0,
            'image' => "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]);

        Hotel::create([
            'name' => 'Aman Tokyo',
            'location' => 'Tokyo, Japan',
            'rating' => 4.8,
            'image' => "https://images.unsplash.com/photo-1542314831-c6a4d14d8373?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]);

        Hotel::create([
            'name' => 'Bora Bora Pearl Beach',
            'location' => 'Bora Bora, French Polynesia',
            'rating' => 4.7,
            'image' => "https://images.unsplash.com/photo-1582610116397-edb318620f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]);
    }
}
