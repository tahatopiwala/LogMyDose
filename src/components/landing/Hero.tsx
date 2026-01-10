import React from 'react';
import { Play, ArrowRight, Shield, Clock, Users } from 'lucide-react';
import { AppView } from '../../types';

interface HeroProps {
  onNavigate: (view: AppView) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-blue-700">Trusted by 500+ Clinics Nationwide</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6">
            The Operating System for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Peptide Therapy
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Automate multi-peptide protocols, scheduling, and patient adherence.
            Deliver exceptional care while reducing administrative burden.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => onNavigate('patient')}
              className="group w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white gradient-primary rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Demo Patient App
            </button>
            <button
              onClick={() => onNavigate('clinic')}
              className="group w-full sm:w-auto px-8 py-4 text-lg font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              Demo Clinic Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-slate-900">99.9%</p>
                <p className="text-sm text-slate-500">Uptime SLA</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-slate-900">40%</p>
                <p className="text-sm text-slate-500">Time Saved</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-slate-900">50K+</p>
                <p className="text-sm text-slate-500">Active Patients</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
