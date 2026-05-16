import React, { useState, useEffect } from 'react';
import { hotelService } from '../../services/hotel.service';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/admin/StatusBadge';
import Modal from '../../components/Modal';

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    location: '',
    rating: 5,
    price: 250,
    type: 'Resort',
    image: '',
    is_active: 1
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchHotels();
  }, [searchTerm]);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const { data } = await hotelService.getAll({ search: searchTerm });
      setHotels(data.data || data);
    } catch (e) {
      showToast('Failed to load hotels', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await hotelService.delete(selectedId);
      showToast('Hotel deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      fetchHotels();
    } catch (e) {
      showToast('Failed to delete hotel', 'error');
    }
  };

  const handleOpenAdd = () => {
    setEditingHotel(null);
    setFormData({
      name: '',
      city: '',
      state: '',
      location: '',
      rating: 5,
      price: 250,
      type: 'Resort',
      image: '',
      is_active: 1
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name || '',
      city: hotel.city || '',
      state: hotel.state || '',
      location: hotel.location || '',
      rating: hotel.rating || hotel.stars || 5,
      price: hotel.price || hotel.price_per_night || 250,
      type: hotel.type || 'Resort',
      image: hotel.image || hotel.imageUrl || '',
      is_active: hotel.is_active !== undefined ? hotel.is_active : 1
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHotel) {
        await hotelService.update(editingHotel.id, formData);
        showToast('Hotel updated successfully', 'success');
      } else {
        await hotelService.create(formData);
        showToast('Hotel created successfully', 'success');
      }
      setIsFormModalOpen(false);
      fetchHotels();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save hotel', 'error');
    }
  };

  const columns = [
    { header: 'Hotel Name', accessor: 'name', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
          {row.image || row.imageUrl ? (
            <img src={row.image || row.imageUrl} alt={row.name} className="w-full h-full object-cover" />
          ) : row.images && row.images.length > 0 ? (
            <img src={Array.isArray(row.images) ? row.images[0] : JSON.parse(row.images)[0]} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium text-xs">N/A</div>
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{row.name}</p>
          <p className="text-xs text-gray-500">{row.city || row.location}</p>
        </div>
      </div>
    )},
    { header: 'Rating', accessor: 'rating', render: (row) => <span className="text-sm font-medium text-gray-800">{row.rating || row.stars || '5.0'} Stars</span> },
    { header: 'Price / Night', accessor: 'price', render: (row) => <span className="text-sm font-medium text-gray-800">${row.price || row.price_per_night || 250}</span> },
    { header: 'Status', accessor: 'is_active', render: (row) => <StatusBadge status={row.is_active !== 0 ? 'Active' : 'Inactive'} /> },
    { header: 'Actions', accessor: 'actions', render: (row) => (
      <div className="flex items-center gap-3">
        <button 
          className="text-sm font-semibold text-[#FF385C] hover:underline"
          onClick={() => handleOpenEdit(row)}
        >
          Edit
        </button>
        <button 
          className="text-sm font-semibold text-gray-500 hover:text-red-600 hover:underline"
          onClick={() => {
            setSelectedId(row.id);
            setIsDeleteModalOpen(true);
          }}
        >
          Delete
        </button>
      </div>
    )}
  ];

  return (
    <div>
      <PageHeader 
        title="Manage Hotels" 
        subtitle="Add, edit, and remove partner hotels and accommodations" 
        actionLabel="+ Add Hotel" 
        onAction={handleOpenAdd}
      />

      <div className="bg-white p-6 rounded-t-2xl border border-b-0 border-gray-200 flex flex-col md:flex-row justify-between gap-4">
        <div className="md:w-80">
          <input 
            type="text" 
            placeholder="Search hotels by name or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none text-sm transition-all"
          />
        </div>
        <button className="px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-sm">
          Filters
        </button>
      </div>

      <DataTable columns={columns} data={hotels} loading={loading} emptyMessage="No hotels found matching your search." />

      <ConfirmDialog 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Hotel"
        message="Are you sure you want to delete this hotel? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive={true}
        onConfirm={handleDelete}
      />

      {/* Hotel Modal Form */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        title={editingHotel ? "Edit Hotel" : "Add New Hotel"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Hotel Name</label>
            <input 
              type="text" 
              required
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none text-sm transition-all"
              placeholder="e.g. Grand Taj Luxury Resort"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City / Destination</label>
              <input 
                type="text" 
                required
                value={formData.city || formData.location} 
                onChange={(e) => setFormData({...formData, city: e.target.value, location: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none text-sm transition-all"
                placeholder="e.g. Goa"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">State / Country</label>
              <input 
                type="text" 
                value={formData.state} 
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none text-sm transition-all"
                placeholder="e.g. India"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price per Night ($)</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Star Rating (1-5)</label>
              <input 
                type="number" 
                required
                min="1" 
                max="5"
                step="0.1"
                value={formData.rating} 
                onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Accommodation Type</label>
            <select 
              value={formData.type} 
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none text-sm transition-all cursor-pointer"
            >
              <option value="Resort">Resort</option>
              <option value="Hotel">Hotel</option>
              <option value="Villa">Villa</option>
              <option value="Cabin">Cabin</option>
              <option value="Castle">Castle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
            <input 
              type="url" 
              value={formData.image} 
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none text-sm transition-all"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => setIsFormModalOpen(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-sm transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-3 bg-[#FF385C] text-white font-semibold rounded-xl hover:bg-[#D70466] text-sm transition-colors shadow-lg"
            >
              {editingHotel ? "Update Hotel" : "Create Hotel"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageHotels;
