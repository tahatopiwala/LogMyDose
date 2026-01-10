export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  avatar?: string;
  status: 'Active' | 'Pending' | 'Paused';
  lastCheckIn: string;
  activeProtocolCount: number;
  weight: number;
  adherenceRate: number;
  protocols: Protocol[];
  logs: LogEntry[];
  labs: LabResult[];
}

export interface Peptide {
  id: string;
  name: string;
  description: string;
  dosage: string;
  frequency: string;
  route: 'Subcutaneous' | 'Intramuscular' | 'Oral';
  instructions: string;
  remainingDoses: number;
  totalDoses: number;
  reconstitutionInfo?: {
    bacteriostaticWater: string;
    concentration: string;
  };
}

export interface Protocol {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  peptides: Peptide[];
  notes?: string;
}

export interface LogEntry {
  id: string;
  peptideId: string;
  peptideName: string;
  timestamp: string;
  dosage: string;
  site: 'Left Abdomen' | 'Right Abdomen' | 'Left Thigh' | 'Right Thigh' | 'Deltoid';
  notes?: string;
}

export interface LabResult {
  id: string;
  name: string;
  date: string;
  fileType: 'PDF' | 'Image';
  fileUrl: string;
  status: 'Reviewed' | 'Pending Review';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface WeightEntry {
  day: string;
  weight: number;
}

export type AppView = 'landing' | 'patient' | 'clinic';
export type PatientTab = 'home' | 'protocol' | 'ai' | 'learn';
export type ClinicView = 'list' | 'detail';
