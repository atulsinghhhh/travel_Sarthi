<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }
        return response()->json($query->orderByDesc('created_at')->get());
    }

    public function toggleStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);
        // Assuming status column exists. If not, this is a placeholder.
        $user->status = $request->status;
        $user->save();
        return response()->json($user);
    }

    public function toggleRole(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();
        return response()->json($user);
    }
}
