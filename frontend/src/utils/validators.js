import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { formatCurrency, formatDate } from '../utils/formatters';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);

  useEffect(() => {
    api.get('/api/dashboard/summary').then(res => setData(res.data));
    api.get('/api/records/?limit=5').then(res => setRecentRecords(res.data));
  }, []);

  if (!data) return <div className="p-8">Loading dashboard...</div>;
  const pieData = Object.entries(data.expense_by_category || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Total Income</p>
            <h3 className="text-3xl font-bold text-slate-800">{formatCurrency(data.total_income)}</h3>
          </div>
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><TrendingUp size={20}/></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Total Expenses</p>
            <h3 className="text-3xl font-bold text-slate-800">{formatCurrency(data.total_expense)}</h3>
          </div>
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center"><TrendingDown size={20}/></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Net Balance</p>
            <h3 className="text-3xl font-bold text-slate-800">{formatCurrency(data.net_balance)}</h3>
          </div>
          <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center"><DollarSign size={20}/></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-800 mb-6">Monthly Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthly_trends || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-base font-semibold text-slate-800 mb-6">Expense Breakdown</h3>
          <div className="h-64 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100"><h3 className="text-base font-semibold">Recent Transactions</h3></div>
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
            {recentRecords.map(r => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-600">{formatDate(r.date)}</td>
                <td className="px-6 py-4 text-sm font-medium capitalize">{r.category}</td>
                <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${r.type === 'income' ? 'bg-brand-50 text-brand-600' : 'bg-rose-50 text-rose-600'}`}>{r.type}</span></td>
                <td className={`px-6 py-4 text-sm font-bold text-right ${r.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>{r.type === 'income' ? '+' : '-'}{formatCurrency(r.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}