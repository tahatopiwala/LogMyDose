import React from 'react';
import { Search, Bell, ChevronRight } from 'lucide-react';

interface HeaderProps {
  breadcrumbs: string[];
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ breadcrumbs, onBack }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-4 h-4 text-slate-400" />}
            <button
              onClick={index === 0 && breadcrumbs.length > 1 ? onBack : undefined}
              className={`text-sm ${
                index === breadcrumbs.length - 1
                  ? 'text-slate-900 font-medium'
                  : 'text-slate-500 hover:text-slate-700'
              } ${index === 0 && breadcrumbs.length > 1 ? 'cursor-pointer' : ''}`}
            >
              {crumb}
            </button>
          </React.Fragment>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patients..."
            className="w-64 pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
};
