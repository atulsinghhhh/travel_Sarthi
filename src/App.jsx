import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import About from './pages/About';
import Contact from './pages/Contact';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import MyBookings from './pages/dashboard/MyBookings';
import Favorites from './pages/dashboard/Favorites';
import Profile from './pages/dashboard/Profile';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageHotels from './pages/admin/ManageHotels';
import ManagePackages from './pages/admin/ManagePackages';
import PackageForm from './pages/admin/PackageForm';
import ManageBookings from './pages/admin/ManageBookings';
import ManageCoupons from './pages/admin/ManageCoupons';
import AdminReviews from './pages/admin/AdminReviews';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <Toaster position="top-right" />
          <Router>
        <Routes>
        {/* Auth Routes with AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Main Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="hotels/:id" element={<HotelDetails />} />
          <Route path="packages" element={<Packages />} />
          <Route path="packages/:id" element={<PackageDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Dashboard Routes with DashboardLayout */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="hotels" element={<ManageHotels />} />
          <Route path="packages" element={<ManagePackages />} />
          <Route path="packages/new" element={<PackageForm />} />
          <Route path="packages/edit/:id" element={<PackageForm />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="coupons" element={<ManageCoupons />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Route>
      </Routes>
      </Router>
      </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
