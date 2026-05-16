<?php
namespace App\Http\Controllers;
use App\Models\Review;
use Illuminate\Http\Request;

class AdminReviewController extends Controller
{
    public function index() {
        return response()->json(Review::with(['user', 'package'])->latest()->get());
    }
    public function reply(Request $request, $id) {
        $request->validate(['reply' => 'required|string']);
        $review = Review::findOrFail($id);
        $review->update(['admin_reply' => $request->reply, 'replied_at' => now()]);
        return response()->json($review);
    }
}
