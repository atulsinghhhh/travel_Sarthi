import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const from = location.state?.from?.pathname || '/dashboard/bookings';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const resp = await login({
        email: formData.email,
        password: formData.password
      });
      
      const loggedUser = resp.user || resp;
      const isAdminUser =
        loggedUser.role === 'admin' ||
        loggedUser.is_admin ||
        loggedUser.email === 'admin@travelsarthi.com';

      if (isAdminUser) {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        const formattedErrors = {};
        Object.keys(serverErrors).forEach(key => {
          formattedErrors[key] = serverErrors[key][0];
        });
        setErrors(formattedErrors);
      } else {
        toast.error('Invalid credentials or an error occurred.');
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
        <h2 className="text-[22px] font-semibold text-gray-900 mb-6 tracking-tight">Welcome to TravelSaarthi</h2>
        
        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="rounded-xl border border-gray-400 overflow-hidden focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-shadow">
            <div className="border-b border-gray-400 relative group">
              <label className="absolute top-2 left-3 text-xs font-semibold text-gray-500">Email</label>
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
            <div className="relative group">
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
          </div>
          
          {(errors.email || errors.password) && (
            <p className="text-red-500 text-sm mt-3 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              {errors.email || errors.password}
            </p>
          )}

          <p className="text-xs text-gray-600 mt-4 leading-relaxed">
            We'll call or text you to confirm your number. Standard message and data rates apply. <a href="#" className="underline font-semibold text-gray-900">Privacy Policy</a>
          </p>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 rounded-lg mt-5 transition-colors text-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : null}
            Continue
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500 font-normal">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="space-y-4">
          <button className="w-full flex items-center justify-between px-6 py-3 border border-black rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-900">
            <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span>Continue with Facebook</span>
            <div className="w-5 h-5"></div>
          </button>
          <button className="w-full flex items-center justify-between px-6 py-3 border border-black rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-900">
            <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571c.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
            <span>Continue with Google</span>
            <div className="w-5 h-5"></div>
          </button>
          <button className="w-full flex items-center justify-between px-6 py-3 border border-black rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-900">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
            <span>Continue with Apple</span>
            <div className="w-5 h-5"></div>
          </button>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-700">
          Need an account? <Link to="/register" className="font-semibold underline text-gray-900">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
