import React from 'react';
import {
  Pill,
  LayoutDashboard,
  Users,
  Inbox,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';

type SidebarItem = 'dashboard' | 'patients' | 'inbox' | 'labs' | 'settings';

interface SidebarProps {
  activeItem: SidebarItem;
  onItemChange: (item: SidebarItem) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemChange }) => {
  const navItems = [
    { id: 'dashboard' as SidebarItem, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients' as SidebarItem, label: 'Patients', icon: Users },
    { id: 'inbox' as SidebarItem, label: 'Inbox', icon: Inbox, badge: 3 },
    { id: 'labs' as SidebarItem, label: 'Lab Results', icon: FileText },
    { id: 'settings' as SidebarItem, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">PepRX</span>
            <span className="text-xs text-slate-400 block">Clinic Portal</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
            DR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">Dr. Roberts</p>
            <p className="text-slate-400 text-sm truncate">Medical Director</p>
          </div>
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
