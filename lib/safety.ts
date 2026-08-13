export const PROHIBITED_PHRASES = [
  "you will die at",
  "guaranteed lifespan",
  "exact date of death",
  "add 10 years to your life",
  "cure your disease",
  "stop taking your medication",
  "you have heart disease",
  "you will have a stroke",
  "you don't need a doctor"
];

export interface ClinicalSafetyAlert {
  variable: string;
  level: 'warning' | 'caution';
  title: string;
  message: string;
}

export function sanitizeReportText(text: string): string {
  let cleanText = text;
  for (const phrase of PROHIBITED_PHRASES) {
    const regex = new RegExp(phrase, 'gi');
    cleanText = cleanText.replace(regex, '[rephrased for evidence compliance]');
  }
  return cleanText;
}

export function checkClinicalRedFlags(input: {
  systolic_bp?: number | null;
  diastolic_bp?: number | null;
  glucose_status?: string | null;
}): ClinicalSafetyAlert[] {
  const alerts: ClinicalSafetyAlert[] = [];

  if (input.systolic_bp || input.diastolic_bp) {
    const sbp = input.systolic_bp || 0;
    const dbp = input.diastolic_bp || 0;
    if (sbp >= 140 || dbp >= 90) {
      alerts.push({
        variable: 'blood_pressure',
        level: sbp >= 160 || dbp >= 100 ? 'warning' : 'caution',
        title: 'Blood Pressure Review Recommended',
        message: 'Your entered blood pressure value is in an elevated range. PredLife cannot diagnose hypertension or medical conditions. Consider discussing this result with a qualified healthcare professional.'
      });
    }
  }

  if (input.glucose_status === 'elevated' || input.glucose_status === 'high') {
    alerts.push({
      variable: 'blood_glucose',
      level: 'caution',
      title: 'Blood Sugar Review Recommended',
      message: 'Your entered blood sugar response indicates a value worth discussing with a doctor or qualified health specialist for a comprehensive clinical evaluation.'
    });
  }

  return alerts;
}
