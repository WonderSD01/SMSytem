import { useState, useEffect, type ReactNode } from 'react';
import { Search, Trash2, Shield, UserCog, Lock, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useAuth } from '../hooks/useAuth';

interface StaffUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function Staff() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Delete Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<StaffUser | null>(null);

  // Password Reset Modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState<StaffUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await api.put(`/api/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      alert(axiosError.response?.data?.error || 'Failed to update user role');
      fetchUsers();
    }
  };

  const confirmDelete = (user: StaffUser) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/api/users/${userToDelete.id}`);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      alert(axiosError.response?.data?.error || 'Failed to delete user');
    }
  };

  const confirmResetPassword = (user: StaffUser) => {
    setUserToResetPassword(user);
    setNewPassword('');
    setShowPassword(false);
    setIsPasswordModalOpen(true);
  };

  const handleResetPassword = async () => {
    if (!userToResetPassword || !newPassword.trim()) {
      alert('Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      await api.put(`/api/users/${userToResetPassword.id}/password`, {
        password: newPassword
      });
      alert(`Password for ${userToResetPassword.name} has been reset successfully.`);
      setIsPasswordModalOpen(false);
      setUserToResetPassword(null);
      setNewPassword('');
      fetchUsers();
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      console.error('Password reset error:', error);
      console.error('Error response:', axiosError.response?.data);
      alert(axiosError.response?.data?.error || 'Failed to reset password');
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Staff Name',
      render: (item: StaffUser): ReactNode => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
            {item.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {item.name} {item.id === currentUser?.id ? <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full ml-2">(You)</span> : ''}
            </div>
          </div>
        </div>
      )
    },
    { key: 'email', label: 'Email Address' },
    { 
      key: 'role', 
      label: 'System Role',
      render: (item: StaffUser): ReactNode => (
         <select
          value={item.role}
          onChange={(e) => handleRoleChange(item.id, e.target.value)}
          disabled={item.id === currentUser?.id}
          className={`text-sm rounded-lg border-gray-300 py-1.5 pl-3 pr-8 focus:ring-indigo-500 focus:border-indigo-500 font-medium ${
            item.role === 'admin' ? 'text-indigo-700 bg-indigo-50 border-indigo-200' : 'text-gray-700 bg-gray-50'
          } ${item.id === currentUser?.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <option value="admin">Administrator (Owner)</option>
          <option value="cashier">Cashier (Staff)</option>
          <option value="user">Unverified User</option>
        </select>
      )
    },
    { key: 'created_at', label: 'Registered On' },
    {
      key: 'actions',
      label: '',
      render: (item: StaffUser): ReactNode => (
        <div className="flex justify-end pr-4 gap-2">
          <button
            onClick={() => confirmResetPassword(item)}
            className="p-2 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors"
            title="Reset Password"
          >
            <Lock className="w-4 h-4" />
          </button>
          <button
            onClick={() => confirmDelete(item)}
            disabled={item.id === currentUser?.id}
            className={`p-2 rounded-lg transition-colors ${
              item.id === currentUser?.id 
                ? 'text-gray-300 cursor-not-allowed' 
                 : 'text-red-500 hover:bg-red-50'
            }`}
            title={item.id === currentUser?.id ? "Cannot delete yourself" : "Delete Account"}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold border-b-2 border-indigo-500 pb-2 inline-block text-gray-800">
            Staff & Roles
          </h1>
          <p className="text-gray-500 text-sm mt-2 flex items-center">
            <Shield className="w-4 h-4 mr-2 text-indigo-500" />
            Manage team access levels and security permissions
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search staff by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredUsers}
          loading={loading}
        />
      </div>

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Revoke Access"
      >
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg flex items-start">
             <UserCog className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
             <p className="text-sm text-red-800">
                Are you sure you want to permanently delete the account for <strong>{userToDelete?.name}</strong>? 
                This action cannot be undone and they will immediately lose access to the system.
             </p>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Reset User Password"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Set a new password for <strong>{userToResetPassword?.name}</strong>. The user can change this password after logging in with the new credentials.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (minimum 6 characters)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {newPassword && newPassword.length < 6 && (
              <p className="text-xs text-red-600 mt-1">Password must be at least 6 characters</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleResetPassword}
              disabled={newPassword.length < 6}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className="w-4 h-4 mr-2" />
              Reset Password
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
