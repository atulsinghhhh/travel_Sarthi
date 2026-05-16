<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'itinerary' => 'array',
        'included' => 'array',
        'excluded' => 'array',
        'images' => 'array',
        'available_dates' => 'array',
    ];

    protected $appends = ['is_favorited'];

    public function getIsFavoritedAttribute()
    {
        if (auth()->check()) {
            return auth()->user()->favorites()->where('package_id', $this->id)->exists();
        }
        return false;
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function scopeByBudget($query, $min, $max)
    {
        if ($min) $query->where('budget', '>=', $min);
        if ($max) $query->where('budget', '<=', $max);
        return $query;
    }

    public function scopeByType($query, $type)
    {
        if ($type) return $query->where('type', $type);
        return $query;
    }

    public function scopeByDestination($query, $destination)
    {
        if ($destination) return $query->where('destination', 'like', '%' . $destination . '%');
        return $query;
    }

    public function scopeSearch($query, $search)
    {
        if ($search) {
            return $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('destination', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }
        return $query;
    }

    public function scopeByDuration($query, $duration)
    {
        if ($duration) return $query->where('duration', $duration);
        return $query;
    }
}
