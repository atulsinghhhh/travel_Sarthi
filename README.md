# ✈️ Travel Sarthi - Premium Travel Booking & Management Platform

![Travel Sarthi Banner](https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80)

**Travel Sarthi** is a state-of-the-art, comprehensive travel booking and management platform designed with an elegant, premium Airbnb-inspired aesthetic. Featuring pristine glassmorphism, modern typography, and signature rose accents (`#FF385C`), the platform delivers an intuitive, seamless booking workflow for travelers and a powerful control center for administrators.

---

## ✨ Key Highlights & Premium Features

### 🎨 1. Airbnb-Inspired Design System
- **Luxurious Interface**: Clean white layouts with signature rose (`#FF385C`) interactive highlights.
- **Dynamic Micro-Animations**: Smooth hover scaling on property cards, interactive sticky booking widgets, responsive drawers, and beautiful transition animations.
- **Flawless Responsiveness**: Meticulously crafted for mobile, tablet, and desktop viewports.

### 🗄️ 2. Automated S3 Storage (MinIO)
- **Containerized Infrastructure**: Fully automated local MinIO S3 object storage deployed via Docker Compose.
- **Direct S3 Integration**: Flysystem S3 disk driver configured in Laravel for direct image and avatar uploads.
- **Public & Private Access**: Automatic `travelsarthi` bucket creation with public read access for seamless asset delivery across the frontend.

### 🔔 3. Real-Time Notifications Engine
- **Global Notification Bell**: Integrated directly into navigation headers across user and admin portals.
- **Live Updates**: Instant notification alerts and unread count badges for new bookings, incoming guest reviews, and promotional updates.
- **Quick Actions**: One-click "Mark all as read" capability for effortless notification management.

### 🏷️ 4. Dynamic Discount Coupons & One-Click Checkout
- **Interactive Coupon Badges**: Active promo codes (e.g., `SUMMER25`, `WELCOME10`) are fetched dynamically and rendered as clickable tags within checkout and booking sidebars.
- **Real-Time Validation & Calculation**: Instant coupon verification, automatic discount deduction, and dynamic tax recalculation before booking submission.

### ⭐ 5. Robust Reviews & Community Ratings
- **Unified Review System**: Support for detailed guest reviews across both Hotels and Curated Travel Packages.
- **Rich Feedback**: Formatted guest avatars, star breakdown summaries, helpfulness voting, and official administrative replies directly from the dashboard.

### 🛡️ 6. Powerful User & Admin Dashboards
- **User Dashboard**: Manage active/past bookings, curate favorite wishlists, update profile bios, and seamlessly upload custom profile avatars.
- **Admin Control Center**: Visual analytics tracking revenue and user growth, full CRUD management for travel packages and users, and centralized review moderation.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18 with Vite & JSX
- **Styling**: Tailwind CSS & custom Vanilla CSS utilities
- **State & Routing**: React Context API (`AuthContext`, `ToastContext`) & React Router DOM
- **HTTP Client**: Axios with global interceptors

### **Backend**
- **Framework**: Laravel 11 (PHP 8.2+)
- **Authentication**: Laravel Sanctum Token-Based Authentication
- **Database**: SQLite / MySQL Eloquent ORM
- **Filesystem**: League Flysystem S3 Driver for MinIO S3 Object Storage

### **DevOps & Infrastructure**
- **Containerization**: Docker & Docker Compose (`minio` & `minio-setup` automated buckets)

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PHP](https://www.php.net/) (v8.2+)
- [Composer](https://getcomposer.org/)
- [Docker & Docker Compose](https://www.docker.com/)

### 2. Infrastructure Setup (MinIO S3)
Spin up the automated MinIO storage containers from the root directory:
```bash
docker-compose up -d
```
> **Note**: The `minio-setup` container will automatically initialize the `travelsarthi` bucket with correct public download policies at `http://localhost:9000`.

### 3. Backend Setup
Navigate into the backend directory and configure Laravel:
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```
> The Laravel backend will be live at `http://localhost:8000`.

### 4. Frontend Setup
Open a new terminal, install frontend dependencies from the root, and start Vite:
```bash
npm install
npm run dev
```
> The React frontend will be live at `http://localhost:5173`.

---

## 📁 Repository Structure

```text
travel-sarthi/
├── backend/                  # Laravel 11 REST API Backend
│   ├── app/Models/           # Eloquent Models (User, Hotel, Package, Booking, Review, Coupon, etc.)
│   ├── app/Http/Controllers/ # RESTful API Controllers
│   ├── database/             # Migrations, Factories, and Seeders
│   └── routes/api.php        # Centralized API Route Definitions
├── docker-compose.yml        # MinIO S3 Object Storage Docker Configuration
└── src/                      # React 18 Frontend Application
    ├── components/           # Reusable UI Components (Navbar, NotificationBell, Cards, Sidebars)
    ├── context/              # Authentication & Notification Context Providers
    ├── layouts/              # Main, Dashboard, and Admin Layout Wrappers
    ├── pages/                # Page Views (Home, Hotels, Packages, Checkout, Help, Dashboards)
    ├── routes/               # Route Configuration & Protected Route Guards
    └── services/             # Axios API Communicators (`api.js`)
```

---

## 📄 License & Terms

Travel Sarthi is proprietary software developed for high-performance travel booking and hospitality management. All rights reserved.
