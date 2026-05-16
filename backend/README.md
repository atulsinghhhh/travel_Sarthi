# ⚙️ Travel Sarthi - Laravel 11 REST API Backend

This directory houses the robust, secure REST API backend for **Travel Sarthi**, engineered with Laravel 11. It provides powerful data management, secure authentication via Laravel Sanctum, persistent object storage with MinIO S3, and comprehensive endpoints for hotel bookings, curated travel packages, discount coupons, real-time notifications, and user reviews.

---

## 🏛️ Backend Architecture & Core Systems

### 🔐 1. Authentication & Security (Laravel Sanctum)
- **Token-Based Auth**: Secure API token generation for stateless authentication across web and mobile clients.
- **Role-Based Access Control**: Middleware protection isolating standard users from administrative endpoints.
- **Context Persistence**: Secure profile updates and token validation endpoints supporting persistent frontend user sessions.

### 🗄️ 2. MinIO S3 Storage Integration
- **Flysystem S3 Driver**: Configured directly in `config/filesystems.php` to communicate seamlessly with local Docker-based MinIO storage (`http://localhost:9000`).
- **Dynamic Asset Management**: Avatars, hotel showcase photos, and package banners are securely uploaded and served from the public `travelsarthi` bucket.
- **Local Fallback**: Built-in support for standard local storage (`storage/app/public`) when S3 containers are offline.

### ⚡ 3. Eloquent ORM & Relational Modeling
- **Hotels & Rooms**: Multi-tier pricing, room inventory management, and amenity tagging.
- **Curated Packages**: Itinerary day-by-day mapping, inclusions/exclusions, and dynamic availability.
- **Bookings**: Transaction tracking, booking statuses (pending, confirmed, cancelled), coupon discount deductions, and tax calculations.
- **Polymorphic / Unified Reviews**: Flexible rating and commentary system attached to both hotels and travel packages.
- **Coupons**: Expiry dates, minimum spend thresholds, discount percentage / fixed amount calculations.
- **Notifications**: System-wide notifications with read/unread tracking and batch actions.

---

## 🚀 Getting Started & Installation

### 1. Requirements
- PHP 8.2 or higher
- Composer (v2+)
- SQLite / MySQL
- MinIO Docker Container (running on port 9000)

### 2. Environment Configuration
Clone the repository and set up your `.env` file:
```bash
cp .env.example .env
```
Ensure your database and S3 storage settings match your setup:
```env
APP_NAME="Travel Sarthi API"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite

FILESYSTEM_DISK=s3

AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=travelsarthi
AWS_ENDPOINT=http://127.0.0.1:9000
AWS_USE_PATH_STYLE_ENDPOINT=true
```

### 3. Install Dependencies & Migrate
Install PHP packages, generate your app encryption key, and seed the database with initial sample data:
```bash
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
```
> **Note**: Running `migrate --seed` populates the database with default administrator credentials, sample luxury hotels, curated packages, active discount coupons, and mock reviews.

### 4. Start Development Server
Launch the built-in PHP development server:
```bash
php artisan serve
```
The REST API will be accessible at `http://localhost:8000/api`.

---

## 📡 API Endpoints Overview

All API endpoints are prefixed with `/api`.

### **Authentication (`/auth`)**
- `POST /api/register` - Register a new user account.
- `POST /api/login` - Authenticate user and issue Sanctum token.
- `POST /api/logout` - Revoke current user token (Requires Auth).
- `GET /api/user` - Get authenticated user profile details.
- `POST /api/user/avatar` - Upload a custom user avatar to MinIO S3.

### **Hotels & Packages (`/hotels`, `/packages`)**
- `GET /api/hotels` - List all luxury hotels with filtering & search.
- `GET /api/hotels/{id}` - Retrieve detailed hotel showcase, room availability, and guest reviews.
- `GET /api/packages` - List all curated holiday packages.
- `GET /api/packages/{id}` - Retrieve package itinerary, inclusions, and pricing.

### **Bookings (`/bookings`)**
- `GET /api/bookings` - List user's active and historical bookings (Requires Auth).
- `POST /api/bookings` - Submit a new hotel or package booking.
- `GET /api/bookings/{id}` - Retrieve booking receipt and status.

### **Coupons (`/coupons`)**
- `GET /api/coupons` - List active promotional coupons.
- `POST /api/coupons/validate` - Validate a promo code against cart items and calculate discount.

### **Reviews (`/reviews`)**
- `GET /api/reviews` - Fetch reviews for specific properties or packages.
- `POST /api/reviews` - Submit a guest review and star rating (Requires Auth).
- `POST /api/reviews/{id}/helpful` - Upvote a review as helpful.
- `POST /api/reviews/{id}/reply` - Post an official admin response (Admin Only).

### **Notifications (`/notifications`)**
- `GET /api/notifications` - Fetch user's unread & recent notifications.
- `POST /api/notifications/mark-read` - Mark all notifications as read.

---

## 🛠️ Testing & Artisan Utilities

Run test suites to ensure endpoint integrity and Sanctum authentication stability:
```bash
php artisan test
```

To clear all cache configurations during deployment or debugging:
```bash
php artisan optimize:clear
```
