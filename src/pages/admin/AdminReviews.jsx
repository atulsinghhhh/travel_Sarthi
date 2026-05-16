import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import StarRating from '../../components/StarRating';
import { Reply } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { adminService } from '../../services/admin.service';

const AdminReviews = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await adminService.getReviews();
      setReviews(data);
    } catch (error) {
      showToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (id) => {
    showToast('Reply feature coming soon', 'success');
  };

  const columns = [
    { header: 'Package', accessor: 'package', render: (row) => <span className="font-medium text-gray-900">{row.package?.title}</span> },
    { header: 'User', accessor: 'user', render: (row) => <span className="text-sm text-gray-600">{row.user?.name}</span> },
    { header: 'Rating', accessor: 'rating', render: (row) => <StarRating rating={row.rating} size={14} /> },
    { header: 'Review', accessor: 'comment', render: (row) => <p className="text-sm text-gray-600 italic line-clamp-2 max-w-xs" title={row.comment}>"{row.comment}"</p> },
    { header: 'Date', accessor: 'created_at', render: (row) => <span className="text-xs text-gray-500">{new Date(row.created_at).toLocaleDateString()}</span> },
    { header: 'Actions', accessor: 'actions', render: (row) => (
      <button 
        onClick={() => handleReply(row.id)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${row.admin_reply ? 'text-gray-400 bg-gray-50 cursor-not-allowed' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}
        disabled={!!row.admin_reply}
      >
        <Reply size={14} />
        {row.admin_reply ? 'Replied' : 'Reply'}
      </button>
    )}
  ];

  return (
    <div>
      <PageHeader title="User Reviews" subtitle="Manage and reply to customer feedback across all packages" />
      <DataTable columns={columns} data={reviews} />
    </div>
  );
};

export default AdminReviews;
