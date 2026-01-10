import React, { useState } from 'react';
import {
  ArrowLeft,
  Scale,
  TrendingUp,
  FileText,
  Pill,
  Clock,
  MapPin,
  Sparkles,
  Download,
  Eye,
} from 'lucide-react';
import { Patient } from '../../types';
import { AIProtocolModal } from './AIProtocolModal';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack }) => {
  const [showAIModal, setShowAIModal] = useState(false);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusStyles = (status: Patient['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700';
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Paused':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200">
              {patient.avatar ? (
                <img
                  src={patient.avatar}
                  alt={`${patient.firstName} ${patient.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl text-slate-600 font-medium">
                  {patient.firstName[0]}
                  {patient.lastName[0]}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {patient.firstName} {patient.lastName}
              </h1>
              <p className="text-slate-500">
                {calculateAge(patient.dateOfBirth)} years old &bull; {patient.gender}
              </p>
            </div>
          </div>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusStyles(
            patient.status
          )}`}
        >
          {patient.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Vitals Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Vitals</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-slate-600">Weight</span>
                </div>
                <span className="text-lg font-semibold text-slate-900">{patient.weight} lbs</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-slate-600">Adherence</span>
                </div>
                <span className="text-lg font-semibold text-emerald-600">
                  {patient.adherenceRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Labs Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Recent Labs</h3>
            {patient.labs.length > 0 ? (
              <div className="space-y-3">
                {patient.labs.slice(0, 4).map((lab) => (
                  <div
                    key={lab.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{lab.name}</p>
                        <p className="text-xs text-slate-500">{formatDate(lab.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No lab results uploaded yet.</p>
            )}
          </div>
        </div>

        {/* Right Column (spans 2 columns) */}
        <div className="col-span-2 space-y-6">
          {/* AI Protocol Assistant Button */}
          <button
            onClick={() => setShowAIModal(true)}
            className="w-full p-5 gradient-primary rounded-xl text-white flex items-center justify-between group hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-lg">AI Protocol Assistant</p>
                <p className="text-blue-100 text-sm">Generate personalized protocol recommendations</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-white/20 rounded-lg font-medium text-sm group-hover:bg-white/30 transition-colors">
              Open Assistant
            </span>
          </button>

          {/* Active Protocols */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Active Protocols</h3>
            {patient.protocols.length > 0 ? (
              <div className="space-y-4">
                {patient.protocols.map((protocol) => (
                  <div key={protocol.id} className="border border-slate-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-900">{protocol.name}</h4>
                      <span className="text-xs text-slate-500">
                        {formatDate(protocol.startDate)} - {formatDate(protocol.endDate)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {protocol.peptides.map((peptide) => (
                        <div
                          key={peptide.id}
                          className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Pill className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{peptide.name}</p>
                            <p className="text-xs text-slate-500">
                              {peptide.dosage} &bull; {peptide.frequency}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No active protocols.</p>
            )}
          </div>

          {/* Injection Logs Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Recent Injection Logs</h3>
            {patient.logs.length > 0 ? (
              <div className="relative">
                <div className="absolute left-4 top-3 bottom-3 w-0.5 bg-slate-200" />
                <div className="space-y-4">
                  {patient.logs.slice(0, 5).map((log, index) => (
                    <div key={log.id} className="flex gap-4 relative">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          index === 0 ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      >
                        <Pill className={`w-4 h-4 ${index === 0 ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-slate-900">{log.peptideName}</p>
                          <span className="text-xs text-slate-500">
                            {formatDate(log.timestamp)} at {formatTime(log.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-slate-500">{log.dosage}</span>
                          <span className="flex items-center gap-1 text-sm text-slate-500">
                            <MapPin className="w-3 h-3" />
                            {log.site}
                          </span>
                        </div>
                        {log.notes && (
                          <p className="text-sm text-slate-600 mt-2 p-2 bg-slate-50 rounded-lg">
                            {log.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No injection logs recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* AI Protocol Modal */}
      {showAIModal && (
        <AIProtocolModal
          patientName={`${patient.firstName} ${patient.lastName}`}
          onClose={() => setShowAIModal(false)}
        />
      )}
    </div>
  );
};
