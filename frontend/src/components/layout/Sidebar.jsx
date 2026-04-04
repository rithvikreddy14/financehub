import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users, LogOut, Moon } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['viewer', 'analyst', 'admin'] },
    { name: 'Records', path: '/records', icon: Receipt, roles: ['analyst', 'admin'] },
    { name: 'Users', path: '/users', icon: Users, roles: ['admin'] },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between h-full border-r border-slate-800">
      <div>
        <div className="h-20 flex items-center px-6 gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">F</div>
          <span className="text-xl font-bold text-white tracking-wide">FinanceHub</span>
        </div>
        <nav className="px-4 py-4 space-y-1">
          {navItems.map((item) => {
            if (!item.roles.includes(user?.role)) return null;
            return (
              <NavLink key={item.path} to={item.path} className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-[#1e293b] text-white font-medium shadow-sm' : 'hover:bg-[#1e293b] hover:text-white'}`
                }>
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div className="px-4 pb-6 space-y-1">
        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-left">
          <LogOut size={20} /><span>Logout</span>
        </button>
      </div>
    </aside>
  );
}