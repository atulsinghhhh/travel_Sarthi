<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\TravellerController;
use App\Http\Controllers\AdminAnalyticsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/hotels', [HotelController::class, 'index']);
Route::get('/hotels/{id}', [HotelController::class, 'show']);

Route::get('/packages', [PackageController::class, 'index']);
Route::get('/packages/{id}', [PackageController::class, 'show']);
Route::get('/packages/{id}/reviews', [ReviewController::class, 'packageReviews']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/user/avatar', [AuthController::class, 'updateAvatar']);
    Route::post('/user/profile', [AuthController::class, 'updateProfile']);

    // Admin Hotel Management
    Route::post('/admin/hotels', [HotelController::class, 'store']);
    Route::put('/admin/hotels/{id}', [HotelController::class, 'update']);
    Route::delete('/admin/hotels/{id}', [HotelController::class, 'destroy']);
    Route::post('/admin/hotels/{id}/images', [HotelController::class, 'uploadImages']);

    // Admin Package Management
    Route::post('/packages', [PackageController::class, 'store']);
    Route::put('/packages/{id}', [PackageController::class, 'update']);
    Route::delete('/packages/{id}', [PackageController::class, 'destroy']);

    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::patch('/bookings/{id}/status', [BookingController::class, 'updateStatus']); // Admin confirm/cancel

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::post('/reviews/{id}/helpful', [ReviewController::class, 'helpful']);

    // Coupons
    Route::get('/coupons', [CouponController::class, 'index']);
    Route::post('/coupons', [CouponController::class, 'store']);
    Route::post('/coupons/validate', [CouponController::class, 'validateCoupon']);

    // Travellers
    Route::apiResource('/travellers', TravellerController::class);

    // Notifications
    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [App\Http\Controllers\NotificationController::class, 'markAllAsRead']);

    // Favorites
    Route::get('/favorites', [App\Http\Controllers\FavoriteController::class, 'index']);
    Route::post('/favorites', [App\Http\Controllers\FavoriteController::class, 'toggle']);

    // Analytics
    Route::get('/admin/stats', [AdminAnalyticsController::class, 'stats']);
    Route::get('/admin/bookings-trend', [AdminAnalyticsController::class, 'bookingsTrend']);
    Route::get('/admin/popular-packages', [AdminAnalyticsController::class, 'popularPackages']);
    Route::get('/admin/user-growth', [AdminAnalyticsController::class, 'userGrowth']);
    Route::get('/admin/bookings-by-type', [AdminAnalyticsController::class, 'bookingsByType']);
    Route::get('/admin/bookings', [App\Http\Controllers\AdminBookingController::class, 'index']);
    Route::get('/admin/bookings/export', [App\Http\Controllers\AdminBookingController::class, 'export']);
    Route::post('/admin/bookings/import', [App\Http\Controllers\AdminBookingController::class, 'import']);
    Route::get('/admin/bookings/{id}', [App\Http\Controllers\AdminBookingController::class, 'show']);
    Route::patch('/admin/bookings/{id}/status', [App\Http\Controllers\AdminBookingController::class, 'updateStatus']);

    // Admin Users
    Route::get('/admin/users', [App\Http\Controllers\AdminUserController::class, 'index']);
    Route::patch('/admin/users/{id}/status', [App\Http\Controllers\AdminUserController::class, 'toggleStatus']);
    Route::patch('/admin/users/{id}/role', [App\Http\Controllers\AdminUserController::class, 'toggleRole']);

    // Admin Coupons
    Route::get('/admin/coupons', [App\Http\Controllers\AdminCouponController::class, 'index']);
    Route::post('/admin/coupons', [App\Http\Controllers\AdminCouponController::class, 'store']);
    Route::put('/admin/coupons/{id}', [App\Http\Controllers\AdminCouponController::class, 'update']);
    Route::delete('/admin/coupons/{id}', [App\Http\Controllers\AdminCouponController::class, 'destroy']);

    // Admin Reviews
    Route::get('/admin/reviews', [App\Http\Controllers\AdminReviewController::class, 'index']);
    Route::post('/admin/reviews/{id}/reply', [App\Http\Controllers\AdminReviewController::class, 'reply']);
});
