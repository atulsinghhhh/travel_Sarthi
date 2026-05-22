import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FadeUp from '../components/common/FadeUp';
import { StaggerContainer, StaggerItem } from '../components/common/StaggerContainer';
import { Heart, Star, Sparkles, MapPin, CreditCard, Moon, Plane, Bus, Car, Info, ShieldCheck, ArrowRight } from 'lucide-react';
import { hotelService } from '../services/hotel.service';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();


  return (
    <div className={`w-full min-h-screen pb-20 pt-24 ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}>
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16 text-center">
        <FadeUp>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FF385C]/10 text-[#FF385C] mb-6">
            <Sparkles className="w-4 h-4 fill-[#FF385C]" /> Welcome to Next-Gen Travel
          </span>
          <h1 className={`text-4xl md:text-6xl font-black tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Reimagining Tourism with <br />
            <span className="bg-gradient-to-r from-[#FF385C] via-purple-600 to-blue-600 bg-clip-text text-transparent">AI & Sandbox Payment Ecosystem</span>
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto mt-6 font-medium leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-550'}`}>
            Travel Sarthi connects directly to our robust Laravel API backend to host premium stay bookings, secure dummy Razorpay gateways, automated flight reservations, and regional taxi rentals under one single dashboard.
          </p>
        </FadeUp>
      </section>

      {/* About The App Section - Premium Presentation */}
      <section className={`py-20 mt-12 border-t ${isDarkMode ? 'bg-gray-900/40 border-gray-800 text-white' : 'bg-gray-50 border-gray-100 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="lg:w-1/2 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#FF385C]/10 text-[#FF385C]">
                <Sparkles className="w-3.5 h-3.5 fill-[#FF385C]" /> Travel Sarthi Ecosystem
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Your Ultimate Smart <br />
                <span className="text-[#FF385C] bg-gradient-to-r from-[#FF385C] to-purple-600 bg-clip-text text-transparent">AI Travel Companion</span>
              </h2>
              <p className={`text-base md:text-lg leading-relaxed font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Travel Sarthi is a next-generation smart tourism platform that completely reimagines how you discover, plan, and book your dream getaways. Connecting directly to our robust Laravel API backend, we aggregate luxury stays, personalized flight bookings, fast transport rentals, and tailor-made packages into one unified immersive dashboard.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-md ${isDarkMode ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-[#FF385C]/30'}`}>
                  <div className="w-10 h-10 rounded-xl bg-[#FF385C]/15 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-[#FF385C]" />
                  </div>
                  <h4 className="font-extrabold text-lg mb-1">AI Trip Planner</h4>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Powered by state-of-the-art Groq API to generate customized itineraries in seconds.
                  </p>
                </div>
                
                <div className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-md ${isDarkMode ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-[#FF385C]/30'}`}>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center mb-3">
                    <CreditCard className="w-5 h-5 text-purple-500" />
                  </div>
                  <h4 className="font-extrabold text-lg mb-1">Sandbox Payment</h4>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Fully integrated dummy Razorpay gateway supporting smooth mock checkout checkouts.
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-md ${isDarkMode ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-[#FF385C]/30'}`}>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center mb-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <h4 className="font-extrabold text-lg mb-1">Explore Nearby</h4>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Instantly identify and pinpoint popular attractions around any destination.
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-md ${isDarkMode ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-[#FF385C]/30'}`}>
                  <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center mb-3">
                    <Moon className="w-5 h-5 text-teal-500" />
                  </div>
                  <h4 className="font-extrabold text-lg mb-1">Stunning Theme</h4>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Enjoy a premium responsive system that gracefully toggles beautiful Light & Dark modes.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF385C] to-purple-600 rounded-3xl blur-3xl opacity-20 transform scale-95"></div>
              <div className={`relative rounded-3xl border shadow-xl p-8 overflow-hidden backdrop-blur-md ${isDarkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white border-gray-150'}`}>
                <h3 className="text-xl font-extrabold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#FF385C]" /> App Overview Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800/10">
                    <span className="font-semibold text-gray-500">Backend Engine</span>
                    <span className="font-extrabold text-right text-xs bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full border border-emerald-500/20">Laravel 13 (Active)</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800/10">
                    <span className="font-semibold text-gray-500">Database Connection</span>
                    <span className="font-extrabold text-right text-xs bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full border border-blue-500/20">MySQL Live Synced</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800/10">
                    <span className="font-semibold text-gray-500">AI Integration</span>
                    <span className="font-extrabold text-right text-xs bg-purple-500/10 text-purple-500 px-2.5 py-1 rounded-full border border-purple-500/20">Groq LLM SDK v1</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800/10">
                    <span className="font-semibold text-gray-500">Payment Infrastructure</span>
                    <span className="font-extrabold text-right text-xs bg-indigo-500/10 text-indigo-500 px-2.5 py-1 rounded-full border border-indigo-500/20">Razorpay API Sandbox</span>
                  </div>
                </div>
                
                {/* Visual Dashboard Card Mockup */}
                <div className={`mt-6 p-4 rounded-xl border flex items-center gap-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80" alt="Demo" className="w-16 h-16 rounded-lg object-cover shadow-sm" />
                  <div>
                    <h5 className="font-extrabold text-sm mb-0.5">Explore Dubai Desert Safari</h5>
                    <p className="text-xs text-gray-500 font-bold mb-2">Seeded Package deal</p>
                    <span className="text-xs font-black text-[#FF385C]">$320.00 / person</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Services Section - Flights, Bus, Taxi Bookings (Interactive Mockups) */}
      <section className={`py-20 border-t ${isDarkMode ? 'bg-gray-950 border-gray-900 text-white' : 'bg-white border-gray-100 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#FF385C] font-bold text-xs uppercase tracking-widest bg-[#FF385C]/10 px-3 py-1 rounded-md">
              Complete Travel Suite
            </span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 tracking-tight">
              Explore Other Essential Bookings
            </h2>
            <p className={`text-base font-medium mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Seamlessly reserve every leg of your journey. In addition to premium hotels, Travel Sarthi lets you book flights, bus tickets, and cab rides.
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Flight Booking Card */}
            <StaggerItem className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <Plane className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-2xl font-extrabold mb-3 tracking-tight">Global Flight Booking</h3>
                <p className={`text-sm font-medium leading-relaxed mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Compare and secure tickets for major international airlines. Filter by non-stop routes, luggage policies, or premium cabins.
                </p>
                <div className={`p-4 rounded-xl border mb-6 text-xs ${isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">DEL ➔ DXB</span>
                    <span className="text-blue-500 font-extrabold">Indigo Airlines</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Departure: Tomorrow</span>
                    <span className="font-bold text-gray-800">$210.00</span>
                  </div>
                </div>
              </div>
              <button onClick={() => toast.success("Flight search sandbox opened! Booking integrations loaded.")} className="w-full py-3 rounded-xl font-bold bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm">
                Search Flights <ArrowRight className="w-4 h-4" />
              </button>
            </StaggerItem>

            {/* Bus Booking Card */}
            <StaggerItem className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                  <Bus className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-2xl font-extrabold mb-3 tracking-tight">Intercity Express Bus</h3>
                <p className={`text-sm font-medium leading-relaxed mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Quickly book air-conditioned luxury coaches, sleepers, and premium shuttles across regional intercity highway routes.
                </p>
                <div className={`p-4 rounded-xl border mb-6 text-xs ${isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Manali ➔ Delhi</span>
                    <span className="text-orange-500 font-extrabold">Volvo AC Sleeper</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Departure: 08:30 PM</span>
                    <span className="font-bold text-gray-800">$24.00</span>
                  </div>
                </div>
              </div>
              <button onClick={() => toast.success("Bus reservation sandbox initiated! Intercity routes loaded.")} className="w-full py-3 rounded-xl font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm">
                Reserve Bus Seats <ArrowRight className="w-4 h-4" />
              </button>
            </StaggerItem>

            {/* Taxi & rentals Card */}
            <StaggerItem className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  <Car className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-extrabold mb-3 tracking-tight">Luxury Taxi & Rentals</h3>
                <p className={`text-sm font-medium leading-relaxed mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Hire private taxi drivers or self-drive luxury cars by the hour. Absolute comfort and convenience on command.
                </p>
                <div className={`p-4 rounded-xl border mb-6 text-xs ${isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Airport Pickup</span>
                    <span className="text-emerald-500 font-extrabold">Premium Sedan</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Driver Assigned</span>
                    <span className="font-bold text-gray-800">$45.00 / day</span>
                  </div>
                </div>
              </div>
              <button onClick={() => toast.success("Cab booking service requested! Instant dispatcher loaded.")} className="w-full py-3 rounded-xl font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm">
                Book Cab Now <ArrowRight className="w-4 h-4" />
              </button>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Sandbox payment Flow Banner */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-900/60' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`p-8 md:p-12 rounded-[2.5rem] border relative overflow-hidden bg-gradient-to-r ${isDarkMode ? 'from-gray-900 to-gray-950 border-gray-800' : 'from-white to-gray-100 border-gray-200'}`}>
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#FF385C]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl space-y-4 text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-purple-500/15 text-purple-400">
                  <ShieldCheck className="w-4 h-4" /> 100% Secure Sandbox System
                </span>
                <h3 className={`text-2xl md:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  No Real Money. Unlimited Adventure.
                </h3>
                <p className={`text-sm md:text-base font-medium leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Experience full checkout flows with our mock Razorpay payment gateway integration. Simply search for hotels, hostel listings, or tour packages, hit "Book Now", and walk through the real gateway simulator without spending a single dollar.
                </p>
              </div>
              <div className="flex-shrink-0">
                <button onClick={() => toast.success("Razorpay sandbox key active. Try booking any package or stay!")} className="px-8 py-4 bg-gradient-to-r from-[#FF385C] to-purple-600 text-white font-extrabold rounded-2xl hover:opacity-90 shadow-xl transition-all hover:scale-105 active:scale-95 text-sm md:text-base">
                  Test Checkout System
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
