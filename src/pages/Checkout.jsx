import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { packageService } from '../services/package.service';
import { couponService } from '../services/coupon.service';
import { bookingService } from '../services/booking.service';
import toast from 'react-hot-toast';

const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  startDate: z.string().min(1, 'Start date is required'),
});

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get('packageId');
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema)
  });

  const startDate = watch('startDate');
  const endDate = startDate && pkg ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + pkg.duration)).toISOString().split('T')[0] : '';

  useEffect(() => {
    if (!packageId) {
      navigate('/packages');
      return;
    }
    fetchPackage();
    fetchCoupons();
  }, [packageId]);

  const fetchPackage = async () => {
    try {
      const { data } = await packageService.getById(packageId);
      setPkg(data);
    } catch (error) {
      toast.error('Failed to load package details');
      navigate('/packages');
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      const { data } = await couponService.getAll();
      setCoupons(data || []);
    } catch (err) {
      console.error('Failed to load coupons', err);
    }
  };

  const handleApplyCoupon = async (codeToApply) => {
    const code = typeof codeToApply === 'string' ? codeToApply : couponCode;
    if (!code) return;
    try {
      setCouponError('');
      const { data } = await couponService.validate(code);
      setDiscount(data.discount_percent);
      if (typeof codeToApply === 'string') setCouponCode(codeToApply);
      toast.success(`Coupon ${code} applied successfully! ${data.discount_percent}% off.`);
    } catch (error) {
      setDiscount(0);
      setCouponError(error.response?.data?.message || 'Invalid coupon code');
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await bookingService.create({
        package_id: packageId,
        coupon_code: discount > 0 ? couponCode : null,
        start_date: data.startDate,
        end_date: endDate
      });
      toast.success('Booking confirmed successfully!');
      navigate('/dashboard/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-xl animate-pulse">Loading checkout...</div>;
  if (!pkg) return null;

  const totalAmount = Number(pkg.budget || 0);
  const discountAmount = (totalAmount * discount) / 100;
  const finalAmount = totalAmount - discountAmount;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Col: Forms */}
        <div className="w-full lg:w-2/3 space-y-8">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Traveller Details</h2>
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-1">Full Name</label>
                <input {...register('fullName')} className="w-full p-3.5 bg-gray-50 text-gray-900 font-semibold placeholder-gray-400 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none transition-all" placeholder="John Doe" />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
                <input type="email" {...register('email')} className="w-full p-3.5 bg-gray-50 text-gray-900 font-semibold placeholder-gray-400 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none transition-all" placeholder="john@example.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Phone Number</label>
                <input type="tel" {...register('phone')} className="w-full p-3.5 bg-gray-50 text-gray-900 font-semibold placeholder-gray-400 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none transition-all" placeholder="+1 234 567 8900" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Travel Start Date</label>
                <input type="date" {...register('startDate')} min={new Date().toISOString().split('T')[0]} className="w-full p-3.5 bg-gray-50 text-gray-900 font-semibold border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none transition-all" />
                {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">End Date (Auto-calculated)</label>
                <input type="date" value={endDate} disabled className="w-full p-3.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 font-semibold cursor-not-allowed" />
              </div>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-3 text-gray-800">Apply Coupon</h2>
            
            {/* Available Coupons */}
            {coupons.length > 0 && (
              <div className="mb-4">
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Available Offers</span>
                <div className="flex flex-wrap gap-2">
                  {coupons.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleApplyCoupon(c.code)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        couponCode.toUpperCase() === c.code.toUpperCase() && discount > 0
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

            <div className="flex gap-3">
              <input 
                type="text" 
                value={couponCode} 
                onChange={(e) => setCouponCode(e.target.value)} 
                className="flex-grow p-3.5 bg-gray-50 text-gray-900 font-semibold placeholder-gray-400 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none uppercase transition-all" 
                placeholder="Enter coupon code (e.g., SAVE10)" 
              />
              <button 
                type="button" 
                onClick={() => handleApplyCoupon()}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-black transition font-bold text-sm"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
            {discount > 0 && <p className="text-green-600 text-sm mt-2 font-medium">Coupon applied! {discount}% off.</p>}
          </div>

        </div>

        {/* Right Col: Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-4">Booking Summary</h2>
            
            <div className="flex items-center gap-4 mb-6">
              {pkg.image && <img src={pkg.image} alt="Package" className="w-20 h-20 object-cover rounded-2xl" />}
              <div>
                <h3 className="font-bold text-gray-900 line-clamp-2">{pkg.title}</h3>
                <p className="text-sm text-gray-500">{pkg.duration} Days in {pkg.destination}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 text-gray-700">
              <div className="flex justify-between">
                <span>Base Price</span>
                <span className="font-semibold">${totalAmount.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Discount ({discount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-end mb-8 border-t border-dashed border-gray-200 pt-4">
              <span className="font-bold text-gray-800 text-lg">Total Due</span>
              <span className="text-3xl font-extrabold text-rose-500">${finalAmount.toFixed(2)}</span>
            </div>

            <button 
              type="submit" 
              form="checkout-form" 
              disabled={isSubmitting}
              className="w-full bg-[#FF385C] hover:bg-[#D70466] text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
