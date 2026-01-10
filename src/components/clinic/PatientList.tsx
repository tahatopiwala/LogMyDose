import React from 'react';
import { MoreHorizontal, Users, UserCheck, UserX, Clock } from 'lucide-react';
import { Patient } from '../../types';
import { mockPatients } from '../../data/mockData';

interface PatientListProps {
  onSelectPatient: (patient: Patient) => void;
}

export const PatientList: React.FC<PatientListProps> = ({ onSelectPatient }) => {
  const stats = {
    total: mockPatients.length,
    active: mockPatients.filter((p) => p.status === 'Active').length,
    pending: mockPatients.filter((p) => p.status === 'Pending').length,
    paused: mockPatients.filter((p) => p.status === 'Paused').length,
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total Patients</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
              <p className="text-sm text-slate-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
              <p className="text-sm text-slate-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <UserX className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.paused}</p>
              <p className="text-sm text-slate-500">Paused</p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Patient Directory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-5 text-sm font-medium text-slate-500">
                  Patient
                </th>
                <th className="text-left py-3 px-5 text-sm font-medium text-slate-500">
                  Status
                </th>
                <th className="text-left py-3 px-5 text-sm font-medium text-slate-500">
                  Last Check-in
                </th>
                <th className="text-left py-3 px-5 text-sm font-medium text-slate-500">
                  Active Protocols
                </th>
                <th className="text-left py-3 px-5 text-sm font-medium text-slate-500">
                  Adherence
                </th>
                <th className="text-right py-3 px-5 text-sm font-medium text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockPatients.map((patient) => (
                <tr
                  key={patient.id}
                  onClick={() => onSelectPatient(patient)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                        {patient.avatar ? (
                          <img
                            src={patient.avatar}
                            alt={`${patient.firstName} ${patient.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600 font-medium">
                            {patient.firstName[0]}
                            {patient.lastName[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-slate-500">{patient.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(
                        patient.status
                      )}`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-sm text-slate-600">
                    {formatDate(patient.lastCheckIn)}
                  </td>
                  <td className="py-4 px-5 text-sm text-slate-600">
                    {patient.activeProtocolCount}
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            patient.adherenceRate >= 90
                              ? 'bg-emerald-500'
                              : patient.adherenceRate >= 70
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${patient.adherenceRate}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600">{patient.adherenceRate}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Menu action placeholder
                      }}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
