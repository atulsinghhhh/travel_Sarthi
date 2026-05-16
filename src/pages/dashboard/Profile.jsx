import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import FadeUp from '../../components/common/FadeUp';
import AuthService from '../../services/auth.service';

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: authUser?.name || '',
    email: authUser?.email || '',
    phone: authUser?.phone || '+1 (555) 123-4567',
    address: authUser?.address || 'San Francisco, CA',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (authUser) {
      setFormData(prev => ({
        ...prev,
        name: authUser.name || '',
        email: authUser.email || '',
      }));
    }
  }, [authUser]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('avatar', file);

    setIsUploadingAvatar(true);
    try {
      const response = await AuthService.updateAvatar(uploadData);
      if (response.data?.user) {
        updateUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to upload avatar', error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await AuthService.updateProfile(formData);
      if (response.data?.user) {
        updateUser(response.data.user);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FadeUp className="max-w-4xl space-y-8 mx-auto px-4 py-4">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Profile Settings</h1>
        <p className="text-lg text-gray-500 mt-1 font-medium">Manage your account details and security preferences.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Cover & Avatar */}
        <div className="h-36 bg-gradient-to-r from-[#FF385C] to-rose-700 relative">
          <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors border border-white/20 shadow-sm">
            Change Cover
          </button>
          <div className="absolute -bottom-12 left-8 flex items-end gap-5 z-10">
            <div className="relative group" onClick={() => fileInputRef.current?.click()}>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/*" 
                className="hidden" 
              />
              <img 
                src={authUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'} 
                alt="Avatar" 
                className={`w-24 h-24 rounded-full border-4 border-white object-cover bg-white shadow-md transition ${isUploadingAvatar ? 'opacity-50' : ''}`} 
              />
              {isUploadingAvatar ? (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-20">
          
          {isSaved && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-center gap-3 font-medium animate-fade-in-up">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="font-bold">Profile updated successfully!</span>
            </div>
          )}

          <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3.5 bg-gray-50 text-gray-900 font-semibold placeholder-gray-400 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3.5 bg-gray-50 text-gray-900 font-semibold placeholder-gray-400 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3.5 bg-gray-50 text-gray-900 font-semibold placeholder-gray-400 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Location</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-3.5 bg-gray-50 text-gray-900 font-semibold placeholder-gray-400 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none transition-all" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Current Password</label>
              <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className="w-full md:w-1/2 p-3.5 bg-gray-50 text-gray-900 font-semibold placeholder-gray-400 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none transition-all" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">New Password</label>
              <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full p-3.5 bg-gray-50 text-gray-900 font-semibold placeholder-gray-400 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none transition-all" placeholder="New Password" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Confirm New Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full p-3.5 bg-gray-50 text-gray-900 font-semibold placeholder-gray-400 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none transition-all" placeholder="Confirm Password" />
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-gray-100 pt-8">
            <button type="button" className="px-6 py-3.5 font-bold text-gray-700 hover:bg-gray-100 rounded-2xl transition-colors">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-8 py-3.5 bg-[#FF385C] text-white font-bold rounded-2xl hover:bg-[#D70466] shadow-lg shadow-[#FF385C]/30 hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Saving...
                </>
              ) : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </FadeUp>
  );
};

export default Profile;
