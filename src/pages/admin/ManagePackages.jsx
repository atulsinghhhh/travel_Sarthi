import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { packageService } from '../../services/package.service';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, [searchTerm]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { data } = await packageService.getAll({ search: searchTerm });
      setPackages(data.data || data);
    } catch (e) {
      showToast('Failed to load packages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await packageService.delete(selectedId);
      showToast('Package deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      fetchPackages();
    } catch (e) {
      showToast('Failed to delete package', 'error');
    }
  };

  const columns = [
    { header: 'Package Name', accessor: 'title', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
          {row.image || (row.images && row.images.length > 0) ? (
            <img src={row.image || (Array.isArray(row.images) ? row.images[0] : JSON.parse(row.images)[0])} alt={row.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium text-xs">N/A</div>
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm line-clamp-1">{row.title}</p>
          <p className="text-xs text-gray-500">{row.destination} • {row.duration || row.duration_days} Days</p>
        </div>
      </div>
    )},
    { header: 'Type', accessor: 'type', render: (row) => <span className="px-2.5 py-1 bg-[#FF385C]/10 text-[#FF385C] rounded-md text-xs font-semibold">{row.type}</span> },
    { header: 'Budget / Price', accessor: 'budget', render: (row) => <span className="text-sm font-medium text-gray-800">₹{Number(row.budget || row.price).toLocaleString('en-IN')}</span> },
    { header: 'Status', accessor: 'is_active', render: (row) => <StatusBadge status={row.is_active !== 0 ? 'Active' : 'Inactive'} /> },
    { header: 'Actions', accessor: 'actions', render: (row) => (
      <div className="flex items-center gap-3">
        <button 
          className="text-sm font-semibold text-[#FF385C] hover:underline" 
          onClick={() => navigate(`/admin/packages/edit/${row.id}`)}
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
        title="Manage Packages" 
        subtitle="Add, edit, and remove curated travel packages and itineraries" 
        actionLabel="+ Create Package" 
        onAction={() => navigate('/admin/packages/new')}
      />

      <div className="bg-white p-6 rounded-t-2xl border border-b-0 border-gray-200 flex flex-col md:flex-row justify-between gap-4">
        <div className="md:w-80">
          <input 
            type="text" 
            placeholder="Search packages by destination or title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] outline-none text-sm transition-all"
          />
        </div>
      </div>

      <DataTable columns={columns} data={packages} loading={loading} emptyMessage="No packages found." />

      <ConfirmDialog 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Package"
        message="Are you sure you want to delete this package? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive={true}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ManagePackages;
