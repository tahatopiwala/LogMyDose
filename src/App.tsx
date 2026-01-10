import React, { useState } from 'react';
import { AppView } from './types';
import { LandingPage } from './components/landing/LandingPage';
import { PatientApp } from './components/patient/PatientApp';
import { ClinicDashboard } from './components/clinic/ClinicDashboard';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
  };

  const handleBack = () => {
    setCurrentView('landing');
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'patient':
        return <PatientApp onBack={handleBack} />;
      case 'clinic':
        return <ClinicDashboard onBack={handleBack} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return <>{renderView()}</>;
}

export default App;
