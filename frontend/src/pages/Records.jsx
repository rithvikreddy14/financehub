import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Search, Plus, Edit2, Trash2, X, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  "Salary", "Freelance", "Investments", "Rental", "Other",
  "Food", "Transport", "Utilities", "Entertainment", "Shopping", 
  "Healthcare", "Education", "Subscriptions", "Travel", "Insurance", 
  "Dining", "Pets", "Maintenance", "Gifts", "Fitness"
];

export default function Records() {
  const { user } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({ amount: '', type: 'income', category: 'Salary', date: new Date().toISOString().split('T')[0], notes: '' });

  const fetchRecords = async () => {
    try {
      const res = await api.get(`/api/records/?search=${search}`);
      let fetchedData = res.data;

      // Apply Local Filters
      if (typeFilter !== 'All Types') {
        fetchedData = fetchedData.filter(r => r.type === typeFilter);
      }
      if (categoryFilter !== 'All Categories') {
        fetchedData = fetchedData.filter(r => r.category.toLowerCase() === categoryFilter.toLowerCase());
      }
      if (startDate) {
        fetchedData = fetchedData.filter(r => r.date >= startDate);
      }
      if (endDate) {
        fetchedData = fetchedData.filter(r => r.date <= endDate);
      }

      setRecords(fetchedData);
    } catch (err) { console.error(err); }
  };

  // Re-fetch/re-filter whenever any filter state changes
  useEffect(() => { 
    fetchRecords(); 
  }, [search, typeFilter, categoryFilter, startDate, endDate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try { await api.delete(`/api/records/${id}`); toast.success('Record deleted'); fetchRecords(); } 
    catch (err) { toast.error('Failed to delete'); }
  };

  const handleEdit = (record) => {
    setFormData({ amount: record.amount, type: record.type, category: record.category, date: record.date, notes: record.notes || '' });
    setEditingId(record.id);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setFormData({ amount: '', type: 'income', category: 'Salary', date: new Date().toISOString().split('T')[0], notes: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...formData, amount: parseFloat(formData.amount), type: formData.type.toLowerCase(), notes: formData.notes ? formData.notes.trim() : null };
    try {
      if (editingId) { await api.put(`/api/records/${editingId}`, payload); toast.success('Record updated successfully'); } 
      else { await api.post('/api/records/', payload); toast.success('Record added successfully'); }
      setIsModalOpen(false);
      fetchRecords();
    } catch (err) { toast.error('Failed to save record.'); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* Top Bar with All Filters combined */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input type="text" placeholder="Search notes or category..." className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl outline-none text-sm focus:ring-2 focus:ring-brand-500" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        
        {/* Filter Dropdowns and Dates */}
        <div className="flex flex-wrap gap-3 items-center">
          
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer">
            <option>All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer">
            <option>All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Filter size={14} className="text-slate-400" />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-xs outline-none text-slate-600 cursor-pointer" />
            <span className="text-slate-400 text-xs">to</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-xs outline-none text-slate-600 cursor-pointer" />
          </div>

          {user?.role === 'admin' && (
            <button onClick={handleOpenNew} className="bg-brand-600 text-white px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-brand-700 shadow-sm transition-colors">
              <Plus size={16} /> Add Record
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase">Category</th>
              <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase">Notes</th>
              <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase">Type</th>
              <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase text-right">Amount</th>
              {user?.role === 'admin' && <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.length > 0 ? records.map(record => (
              <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600">{formatDate(record.date)}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800 capitalize">{record.category}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{record.notes || '-'}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${record.type === 'income' ? 'bg-brand-50 text-brand-600' : 'bg-rose-50 text-rose-600'}`}>{record.type}</span></td>
                <td className={`px-6 py-4 text-sm font-bold text-right ${record.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>{record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}</td>
                {user?.role === 'admin' && (
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button onClick={() => handleEdit(record)} className="text-slate-400 hover:text-brand-600 transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(record.id)} className="text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                  </td>
                )}
              </tr>
            )) : (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-sm text-slate-500">No records found matching your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Record' : 'Add Record'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Amount</label><input type="number" step="0.01" required value={formData.amount} onChange={(e)=>setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-brand-500" /></div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                  <select value={formData.type} onChange={(e)=>setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-brand-500"><option value="income">Income</option><option value="expense">Expense</option></select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select required value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm capitalize outline-none focus:border-brand-500">
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Date</label><input type="date" required value={formData.date} onChange={(e)=>setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-brand-500" /></div>
              </div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Notes</label><textarea rows="2" value={formData.notes} onChange={(e)=>setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm resize-none outline-none focus:border-brand-500"></textarea></div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 transition-colors rounded-xl shadow-sm">{editingId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}