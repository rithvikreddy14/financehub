import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { formatCurrency, formatDate } from '../utils/formatters';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

// Dynamic Palette for the Pie Chart
const DYNAMIC_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#14b8a6', // Teal
  '#ec4899', // Pink
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#84cc16'  // Lime
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);

  useEffect(() => {
    // Fetch Dashboard Analytics
    api.get('/api/dashboard/summary').then(res => setData(res.data)).catch(console.error);
    // Fetch Recent 5 Records for the table
    api.get('/api/records/?limit=5').then(res => setRecentRecords(res.data)).catch(console.error);
  }, []);

  if (!data) return <div className="p-8 font-medium text-slate-500">Loading dashboard...</div>;

  // Process pie chart data with dynamic colors
  const pieData = Object.entries(data.expense_by_category || {}).map(([name, value], index) => ({ 
    name, 
    value,
    color: DYNAMIC_COLORS[index % DYNAMIC_COLORS.length] 
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* 1. Metric Cards */}
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

      {/* 2. Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart */}
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

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-base font-semibold text-slate-800 mb-2">Expense Breakdown</h3>
          <div className="h-48 flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{borderRadius: '8px', border: 'none'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                <div 
                  className="w-2 h-2 rounded-sm" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="capitalize">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recent Transactions Table (This was missing!) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentRecords.length > 0 ? (
                recentRecords.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(r.date)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800 capitalize">{r.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${r.type === 'income' ? 'bg-brand-50 text-brand-600' : 'bg-rose-50 text-rose-600'}`}>
                        {r.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${r.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {r.type === 'income' ? '+' : '-'}{formatCurrency(r.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sm text-slate-500">
                    No recent transactions found. Add some records to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}