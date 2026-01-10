import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Syringe, Check, TrendingDown, Calendar } from 'lucide-react';
import { currentPatient, mockWeightData, mockPeptides } from '../../data/mockData';

export const HomeTab: React.FC = () => {
  const [logged, setLogged] = useState(false);
  const nextPeptide = mockPeptides[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const handleLogInjection = () => {
    setLogged(true);
    setTimeout(() => setLogged(false), 3000);
  };

  return (
    <div className="pb-24 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-slate-500 text-sm">{greeting}</p>
          <h1 className="text-2xl font-bold text-slate-900">
            {currentPatient.firstName}
          </h1>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100">
          <img
            src={currentPatient.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Next Dose Card */}
      <div className="gradient-primary rounded-2xl p-6 text-white mb-6 shadow-xl shadow-blue-500/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm mb-1">Next Dose</p>
            <h2 className="text-2xl font-bold">{nextPeptide.name}</h2>
            <p className="text-blue-100 mt-1">{nextPeptide.dosage} &bull; {nextPeptide.frequency}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Syringe className="w-6 h-6 text-white" />
          </div>
        </div>
        <button
          onClick={handleLogInjection}
          disabled={logged}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            logged
              ? 'bg-emerald-500 text-white'
              : 'bg-white text-blue-600 hover:bg-blue-50'
          }`}
        >
          {logged ? (
            <>
              <Check className="w-5 h-5" />
              Logged Successfully!
            </>
          ) : (
            <>
              <Syringe className="w-5 h-5" />
              Log Injection Now
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{currentPatient.adherenceRate}%</p>
          <p className="text-sm text-slate-500 mt-1">Adherence Rate</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">14</p>
          <p className="text-sm text-slate-500 mt-1">Days Left</p>
        </div>
      </div>

      {/* Weight Progress Chart */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900">Weight Progress</h3>
            <p className="text-sm text-slate-500">This week</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-emerald-600">-3 lbs</p>
            <p className="text-xs text-slate-500">vs last week</p>
          </div>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockWeightData} barCategoryGap="20%">
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
              <Bar dataKey="weight" radius={[6, 6, 0, 0]}>
                {mockWeightData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === mockWeightData.length - 1 ? '#2563eb' : '#e2e8f0'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
