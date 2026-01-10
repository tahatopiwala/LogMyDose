import React, { useState } from 'react';
import { Pill, Syringe, Calculator, ChevronRight, X, Droplets } from 'lucide-react';
import { mockPeptides } from '../../data/mockData';

export const ProtocolTab: React.FC = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcPeptide, setCalcPeptide] = useState(mockPeptides[0]);

  return (
    <div className="pb-24 px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Your Protocol</h1>
        <p className="text-slate-500">Active medications and dosing</p>
      </div>

      {/* Reconstitution Calculator Banner */}
      <button
        onClick={() => setShowCalculator(true)}
        className="w-full mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 flex items-center justify-between group hover:border-indigo-200 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-slate-900">Reconstitution Calculator</p>
            <p className="text-sm text-slate-500">Calculate your exact dosage</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
      </button>

      {/* Medications List */}
      <div className="space-y-4">
        {mockPeptides.slice(0, 3).map((peptide) => (
          <div
            key={peptide.id}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Pill className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{peptide.name}</h3>
                  <p className="text-sm text-slate-500">
                    {peptide.dosage} &bull; {peptide.frequency}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                {peptide.remainingDoses} doses left
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <Syringe className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Route</p>
                  <p className="text-sm text-slate-500">{peptide.route}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm font-medium text-slate-700 mb-1">Instructions</p>
                <p className="text-sm text-slate-500">{peptide.instructions}</p>
              </div>

              {peptide.reconstitutionInfo && (
                <button
                  onClick={() => {
                    setCalcPeptide(peptide);
                    setShowCalculator(true);
                  }}
                  className="w-full p-3 bg-blue-50 rounded-xl flex items-center justify-between text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    <span className="text-sm font-medium">View reconstitution info</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reconstitution Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Reconstitution Calculator</h2>
              <button
                onClick={() => setShowCalculator(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{calcPeptide.name}</p>
                    <p className="text-sm text-slate-500">{calcPeptide.dosage} per dose</p>
                  </div>
                </div>
              </div>

              {calcPeptide.reconstitutionInfo && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-4 h-4 text-blue-600" />
                        <p className="text-sm font-medium text-slate-700">BAC Water</p>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">
                        {calcPeptide.reconstitutionInfo.bacteriostaticWater}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Syringe className="w-4 h-4 text-indigo-600" />
                        <p className="text-sm font-medium text-slate-700">Concentration</p>
                      </div>
                      <p className="text-lg font-bold text-slate-900">
                        {calcPeptide.reconstitutionInfo.concentration}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-sm font-medium text-emerald-800 mb-1">Your Dose</p>
                    <p className="text-lg font-bold text-emerald-700">
                      Draw 0.2ml for {calcPeptide.dosage}
                    </p>
                  </div>
                </>
              )}

              <button
                onClick={() => setShowCalculator(false)}
                className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
