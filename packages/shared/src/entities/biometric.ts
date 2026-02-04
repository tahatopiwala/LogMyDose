// Biometric metric types
export type MetricType =
  | "weight"
  | "blood_glucose"
  | "blood_pressure_systolic"
  | "blood_pressure_diastolic"
  | "heart_rate"
  | "body_fat_percentage"
  | "sleep_quality"
  | "energy_level"
  | "appetite_level"
  | "pain_level"
  | "mood"
  | "stress_level"
  | "hydration"
  | "steps"
  | "calories_burned";

// Common units for each metric type
export const METRIC_UNITS: Record<MetricType, string[]> = {
  weight: ["kg", "lbs"],
  blood_glucose: ["mg/dL", "mmol/L"],
  blood_pressure_systolic: ["mmHg"],
  blood_pressure_diastolic: ["mmHg"],
  heart_rate: ["bpm"],
  body_fat_percentage: ["%"],
  sleep_quality: ["1-10"],
  energy_level: ["1-10"],
  appetite_level: ["1-10"],
  pain_level: ["1-10"],
  stress_level: ["1-10"],
  mood: ["1-10"],
  hydration: ["oz", "ml", "L"],
  steps: ["steps"],
  calories_burned: ["kcal"],
};

// Default units for each metric type
export const DEFAULT_UNITS: Record<MetricType, string> = {
  weight: "lbs",
  blood_glucose: "mg/dL",
  blood_pressure_systolic: "mmHg",
  blood_pressure_diastolic: "mmHg",
  heart_rate: "bpm",
  body_fat_percentage: "%",
  sleep_quality: "1-10",
  energy_level: "1-10",
  appetite_level: "1-10",
  pain_level: "1-10",
  stress_level: "1-10",
  mood: "1-10",
  hydration: "oz",
  steps: "steps",
  calories_burned: "kcal",
};

// Metric display names
export const METRIC_DISPLAY_NAMES: Record<MetricType, string> = {
  weight: "Weight",
  blood_glucose: "Blood Glucose",
  blood_pressure_systolic: "Blood Pressure (Systolic)",
  blood_pressure_diastolic: "Blood Pressure (Diastolic)",
  heart_rate: "Heart Rate",
  body_fat_percentage: "Body Fat %",
  sleep_quality: "Sleep Quality",
  energy_level: "Energy Level",
  appetite_level: "Appetite Level",
  pain_level: "Pain Level",
  stress_level: "Stress Level",
  mood: "Mood",
  hydration: "Hydration",
  steps: "Steps",
  calories_burned: "Calories Burned",
};

// Metric categories for grouping
export type MetricCategory = "body" | "vitals" | "wellness" | "activity";

export const METRIC_CATEGORIES: Record<MetricType, MetricCategory> = {
  weight: "body",
  body_fat_percentage: "body",
  blood_glucose: "vitals",
  blood_pressure_systolic: "vitals",
  blood_pressure_diastolic: "vitals",
  heart_rate: "vitals",
  sleep_quality: "wellness",
  energy_level: "wellness",
  appetite_level: "wellness",
  pain_level: "wellness",
  stress_level: "wellness",
  mood: "wellness",
  hydration: "activity",
  steps: "activity",
  calories_burned: "activity",
};

// Biometric entry interface
export interface BiometricEntry {
  id: string;
  patientId: string;
  doseId: string | null;
  metricType: MetricType;
  value: number | string;
  unit: string | null;
  notes: string | null;
  recordedAt: string;
  createdAt: string;
}

// Biometric entry with related data
export interface BiometricEntryWithDose extends BiometricEntry {
  dose?: {
    id: string;
    dose: number | string;
    loggedAt: string;
    substance: {
      id: string;
      name: string;
    };
  } | null;
}

// Input types
export interface CreateBiometricEntryInput {
  metricType: MetricType;
  value: number;
  unit?: string;
  doseId?: string;
  notes?: string;
  recordedAt?: string;
}

export interface BatchCreateBiometricInput {
  entries: CreateBiometricEntryInput[];
}

// Stats types
export interface BiometricStats {
  metricType: MetricType;
  count: number;
  min: number;
  max: number;
  avg: number;
  latest: number;
  latestRecordedAt: string;
  trend: "up" | "down" | "stable";
  percentChange: number;
}

export interface BiometricTrend {
  date: string;
  value: number;
}
