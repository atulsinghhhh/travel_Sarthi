import React, { useState, useEffect } from 'react';
import { hotelService } from '../../services/hotel.service';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import StarRating from '../../components/StarRating';
import Modal from '../../components/Modal';

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchHotels();
  }, [searchTerm]);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const { data } = await hotelService.getAll({ search: searchTerm });
      setHotels(data.data || data); // handle both paginated and unpaginated depending on backend
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
      fetchHotels();
    } catch (e) {
      showToast('Failed to delete hotel', 'error');
    }
  };

  const columns = [
    { header: 'Hotel', accessor: 'name', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
          {row.images && row.images.length > 0 ? (
            <img src={Array.isArray(row.images) ? row.images[0] : JSON.parse(row.images)[0]} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">N/A</div>
          )}
        </div>
        <div>
          <p className="font-bold text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.city}, {row.state}</p>
        </div>
      </div>
    )},
    { header: 'Stars', accessor: 'stars', render: (row) => <StarRating rating={row.stars || 0} size={14} /> },
    { header: 'Rooms', accessor: 'rooms_count', render: (row) => <span className="font-medium text-gray-700">{row.rooms_count || 0}</span> },
    { header: 'Status', accessor: 'is_active', render: (row) => <StatusBadge status={row.is_active !== 0 ? 'Active' : 'Inactive'} /> },
    { header: 'Actions', accessor: 'actions', render: (row) => (
      <div className="flex items-center gap-2">
        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" onClick={() => {
          // Edit logic (normally opens form or navigates)
          showToast('Edit form would open here', 'success');
        }}>
          <Edit2 size={16} />
        </button>
        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" onClick={() => {
          setSelectedId(row.id);
          setIsDeleteModalOpen(true);
        }}>
          <Trash2 size={16} />
        </button>
      </div>
    )}
  ];

  return (
    <div>
      <PageHeader 
        title="Manage Hotels" 
        subtitle="Add, edit, and remove partner hotels" 
        actionLabel="Add Hotel" 
        actionIcon={Plus}
        onAction={() => showToast('Hotel Form Modal coming soon', 'success')}
      />

      <div className="bg-white p-4 rounded-t-2xl border border-b-0 border-gray-200 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative md:w-80">
          <input 
            type="text" 
            placeholder="Search hotels..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
          <Filter size={18} /> Filters
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
    </div>
  );
};

export default ManageHotels;
