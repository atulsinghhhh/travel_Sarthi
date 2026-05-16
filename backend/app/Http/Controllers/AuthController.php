<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials provided.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:5120',
        ]);

        $user = $request->user();

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $path = 'avatars/' . uniqid() . '.' . $file->getClientOriginalExtension();

            try {
                \Illuminate\Support\Facades\Storage::disk('s3')->put($path, file_get_contents($file), 'public');
                $url = rtrim(env('AWS_URL'), '/') . '/' . $path;
            } catch (\Exception $e) {
                // Fallback to local public disk if MinIO connection fails
                $localPath = $file->store('avatars', 'public');
                $url = asset('storage/' . $localPath);
            }

            $user->avatar = $url;
            $user->save();
        }

        return response()->json(['user' => $user]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:users,email,' . $user->id,
            'currentPassword' => 'nullable|string',
            'newPassword' => 'nullable|string|min:8',
        ]);

        if (!empty($validated['name'])) $user->name = $validated['name'];
        if (!empty($validated['email'])) $user->email = $validated['email'];

        if (!empty($validated['newPassword'])) {
            if (!empty($validated['currentPassword']) && Hash::check($validated['currentPassword'], $user->password)) {
                $user->password = Hash::make($validated['newPassword']);
            } else {
                return response()->json(['message' => 'Current password is incorrect'], 400);
            }
        }

        $user->save();

        return response()->json(['user' => $user]);
    }
}
