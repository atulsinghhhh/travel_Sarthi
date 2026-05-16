<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingConfirmed;
use App\Mail\BookingCancelled;
use App\Notifications\BookingConfirmedNotification;
use App\Notifications\BookingCancelledNotification;

class AdminBookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with(['user:id,name,email,phone', 'package:id,title,image']);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        if ($request->has('date_from') && $request->has('date_to')) {
            $query->whereBetween('start_date', [$request->date_from, $request->date_to]);
        }

        $sort = $request->get('sort', 'created_at_desc');
        switch ($sort) {
            case 'travel_date_asc':
                $query->orderBy('start_date', 'asc');
                break;
            case 'amount_desc':
                $query->orderBy('total_amount', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        return response()->json($query->paginate(20));
    }

    public function show($id)
    {
        $booking = Booking::with(['user', 'package', 'coupon'])->findOrFail($id);
        return response()->json($booking);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
            'reason' => 'nullable|string'
        ]);
        
        $booking = Booking::findOrFail($id);
        $booking->update([
            'status' => $validated['status']
        ]);

        if ($validated['status'] === 'confirmed') {
            // Mail::to($booking->user->email)->queue(new BookingConfirmed($booking));
            if (class_exists(BookingConfirmedNotification::class)) {
                $booking->user->notify(new BookingConfirmedNotification($booking));
            }
        } elseif ($validated['status'] === 'cancelled') {
            // Mail::to($booking->user->email)->queue(new BookingCancelled($booking));
            if (class_exists(BookingCancelledNotification::class)) {
                $booking->user->notify(new BookingCancelledNotification($booking, $request->reason));
            }
        }

        return response()->json($booking);
    }

    public function export(Request $request)
    {
        $bookings = Booking::with(['user', 'package'])->get();
        $csv = "ID,User,Package,Amount,Status,Start Date\n";
        foreach ($bookings as $b) {
            $csv .= "{$b->id},{$b->user->name},{$b->package->title},{$b->total_amount},{$b->status},{$b->start_date}\n";
        }
        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="bookings.csv"');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getPathname(), "r");
        fgetcsv($handle); // Skip header

        $imported = 0;
        while (($row = fgetcsv($handle)) !== false) {
            if (count($row) >= 5 && is_numeric($row[0]) && is_numeric($row[1])) {
                Booking::create([
                    'user_id' => (int) $row[0],
                    'package_id' => (int) $row[1],
                    'total_amount' => (float) $row[2],
                    'status' => in_array(strtolower($row[3]), ['pending','confirmed','cancelled','completed']) ? strtolower($row[3]) : 'pending',
                    'start_date' => $row[4] ?: now()->addDays(7)->format('Y-m-d'),
                ]);
                $imported++;
            }
        }
        fclose($handle);

        return response()->json(['message' => "$imported bookings imported successfully."]);
    }
}
