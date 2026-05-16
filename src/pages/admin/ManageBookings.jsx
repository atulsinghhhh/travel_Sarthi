import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin.service';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { Download, Search, ChevronDown, CheckCircle, XCircle } from 'lucide-react';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: 'all', search: '' });
  const [searchInput, setSearchInput] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filter.search) {
        setFilter(prev => ({ ...prev, search: searchInput }));
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getBookings(filter);
      setBookings(data.data);
    } catch (e) {
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminService.updateBookingStatus(id, { status: newStatus });
      showToast('Status updated successfully', 'success');
      fetchBookings();
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  const fileInputRef = React.useRef(null);

  const handleExport = async () => {
    try {
      const response = await adminService.exportBookings(filter);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bookings.csv');
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      showToast('Export failed', 'error');
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const { data } = await adminService.importBookings(formData);
      showToast(data.message || 'Bookings imported successfully', 'success');
      fetchBookings();
    } catch (err) {
      showToast('Failed to import CSV file', 'error');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id', cellClassName: 'font-mono text-xs text-gray-500' },
    { header: 'User', accessor: 'user', render: (row) => (
      <div>
        <p className="font-medium text-sm text-gray-900">{row.user.name}</p>
        <p className="text-xs text-gray-500">{row.user.email}</p>
      </div>
    )},
    { header: 'Package', accessor: 'package', render: (row) => <span className="font-normal text-sm text-gray-800">{row.package.title}</span> },
    { header: 'Travel Date', accessor: 'start_date', render: (row) => <span className="text-sm text-gray-600">{new Date(row.start_date).toLocaleDateString()}</span> },
    { header: 'Amount', accessor: 'total_amount', render: (row) => <span className="font-semibold text-sm text-gray-900">₹{Number(row.total_amount).toLocaleString('en-IN')}</span> },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessor: 'actions', render: (row) => (
      <select 
        value={row.status}
        onChange={(e) => handleStatusChange(row.id, e.target.value)}
        className="text-xs border border-gray-200 rounded-lg p-1.5 focus:ring-rose-500 outline-none bg-white cursor-pointer font-medium text-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirm</option>
        <option value="cancelled">Cancel</option>
        <option value="completed">Complete</option>
      </select>
    )}
  ];

  return (
    <div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImport} 
        accept=".csv,.txt" 
        className="hidden" 
      />
      <PageHeader 
        title="Manage Bookings" 
        actionLabel="Export CSV" 
        onAction={handleExport} 
        secondaryActionLabel="Import CSV"
        onSecondaryAction={() => fileInputRef.current?.click()}
      />

      <div className="bg-white p-4 rounded-t-2xl border border-b-0 border-gray-200 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(s => (
            <button 
              key={s} 
              onClick={() => setFilter(prev => ({ ...prev, status: s }))}
              className={`px-4 py-2 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${filter.status === s ? 'bg-rose-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s}
            </button>
          ))}
        </div>
        
        <div className="relative md:w-64">
          <input 
            type="text" 
            placeholder="Search user or email..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 text-sm outline-none"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <DataTable columns={columns} data={bookings} loading={loading} emptyMessage="No bookings found." />
    </div>
  );
};

export default ManageBookings;
