import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PatientTab, AppView } from '../../types';
import { BottomNav } from './BottomNav';
import { HomeTab } from './HomeTab';
import { ProtocolTab } from './ProtocolTab';
import { AIChatTab } from './AIChatTab';
import { LearnTab } from './LearnTab';

interface PatientAppProps {
  onBack: () => void;
}

export const PatientApp: React.FC<PatientAppProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<PatientTab>('home');

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'protocol':
        return <ProtocolTab />;
      case 'ai':
        return <AIChatTab />;
      case 'learn':
        return <LearnTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      {/* Mobile Phone Frame */}
      <div className="w-full max-w-md mx-auto">
        {/* Phone outer frame */}
        <div className="bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
          {/* Phone inner frame */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-40" />

            {/* Screen Content */}
            <div className="h-[700px] overflow-y-auto hide-scrollbar bg-slate-50 pt-8 relative">
              {renderTab()}
              <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
