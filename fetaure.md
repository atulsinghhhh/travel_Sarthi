# Travel Sarthi - Frontend Implementation Details

## Overview
This document outlines the frontend structure, features, and technologies used in the "Travel Sarthi" project. The frontend is a Single Page Application (SPA) built using React and Vite, designed to provide a seamless travel booking and management experience for both users and administrators.

## Technologies Used
- **Core Framework**: React (with JSX)
- **Build Tool**: Vite
- **Routing**: React Router (implied by `ProtectedRoute.jsx` and page structure)
- **API Communication**: Axios or standard Fetch (managed via `src/services/api.js`)

## Directory Structure & Architecture
The project follows a modular architecture:
- `src/components/`: Reusable UI components.
- `src/pages/`: Page-level components representing different views in the application.
  - `admin/`: Admin dashboard pages.
  - `dashboard/`: User dashboard pages.
- `src/routes/`: Route definitions and guards (e.g., `ProtectedRoute.jsx`).
- `src/services/`: API integration and business logic services.

## Key Features Implemented

### 1. Authentication & Security
- **Auth Service (`src/services/auth.service.js`)**: Handles user login, registration, and token management.
- **Protected Routes (`src/routes/ProtectedRoute.jsx`)**: Ensures that only authenticated users can access the dashboard and only admins can access the admin panel.

### 2. User Dashboard
Provides registered users with tools to manage their travel experience:
- **Dashboard Home (`DashboardHome.jsx`)**: Main overview of user activity.
- **Profile Management (`Profile.jsx`)**: Allows users to view and update their personal information.
- **My Bookings (`MyBookings.jsx`)**: Displays past and upcoming travel package bookings.
- **Favorites (`Favorites.jsx`)**: Allows users to save and view their favorite travel packages and hotels.

### 3. Admin Panel
Provides administrators with tools to manage the platform:
- **Manage Users (`ManageUsers.jsx`)**: View, edit, or remove user accounts.
- **Manage Packages (`ManagePackages.jsx`)**: Add, update, or delete travel packages available on the platform.

### 4. Backend API Integration
- The frontend is fully integrated with the backend APIs (`integrated backend api` commit).
- **Service Layer**: Dedicated services for different entities (`api.js`, `hotel.service.js`, `package.service.js`) keep API calls isolated from UI components, making the codebase cleaner and easier to maintain.

## Instructions for Claude (Next Steps)
When continuing development or debugging with Claude, you can provide this document as context. Key areas to focus on if making changes:
1. **Adding New Routes**: Update `src/routes/` and ensure proper use of `ProtectedRoute` if the route requires authentication.
2. **API Endpoints**: If the backend endpoints change, update the corresponding service files in `src/services/`.
3. **State Management**: Note how data is fetched in the page components (e.g., `useEffect` hooks calling the service functions) when modifying data flows.
