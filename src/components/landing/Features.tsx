import React from 'react';
import { Smartphone, RefreshCw, ShieldCheck, BarChart3, Bell, Brain } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: Smartphone,
      title: 'Smart Patient App',
      description: 'Intuitive mobile experience for patients to track doses, log injections, and stay on protocol with smart reminders.',
      color: 'blue',
    },
    {
      icon: RefreshCw,
      title: 'Automated Protocols',
      description: 'Create, manage, and automate multi-peptide protocols with intelligent scheduling and dosage calculations.',
      color: 'indigo',
    },
    {
      icon: ShieldCheck,
      title: 'Compliance & Safety',
      description: 'Real-time adherence monitoring with automated alerts for missed doses and safety checkpoints.',
      color: 'emerald',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards with patient outcomes, adherence rates, and protocol effectiveness metrics.',
      color: 'blue',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Customizable reminder systems for patients and automated check-in prompts for clinical staff.',
      color: 'amber',
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Leverage AI to generate protocol recommendations and answer patient questions safely.',
      color: 'indigo',
    },
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
      hover: 'group-hover:bg-blue-600',
    },
    indigo: {
      bg: 'bg-indigo-100',
      icon: 'text-indigo-600',
      hover: 'group-hover:bg-indigo-600',
    },
    emerald: {
      bg: 'bg-emerald-100',
      icon: 'text-emerald-600',
      hover: 'group-hover:bg-emerald-600',
    },
    amber: {
      bg: 'bg-amber-100',
      icon: 'text-amber-600',
      hover: 'group-hover:bg-amber-600',
    },
  };

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Everything You Need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Scale Your Practice
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A complete platform designed specifically for peptide therapy clinics and their patients.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.hover} flex items-center justify-center mb-6 transition-colors duration-300`}
                >
                  <Icon className={`w-7 h-7 ${colors.icon} group-hover:text-white transition-colors duration-300`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
