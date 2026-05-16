import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { packageService } from '../../services/package.service';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';
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
      fetchPackages();
    } catch (e) {
      showToast('Failed to delete package', 'error');
    }
  };

  const columns = [
    { header: 'Package', accessor: 'title', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
          {row.image || (row.images && row.images.length > 0) ? (
            <img src={row.image || (Array.isArray(row.images) ? row.images[0] : JSON.parse(row.images)[0])} alt={row.title} className="w-full h-full object-cover" />
          ) : (
            <Package className="w-full h-full p-2 text-gray-400" />
          )}
        </div>
        <div>
          <p className="font-bold text-gray-900 line-clamp-1">{row.title}</p>
          <p className="text-xs text-gray-500">{row.destination} • {row.duration_days} Days</p>
        </div>
      </div>
    )},
    { header: 'Type', accessor: 'type', render: (row) => <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">{row.type}</span> },
    { header: 'Price', accessor: 'price', render: (row) => <span className="font-bold text-gray-900">₹{Number(row.price).toLocaleString('en-IN')}</span> },
    { header: 'Status', accessor: 'is_active', render: (row) => <StatusBadge status={row.is_active !== 0 ? 'Active' : 'Inactive'} /> },
    { header: 'Actions', accessor: 'actions', render: (row) => (
      <div className="flex items-center gap-2">
        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" onClick={() => navigate(`/admin/packages/edit/${row.id}`)}>
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
        title="Manage Packages" 
        subtitle="Add, edit, and remove tour packages" 
        actionLabel="Create Package" 
        actionIcon={Plus}
        onAction={() => navigate('/admin/packages/new')}
      />

      <div className="bg-white p-4 rounded-t-2xl border border-b-0 border-gray-200 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative md:w-80">
          <input 
            type="text" 
            placeholder="Search packages..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
