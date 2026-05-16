import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import { Plus, Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { adminService } from '../../services/admin.service';

const ManageCoupons = () => {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await adminService.getCoupons();
      setCoupons(data);
    } catch (error) {
      showToast('Failed to load coupons', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Coupon code copied!', 'success');
  };

  const columns = [
    { header: 'Code', accessor: 'code', render: (row) => (
      <div className="flex items-center gap-2">
        <span className="font-mono bg-blue-50 px-2 py-1 rounded text-blue-700 font-bold tracking-widest border border-blue-100">{row.code}</span>
        <button onClick={() => copyToClipboard(row.code)} className="text-gray-400 hover:text-blue-600 transition-colors">
          <Copy size={14} />
        </button>
      </div>
    )},
    { header: 'Type', accessor: 'type', cellClassName: 'capitalize text-gray-600 font-medium' },
    { header: 'Value', accessor: 'value', render: (row) => <span className="font-bold text-gray-900">{row.type === 'percentage' ? `${row.value}%` : `₹${row.value}`}</span> },
    { header: 'Usage', accessor: 'usage_limit', render: (row) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: `${(row.used_count / row.usage_limit) * 100}%` }}></div>
        </div>
        <span className="text-xs text-gray-500 font-medium">{row.used_count}/{row.usage_limit}</span>
      </div>
    )},
    { header: 'Valid Until', accessor: 'valid_until', render: (row) => <span className="text-sm text-gray-600">{new Date(row.valid_until).toLocaleDateString()}</span> },
    { header: 'Status', accessor: 'is_active', render: (row) => <StatusBadge status={row.is_active ? 'Active' : 'Expired'} /> },
  ];

  return (
    <div>
      <PageHeader 
        title="Manage Coupons" 
        subtitle="Create discount codes and promotions"
        actionLabel="Create Coupon" 
        actionIcon={Plus}
      />
      <DataTable columns={columns} data={coupons} />
    </div>
  );
};

export default ManageCoupons;
