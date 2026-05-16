import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { Search, ShieldAlert, CheckCircle } from 'lucide-react';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', { params: { search: searchTerm } });
      setUsers(data);
    } catch (e) {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async () => {
    try {
      await api.patch(`/admin/users/${selectedUser.id}/status`, { status: selectedUser.status === 'banned' ? 'active' : 'banned' });
      showToast(`User ${selectedUser.status === 'banned' ? 'unbanned' : 'banned'} successfully`, 'success');
      fetchUsers();
    } catch (e) {
      showToast('Operation failed', 'error');
    }
  };

  const handleToggleRole = async (user) => {
    try {
      await api.patch(`/admin/users/${user.id}/role`, { role: user.role === 'admin' ? 'user' : 'admin' });
      showToast(`Role updated to ${user.role === 'admin' ? 'user' : 'admin'}`, 'success');
      fetchUsers();
    } catch (e) {
      showToast('Failed to update role', 'error');
    }
  };

  const columns = [
    { header: 'User', accessor: 'name', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
          {row.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      </div>
    )},
    { header: 'Role', accessor: 'role', render: (row) => <StatusBadge status={row.role || 'user'} /> },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status || 'active'} /> },
    { header: 'Joined', accessor: 'created_at', render: (row) => <span className="text-sm text-gray-600">{new Date(row.created_at).toLocaleDateString()}</span> },
    { header: 'Actions', accessor: 'actions', render: (row) => (
      <div className="flex items-center gap-3">
        <button 
          onClick={() => handleToggleRole(row)}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          {row.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
        </button>
        <button 
          onClick={() => { setSelectedUser(row); setIsBanModalOpen(true); }}
          className={`p-1.5 rounded transition-colors ${row.status === 'banned' ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
          title={row.status === 'banned' ? 'Unban User' : 'Ban User'}
        >
          {row.status === 'banned' ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
        </button>
      </div>
    )}
  ];

  return (
    <div>
      <PageHeader title="Manage Users" subtitle="View and manage all registered users" />
      
      <div className="bg-white p-4 rounded-t-2xl border border-b-0 border-gray-200">
        <div className="relative md:w-80">
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <DataTable columns={columns} data={users} loading={loading} emptyMessage="No users found." />

      <ConfirmDialog 
        isOpen={isBanModalOpen} 
        onClose={() => setIsBanModalOpen(false)}
        title={selectedUser?.status === 'banned' ? "Unban User" : "Ban User"}
        message={`Are you sure you want to ${selectedUser?.status === 'banned' ? 'unban' : 'ban'} ${selectedUser?.name}?`}
        confirmLabel={selectedUser?.status === 'banned' ? "Unban" : "Ban"}
        isDestructive={selectedUser?.status !== 'banned'}
        onConfirm={handleToggleBan}
      />
    </div>
  );
};

export default ManageUsers;
