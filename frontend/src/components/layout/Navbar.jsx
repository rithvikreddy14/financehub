import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getInitials } from '../../utils/formatters';

export default function Navbar({ title }) {
  const { user } = useContext(AuthContext);
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-500 capitalize">{user?.role}</span>
        <div className="w-9 h-9 bg-brand-600 text-white rounded-full flex items-center justify-center font-semibold shadow-md">
          {getInitials(user?.username)}
        </div>
      </div>
    </header>
  );
}