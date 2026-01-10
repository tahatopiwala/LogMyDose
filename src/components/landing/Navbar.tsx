import React from 'react';
import { Pill } from 'lucide-react';
import { AppView } from '../../types';

interface NavbarProps {
  onNavigate: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-600">PepRX</span>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
              Features
            </a>
            <a href="#clinics" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
              For Clinics
            </a>
            <a href="#patients" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
              For Patients
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('clinic')}
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Clinic Login
            </button>
            <button
              onClick={() => onNavigate('patient')}
              className="px-4 py-2 text-sm font-medium text-white gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25"
            >
              Patient Portal
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
