import React, { useState, useEffect } from 'react';
import { travellerService } from '../../services/traveller.service';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit2, Trash2, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '../../components/Modal';

const schema = z.object({
  full_name: z.string().min(3, 'Required'),
  dob: z.string().min(1, 'Required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  passport_number: z.string().min(5, 'Required'),
  passport_expiry: z.string().min(1, 'Required'),
  nationality: z.string().min(2, 'Required'),
  phone: z.string().min(10, 'Required'),
});

const Travellers = () => {
  const [travellers, setTravellers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    fetchTravellers();
  }, []);

  const fetchTravellers = async () => {
    try {
      const { data } = await travellerService.getAll();
      setTravellers(data);
    } catch (error) {
      showToast('Failed to load travellers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (traveller = null) => {
    if (traveller) {
      setEditingId(traveller.id);
      Object.keys(traveller).forEach(key => setValue(key, traveller[key]));
    } else {
      setEditingId(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await travellerService.update(editingId, data);
        showToast('Traveller updated', 'success');
      } else {
        await travellerService.create(data);
        showToast('Traveller added', 'success');
      }
      setIsModalOpen(false);
      fetchTravellers();
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this traveller?')) return;
    try {
      await travellerService.delete(id);
      showToast('Traveller deleted', 'success');
      fetchTravellers();
    } catch (error) {
      showToast('Failed to delete', 'error');
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-lg">Loading your travellers...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Saved Travellers</h1>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm">
          <Plus size={18} /> Add Traveller
        </button>
      </div>

      {travellers.length === 0 ? (
        <div className="bg-gray-50 text-center py-16 rounded-xl border border-dashed border-gray-300">
          <h3 className="text-xl font-medium text-gray-600 mb-2">No travellers saved</h3>
          <p className="text-gray-500">Save your family or friends' details for quicker booking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travellers.map(t => (
            <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative group hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(t)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded"><Edit2 size={16}/></button>
                <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded"><Trash2 size={16}/></button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600"><User size={24}/></div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{t.full_name}</h3>
                  <p className="text-xs text-gray-500">{t.nationality} • {t.gender}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium text-gray-700">DOB:</span> {new Date(t.dob).toLocaleDateString()}</p>
                <p><span className="font-medium text-gray-700">Passport:</span> •••• {t.passport_number.slice(-4)}</p>
                <p><span className="font-medium text-gray-700">Expiry:</span> {new Date(t.passport_expiry).toLocaleDateString()}</p>
                <p><span className="font-medium text-gray-700">Phone:</span> {t.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Traveller' : 'Add Traveller'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input {...register('full_name')} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input type="date" {...register('dob')} max={new Date().toISOString().split('T')[0]} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select {...register('gender')} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Passport No.</label>
              <input {...register('passport_number')} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
              {errors.passport_number && <p className="text-red-500 text-xs mt-1">{errors.passport_number.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Passport Expiry</label>
              <input type="date" {...register('passport_expiry')} min={new Date().toISOString().split('T')[0]} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.passport_expiry && <p className="text-red-500 text-xs mt-1">{errors.passport_expiry.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nationality</label>
              <input {...register('nationality')} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input {...register('phone')} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
              {editingId ? 'Update Traveller' : 'Save Traveller'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Travellers;
