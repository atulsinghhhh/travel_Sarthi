import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'tourist'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      navigate('/dashboard/bookings', { replace: true });
    } catch (error) {
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        const formattedErrors = {};
        Object.keys(serverErrors).forEach(key => {
          formattedErrors[key] = serverErrors[key][0];
        });
        setErrors(formattedErrors);
      } else {
        toast.error('An error occurred during registration.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-center">
        <h1 className="font-bold text-gray-900 text-lg">Log in or sign up</h1>
      </div>
      <div className="p-6 sm:p-8">
        <h2 className="text-[22px] font-semibold text-gray-900 mb-6 tracking-tight">Finish signing up</h2>
        
        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="rounded-xl border border-gray-400 overflow-hidden focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-shadow mb-4">
            <div className="relative group border-b border-gray-400">
              <label className="absolute top-2 left-3 text-xs font-semibold text-gray-500">Legal name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 pb-2 pt-6 border-none focus:ring-0 text-gray-900 outline-none placeholder-gray-400" 
                placeholder="John Doe"
                required
              />
            </div>
            <div className="relative group border-b border-gray-400">
              <label className="absolute top-2 left-3 text-xs font-semibold text-gray-500">Email address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 pb-2 pt-6 border-none focus:ring-0 text-gray-900 outline-none placeholder-gray-400" 
                placeholder="Email address"
                required
              />
            </div>
            <div className="relative group border-b border-gray-400">
              <label className="absolute top-2 left-3 text-xs font-semibold text-gray-500">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 pb-2 pt-6 border-none focus:ring-0 text-gray-900 outline-none placeholder-gray-400" 
                placeholder="Password"
                required
              />
            </div>
            <div className="relative group">
              <label className="absolute top-2 left-3 text-xs font-semibold text-gray-500">Account type</label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 pb-2 pt-6 border-none focus:ring-0 text-gray-900 outline-none cursor-pointer bg-transparent appearance-none"
              >
                <option value="tourist">Tourist (Booking trips)</option>
                <option value="hotel_owner">Host (Listing properties)</option>
              </select>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mb-6">Make sure it matches the name on your government ID.</p>

          {(Object.keys(errors).length > 0) && (
            <div className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
              {Object.values(errors).map((err, i) => <p key={i}>• {err}</p>)}
            </div>
          )}

          <p className="text-xs text-gray-600 mb-5 leading-relaxed">
            By selecting <strong>Agree and continue</strong>, I agree to TravelSaarthi's <a href="#" className="underline font-semibold text-primary">Terms of Service</a>, <a href="#" className="underline font-semibold text-primary">Payments Terms of Service</a>, and <a href="#" className="underline font-semibold text-primary">Nondiscrimination Policy</a> and acknowledge the <a href="#" className="underline font-semibold text-primary">Privacy Policy</a>.
          </p>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#FF385C] hover:bg-[#D70466] text-white font-semibold py-3.5 rounded-lg transition-colors text-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : null}
            Agree and continue
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-700">
          Already have an account? <Link to="/login" className="font-semibold underline text-gray-900">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
