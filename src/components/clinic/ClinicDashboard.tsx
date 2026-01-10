import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Patient, ClinicView } from '../../types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PatientList } from './PatientList';
import { PatientDetail } from './PatientDetail';

interface ClinicDashboardProps {
  onBack: () => void;
}

type SidebarItem = 'dashboard' | 'patients' | 'inbox' | 'labs' | 'settings';

export const ClinicDashboard: React.FC<ClinicDashboardProps> = ({ onBack }) => {
  const [activeItem, setActiveItem] = useState<SidebarItem>('patients');
  const [clinicView, setClinicView] = useState<ClinicView>('list');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setClinicView('detail');
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
    setClinicView('list');
  };

  const getBreadcrumbs = () => {
    const base = ['Patients'];
    if (clinicView === 'detail' && selectedPatient) {
      base.push(`${selectedPatient.firstName} ${selectedPatient.lastName}`);
    }
    return base;
  };

  const renderContent = () => {
    if (activeItem === 'patients') {
      if (clinicView === 'detail' && selectedPatient) {
        return <PatientDetail patient={selectedPatient} onBack={handleBackToList} />;
      }
      return <PatientList onSelectPatient={handleSelectPatient} />;
    }

    // Placeholder for other sections
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 capitalize">{activeItem}</h2>
          <p className="text-slate-500">This section is coming soon.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Back button - floating */}
      <button
        onClick={onBack}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      {/* Sidebar */}
      <Sidebar activeItem={activeItem} onItemChange={setActiveItem} />

      {/* Main Content Area */}
      <div className="ml-64 min-h-screen">
        <Header
          breadcrumbs={getBreadcrumbs()}
          onBack={clinicView === 'detail' ? handleBackToList : undefined}
        />
        <main className="min-h-[calc(100vh-4rem)]">{renderContent()}</main>
      </div>
    </div>
  );
};
