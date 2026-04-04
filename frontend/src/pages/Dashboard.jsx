import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const DYNAMIC_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#ec4899', '#f97316', '#06b6d4', '#84cc16'];

export default function Dashboard() {
  const { user } = useContext(AuthContext); // Access the current user role
  const [data, setData] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);
  const [pieMonth, setPieMonth] = useState('all'); 

  useEffect(() => {
    api.get('/api/dashboard/summary').then(res => setData(res.data)).catch(console.error);
    api.get('/api/records/?limit=50').then(res => setRecentRecords(res.data)).catch(console.error); 
  }, []);

  if (!data) return <div className="p-8 font-medium text-slate-500">Loading dashboard...</div>;

  const calculatePieData = () => {
    if (pieMonth === 'all') {
      return Object.entries(data.expense_by_category || {}).map(([name, value], index) => ({ 
        name, value, color: DYNAMIC_COLORS[index % DYNAMIC_COLORS.length] 
      }));
    }

    const filteredExpenses = recentRecords.filter(r => r.type === 'expense' && r.date.startsWith(pieMonth));
    const aggregated = filteredExpenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    return Object.entries(aggregated).map(([name, value], index) => ({ 
      name, value, color: DYNAMIC_COLORS[index % DYNAMIC_COLORS.length] 
    }));
  };

  const pieData = calculatePieData();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Metric Cards (Visible to everyone) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start">
          <div><p className="text-sm font-medium text-slate-500 mb-2">Total Income</p><h3 className="text-3xl font-bold text-slate-800">{formatCurrency(data.total_income)}</h3></div>
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><TrendingUp size={20}/></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start">
          <div><p className="text-sm font-medium text-slate-500 mb-2">Total Expenses</p><h3 className="text-3xl font-bold text-slate-800">{formatCurrency(data.total_expense)}</h3></div>
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center"><TrendingDown size={20}/></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start">
          <div><p className="text-sm font-medium text-slate-500 mb-2">Net Balance</p><h3 className="text-3xl font-bold text-slate-800">{formatCurrency(data.net_balance)}</h3></div>
          <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center"><DollarSign size={20}/></div>
        </div>
      </div>

      {/* Charts (Visible to everyone, including Viewers) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-800 mb-6">Monthly Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthly_trends || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-semibold text-slate-800">Expense Breakdown</h3>
            <input type="month" onChange={(e) => setPieMonth(e.target.value || 'all')} className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none text-slate-600 cursor-pointer" />
          </div>
          <div className="h-48 flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{borderRadius: '8px', border: 'none'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {pieData.length > 0 ? pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.color }}></div><span className="capitalize">{entry.name}</span>
              </div>
            )) : <span className="text-xs text-slate-400">No data for this month</span>}
          </div>
        </div>
      </div>

      {/* Conditionally Render Table: HIDDEN for Viewers */}
      {user?.role !== 'viewer' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-6">
          <div className="p-6 border-b border-slate-100"><h3 className="text-base font-semibold text-slate-800">Recent Transactions</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase">Type</th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRecords.slice(0, 5).map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(r.date)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800 capitalize">{r.category}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${r.type === 'income' ? 'bg-brand-50 text-brand-600' : 'bg-rose-50 text-rose-600'}`}>{r.type}</span></td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${r.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>{r.type === 'income' ? '+' : '-'}{formatCurrency(r.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}