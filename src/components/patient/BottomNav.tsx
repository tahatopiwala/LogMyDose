import React from 'react';
import { Home, FileText, MessageSquare, BookOpen } from 'lucide-react';
import { PatientTab } from '../../types';

interface BottomNavProps {
  activeTab: PatientTab;
  onTabChange: (tab: PatientTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as PatientTab, label: 'Home', icon: Home },
    { id: 'protocol' as PatientTab, label: 'Protocol', icon: FileText },
    { id: 'ai' as PatientTab, label: 'Ask AI', icon: MessageSquare },
    { id: 'learn' as PatientTab, label: 'Learn', icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
