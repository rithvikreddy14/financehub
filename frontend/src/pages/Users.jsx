import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getInitials } from '../utils/formatters';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/users/');
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/api/users/${userId}/role`, { role: newRole });
      toast.success('Role updated successfully');
      fetchUsers();
    } catch (err) { toast.error('Failed to update role'); }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await api.put(`/api/users/${userId}/status`, { is_active: !currentStatus });
      toast.success('Status updated successfully');
      fetchUsers();
    } catch (err) { toast.error('Failed to update status'); }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Search Users</label>
        <div className="relative max-w-full">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500">User</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500">Email</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 text-right">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {getInitials(u.username)}
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{u.username}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
                <td className="px-6 py-4">
                  <select 
                    value={u.role} 
                    onChange={(e) => handleRoleChange(u.id, e.target.value)} 
                    className="bg-white border border-slate-200 text-sm text-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-brand-500 capitalize cursor-pointer shadow-sm"
                  >
                    <option value="admin">Admin</option>
                    <option value="analyst">Analyst</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${u.is_active ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {/* Tailwind Visual Toggle Switch */}
                  <button 
                    onClick={() => handleStatusToggle(u.id, u.is_active)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${u.is_active ? 'bg-brand-600' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${u.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
          <span className="text-sm text-slate-500">{filteredUsers.length} users total</span>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded border border-slate-200 text-slate-400 hover:bg-slate-50"><ChevronLeft size={16}/></button>
            <span className="text-sm text-slate-600 font-medium">Page 1 of 1</span>
            <button className="p-1 rounded border border-slate-200 text-slate-400 hover:bg-slate-50"><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}