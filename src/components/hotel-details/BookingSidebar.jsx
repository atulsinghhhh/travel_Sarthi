import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { couponService } from '../../services/coupon.service';
import toast from 'react-hot-toast';

const BookingSidebar = ({ pricePerNight }) => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await couponService.getAll();
        setCoupons(data || []);
      } catch (err) {
        console.error('Failed to load coupons', err);
      }
    };
    fetchCoupons();
  }, []);

  const handleApplyCoupon = async (codeToApply) => {
    const code = codeToApply || couponCode;
    if (!code) return;
    try {
      const { data } = await couponService.validate(code);
      setDiscountPercent(data.discount_percent);
      if (codeToApply) setCouponCode(codeToApply);
      toast.success(`Coupon ${code} applied! ${data.discount_percent}% off.`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired coupon');
      setDiscountPercent(0);
    }
  };

  // Simple calculation logic
  const calculateDays = () => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    }
    return 1;
  };

  const days = calculateDays();
  const basePrice = pricePerNight * days;
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const discountedBase = basePrice - discountAmount;
  const taxes = Math.round(discountedBase * 0.1); // 10% tax
  const total = discountedBase + taxes;

  const handleReserve = () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates.');
      return;
    }
    toast.success('Reservation requested successfully! Our host will confirm your dates shortly.');
    navigate('/dashboard/bookings');
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl sticky top-24">
      <div className="flex items-end gap-1 mb-6">
        <span className="text-2xl md:text-3xl font-black text-gray-900">${pricePerNight}</span>
        <span className="text-gray-500 font-medium pb-1 text-sm">/ night</span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Check-in</label>
            <input 
              type="date" 
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-semibold focus:bg-white focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Check-out</label>
            <input 
              type="date" 
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-semibold focus:bg-white focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Guests</label>
          <select 
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-semibold focus:bg-white focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none transition-all appearance-none cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Available Coupons */}
      {coupons.length > 0 && (
        <div className="mb-4">
          <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Available Coupons</span>
          <div className="flex flex-wrap gap-2">
            {coupons.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleApplyCoupon(c.code)}
                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                  couponCode.toUpperCase() === c.code.toUpperCase() && discountPercent > 0
                    ? 'bg-[#FF385C] text-white border-[#FF385C] shadow-sm'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                🏷️ {c.code} ({c.discount_percent}% OFF)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Coupon Input */}
      <div className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={couponCode} 
          onChange={(e) => setCouponCode(e.target.value)} 
          placeholder="Enter coupon code" 
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-semibold focus:bg-white focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none uppercase transition-all"
        />
        <button 
          type="button" 
          onClick={() => handleApplyCoupon()} 
          className="bg-gray-900 hover:bg-black text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors"
        >
          Apply
        </button>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-gray-100 pt-4 space-y-3 mb-6 text-sm font-medium">
        <div className="flex justify-between text-gray-600">
          <span>${pricePerNight} x {days} nights</span>
          <span className="text-gray-900 font-bold">${basePrice}</span>
        </div>
        {discountPercent > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold">
            <span>Discount ({discountPercent}%)</span>
            <span>-${discountAmount}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Taxes & Fees (10%)</span>
          <span className="text-gray-900 font-bold">${taxes}</span>
        </div>
        <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center font-bold text-base text-gray-900">
          <span>Total</span>
          <span className="text-[#FF385C] text-xl font-black">${total}</span>
        </div>
      </div>

      <button 
        onClick={handleReserve}
        className="w-full py-4 bg-[#FF385C] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-[#D70466] transform hover:-translate-y-0.5 transition-all"
      >
        Reserve Now
      </button>
      
      <p className="text-center text-xs text-gray-500 mt-4">You won't be charged yet</p>
    </div>
  );
};

export default BookingSidebar;
