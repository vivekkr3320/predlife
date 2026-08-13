export interface AssessmentInputs {
  age?: string | null;
  nicotine_exposure?: string | null;
  physical_activity?: string | null;
  diet_quality?: string | null;
  sleep_duration?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  systolic_bp?: number | null;
  diastolic_bp?: number | null;
  bp_status?: string | null;
  lipids_status?: string | null;
  glucose_status?: string | null;
  alcohol_exposure?: string | null;
}

export interface FactorItem {
  variable: string;
  name: string;
  score: number; // 0-100
  statusText: string;
  impactText: string;
  evidenceSource: string;
}

export interface PlanWeek {
  week: number;
  title: string;
  goals: string[];
}

export interface ScoringResult {
  score: number; // 0 to 100
  riskBand: 'Lower' | 'Moderate' | 'Higher';
  estimatedRange: {
    minAge: number;
    maxAge: number;
  };
  strengths: FactorItem[];
  priorityFactors: FactorItem[];
  missingData: string[];
  plan: PlanWeek[];
  methodologyVersion: string;
}

export function calculateLongevityProfile(input: AssessmentInputs): ScoringResult {
  const METHODOLOGY_VERSION = "PL-1.0";
  const factors: Record<string, FactorItem> = {};
  const missingData: string[] = [];
  const evaluatedScores: number[] = [];

  // 1. Nicotine exposure
  let nicotineScore = 100;
  let nicotineStatus = "Non-user / Zero exposure";
  if (input.nicotine_exposure === 'never') {
    nicotineScore = 100;
    nicotineStatus = "Zero tobacco or nicotine use";
  } else if (input.nicotine_exposure === 'former_5plus') {
    nicotineScore = 85;
    nicotineStatus = "Quit tobacco > 5 years ago";
  } else if (input.nicotine_exposure === 'former_under5') {
    nicotineScore = 65;
    nicotineStatus = "Quit tobacco < 5 years ago";
  } else if (input.nicotine_exposure === 'occasionally') {
    nicotineScore = 45;
    nicotineStatus = "Occasional user";
  } else if (input.nicotine_exposure === 'regularly') {
    nicotineScore = 25;
    nicotineStatus = "Regular user";
  } else if (input.nicotine_exposure === 'daily') {
    nicotineScore = 10;
    nicotineStatus = "Daily nicotine user";
  } else {
    missingData.push("Nicotine Exposure");
  }
  factors.nicotine = {
    variable: 'nicotine_exposure',
    name: 'Nicotine Exposure',
    score: nicotineScore,
    statusText: nicotineStatus,
    impactText: nicotineScore > 75 ? 'Zero/former nicotine status strongly supports vascular integrity.' : 'Nicotine exposure is one of the highest modifiable longevity factors.',
    evidenceSource: "American Heart Association — Life's Essential 8"
  };
  evaluatedScores.push(nicotineScore);

  // 2. Physical Activity
  let actScore = 70;
  let actStatus = "Moderate activity";
  if (input.physical_activity === '150_plus') {
    actScore = 100;
    actStatus = "150+ mins/week moderate exercise";
  } else if (input.physical_activity === '75_149') {
    actScore = 80;
    actStatus = "75–149 mins/week exercise";
  } else if (input.physical_activity === '30_74') {
    actScore = 55;
    actStatus = "30–74 mins/week exercise";
  } else if (input.physical_activity === 'under_30') {
    actScore = 30;
    actStatus = "Less than 30 mins/week";
  } else if (input.physical_activity === 'almost_none') {
    actScore = 15;
    actStatus = "Sedentary / Almost no exercise";
  } else {
    missingData.push("Physical Activity");
  }
  factors.activity = {
    variable: 'physical_activity',
    name: 'Physical Activity',
    score: actScore,
    statusText: actStatus,
    impactText: actScore >= 80 ? 'Meeting AHA weekly aerobic targets preserves metabolic & cardiac fitness.' : 'Increasing weekly activity presents a high-yield opportunity for health span.',
    evidenceSource: 'WHO & AHA Physical Activity Guidelines'
  };
  evaluatedScores.push(actScore);

  // 3. Diet Quality
  let dietScore = 65;
  let dietStatus = "Mixed diet pattern";
  if (input.diet_quality === 'mostly_whole') {
    dietScore = 100;
    dietStatus = "Mostly whole & plant-rich foods";
  } else if (input.diet_quality === 'generally_healthy') {
    dietScore = 85;
    dietStatus = "Generally healthy with occasional processed foods";
  } else if (input.diet_quality === 'mixed') {
    dietScore = 65;
    dietStatus = "Mixed pattern";
  } else if (input.diet_quality === 'frequent_processed') {
    dietScore = 35;
    dietStatus = "Frequent processed & sugary foods";
  } else if (input.diet_quality === 'mostly_processed') {
    dietScore = 15;
    dietStatus = "High ultra-processed diet";
  } else {
    missingData.push("Dietary Pattern");
  }
  factors.diet = {
    variable: 'diet_quality',
    name: 'Dietary Quality',
    score: dietScore,
    statusText: dietStatus,
    impactText: dietScore >= 80 ? 'Nutrient-dense eating lowers chronic systemic inflammatory markers.' : 'Transitioning toward whole foods supports long-term metabolic stability.',
    evidenceSource: "AHA Life's Essential 8 Diet Construct"
  };
  evaluatedScores.push(dietScore);

  // 4. Sleep Duration
  let sleepScore = 70;
  let sleepStatus = "Standard sleep";
  if (input.sleep_duration === '7_9') {
    sleepScore = 100;
    sleepStatus = "7–9 hours/night (Optimal)";
  } else if (input.sleep_duration === '6_7') {
    sleepScore = 80;
    sleepStatus = "6–7 hours/night";
  } else if (input.sleep_duration === '5_6') {
    sleepScore = 50;
    sleepStatus = "5–6 hours/night";
  } else if (input.sleep_duration === 'under_5') {
    sleepScore = 20;
    sleepStatus = "< 5 hours/night (Short sleep)";
  } else if (input.sleep_duration === 'over_9') {
    sleepScore = 65;
    sleepStatus = "> 9 hours/night";
  } else {
    missingData.push("Sleep Duration");
  }
  factors.sleep = {
    variable: 'sleep_duration',
    name: 'Sleep Duration',
    score: sleepScore,
    statusText: sleepStatus,
    impactText: sleepScore >= 80 ? 'Optimal sleep supports immune, cellular & cognitive longevity.' : 'Addressing short or inconsistent sleep restores nocturnal blood pressure dipping.',
    evidenceSource: "AHA Life's Essential 8 Sleep Measures"
  };
  evaluatedScores.push(sleepScore);

  // 5. BMI calculation (Graceful handling of missing height/weight)
  let bmiScore: number | null = null;
  let bmiStatus = "Unknown / Not reported";
  if (input.height_cm && input.weight_kg && input.height_cm > 0 && input.weight_kg > 0) {
    const heightM = input.height_cm / 100;
    const calculatedBmi = Number((input.weight_kg / (heightM * heightM)).toFixed(1));
    if (calculatedBmi >= 18.5 && calculatedBmi <= 24.9) {
      bmiScore = 100;
      bmiStatus = `BMI ${calculatedBmi} kg/m² (Normal range)`;
    } else if (calculatedBmi >= 25.0 && calculatedBmi <= 29.9) {
      bmiScore = 75;
      bmiStatus = `BMI ${calculatedBmi} kg/m² (Overweight)`;
    } else if (calculatedBmi >= 30.0) {
      bmiScore = 45;
      bmiStatus = `BMI ${calculatedBmi} kg/m² (Elevated)`;
    } else {
      bmiScore = 60;
      bmiStatus = `BMI ${calculatedBmi} kg/m² (Underweight)`;
    }
    factors.bmi = {
      variable: 'bmi',
      name: 'Body Mass Index (BMI)',
      score: bmiScore,
      statusText: bmiStatus,
      impactText: bmiScore >= 80 ? 'Healthy BMI reduces metabolic burden on joints and heart.' : 'Optimizing body composition supports long-term glucose and lipid regulation.',
      evidenceSource: 'WHO & AHA Body Weight Guidelines'
    };
    evaluatedScores.push(bmiScore);
  } else {
    missingData.push("Height & Weight (BMI)");
  }

  // 6. Blood Pressure (Graceful handling if unknown)
  let bpScore: number | null = null;
  let bpStatus = "Unknown / Not reported";
  if (input.systolic_bp && input.diastolic_bp) {
    const sbp = input.systolic_bp;
    const dbp = input.diastolic_bp;
    if (sbp < 120 && dbp < 80) {
      bpScore = 100;
      bpStatus = `${sbp}/${dbp} mmHg (Optimal)`;
    } else if (sbp <= 129 && dbp < 80) {
      bpScore = 80;
      bpStatus = `${sbp}/${dbp} mmHg (Elevated)`;
    } else if (sbp <= 139 || dbp <= 89) {
      bpScore = 55;
      bpStatus = `${sbp}/${dbp} mmHg (Stage 1 Hypertension range)`;
    } else {
      bpScore = 30;
      bpStatus = `${sbp}/${dbp} mmHg (Stage 2 Hypertension range)`;
    }
    factors.blood_pressure = {
      variable: 'blood_pressure',
      name: 'Blood Pressure',
      score: bpScore,
      statusText: bpStatus,
      impactText: bpScore >= 80 ? 'Normal blood pressure protects cerebral and coronary vasculature.' : 'Regular blood pressure monitoring is key to preventing vascular strain.',
      evidenceSource: 'AHA/ACC Hypertension Guidelines'
    };
    evaluatedScores.push(bpScore);
  } else {
    missingData.push("Blood Pressure Measurement");
  }

  // 7. Lipids / Cholesterol
  let lipidScore: number | null = null;
  if (input.lipids_status === 'optimal') {
    lipidScore = 100;
  } else if (input.lipids_status === 'borderline') {
    lipidScore = 65;
  } else if (input.lipids_status === 'high') {
    lipidScore = 35;
  } else {
    missingData.push("Recent Lipid Panel");
  }

  if (lipidScore !== null) {
    factors.lipids = {
      variable: 'lipids',
      name: 'Blood Lipids',
      score: lipidScore,
      statusText: input.lipids_status === 'optimal' ? 'Normal lipid profile' : input.lipids_status === 'borderline' ? 'Borderline elevated' : 'High cholesterol',
      impactText: lipidScore >= 80 ? 'Optimal cholesterol prevents arterial plaque accumulation.' : 'Knowing your lipid numbers enables proactive cardiovascular defense.',
      evidenceSource: "AHA Essential 8 Lipid Guidelines"
    };
    evaluatedScores.push(lipidScore);
  }

  // 8. Blood Glucose
  let glucoseScore: number | null = null;
  if (input.glucose_status === 'normal') {
    glucoseScore = 100;
  } else if (input.glucose_status === 'borderline') {
    glucoseScore = 60;
  } else if (input.glucose_status === 'high') {
    glucoseScore = 30;
  } else {
    missingData.push("Blood Sugar / HbA1c");
  }

  if (glucoseScore !== null) {
    factors.glucose = {
      variable: 'glucose',
      name: 'Blood Glucose',
      score: glucoseScore,
      statusText: input.glucose_status === 'normal' ? 'Normal glucose / HbA1c' : input.glucose_status === 'borderline' ? 'Borderline range' : 'Elevated glucose',
      impactText: glucoseScore >= 80 ? 'Stable blood sugar preserves microvascular and organ health.' : 'Screening glycemic levels protects against insulin resistance.',
      evidenceSource: 'American Diabetes Association Guidelines'
    };
    evaluatedScores.push(glucoseScore);
  }

  // 9. Alcohol Consumption
  let alcoholScore = 80;
  let alcoholStatus = "Moderate / Occasional";
  if (input.alcohol_exposure === 'never') {
    alcoholScore = 100;
    alcoholStatus = "Non-drinker";
  } else if (input.alcohol_exposure === 'less_monthly') {
    alcoholScore = 95;
    alcoholStatus = "< Once a month";
  } else if (input.alcohol_exposure === '1_3_monthly') {
    alcoholScore = 85;
    alcoholStatus = "1–3 times a month";
  } else if (input.alcohol_exposure === '1_3_weekly') {
    alcoholScore = 65;
    alcoholStatus = "1–3 times a week";
  } else if (input.alcohol_exposure === '4_plus_weekly') {
    alcoholScore = 40;
    alcoholStatus = "4+ times a week";
  } else if (input.alcohol_exposure === 'daily') {
    alcoholScore = 20;
    alcoholStatus = "Daily alcohol intake";
  } else {
    missingData.push("Alcohol Frequency");
  }
  factors.alcohol = {
    variable: 'alcohol_exposure',
    name: 'Alcohol Exposure',
    score: alcoholScore,
    statusText: alcoholStatus,
    impactText: alcoholScore >= 85 ? 'Low/zero alcohol minimizes cellular oxidative stress.' : 'Reducing alcohol frequency lowers BP volatility and liver burden.',
    evidenceSource: 'WHO Global Alcohol & Health Framework'
  };
  evaluatedScores.push(alcoholScore);

  // Calculate Overall Score averaging ONLY evaluated items (never penalize for missing labs)
  const totalScore = Math.round(
    evaluatedScores.reduce((sum, s) => sum + s, 0) / evaluatedScores.length
  );

  // Risk Band: 'Lower' | 'Moderate' | 'Higher'
  let riskBand: 'Lower' | 'Moderate' | 'Higher' = 'Moderate';
  if (totalScore >= 80) riskBand = 'Lower';
  else if (totalScore < 60) riskBand = 'Higher';

  // Calculate Estimated Longevity Range
  let minAge = 74;
  let maxAge = 84;
  if (totalScore >= 85) {
    minAge = 82;
    maxAge = 91;
  } else if (totalScore >= 75) {
    minAge = 78;
    maxAge = 86;
  } else if (totalScore >= 60) {
    minAge = 74;
    maxAge = 82;
  } else if (totalScore >= 45) {
    minAge = 69;
    maxAge = 77;
  } else {
    minAge = 64;
    maxAge = 73;
  }

  // Adjust for Age baseline group
  if (input.age === '60_69') {
    minAge += 2;
    maxAge += 2;
  } else if (input.age === '70_plus') {
    minAge += 4;
    maxAge += 4;
  }

  // Sort Strengths (highest scores) & Priorities (lowest scores)
  const allFactorValues = Object.values(factors);
  const sortedFactors = [...allFactorValues].sort((a, b) => b.score - a.score);
  const strengths = sortedFactors.slice(0, 3);
  const priorityFactors = [...allFactorValues].sort((a, b) => a.score - b.score).slice(0, 3);

  // Generate 30-Day Actionable Plan
  const plan: PlanWeek[] = [
    {
      week: 1,
      title: 'Foundation & Baseline Awareness',
      goals: [
        `Establish a regular sleep schedule aiming for 7–9 hours per night (${factors.sleep.name}).`,
        'Schedule a routine blood pressure check with a digital monitor or pharmacist.',
        'Track daily baseline step count using a smartphone or pedometer.'
      ]
    },
    {
      week: 2,
      title: 'Physical Activity & Movement Building',
      goals: [
        'Aim for 20–30 minutes of moderate-intensity brisk walking 5 days this week.',
        'Replace 1 ultra-processed snack daily with fresh fruit, nuts, or seeds.',
        'Maintain zero nicotine or avoid environment with passive tobacco smoke.'
      ]
    },
    {
      week: 3,
      title: 'Nutritional Pattern Enhancement',
      goals: [
        'Incorporate 2 extra servings of vegetables or legumes into lunch and dinner.',
        'If alcohol is consumed, limit intake to no more than 1 standard drink on non-consecutive days.',
        'Practice 5 minutes of nocturnal deep breathing prior to bedtime.'
      ]
    },
    {
      week: 4,
      title: 'Habit Consolidation & Biomarker Tracking',
      goals: [
        'Consolidate 150 minutes total of weekly physical movement.',
        'Schedule your annual lipid panel and fasting glucose blood checkup with your primary physician.',
        'Re-assess your habit consistency and celebrate key lifestyle wins.'
      ]
    }
  ];

  return {
    score: totalScore,
    riskBand,
    estimatedRange: { minAge, maxAge },
    strengths,
    priorityFactors,
    missingData,
    plan,
    methodologyVersion: METHODOLOGY_VERSION
  };
}
