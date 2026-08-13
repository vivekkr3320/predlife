export interface EvidenceItem {
  variable: string;
  name: string;
  sourceName: string;
  sourceUrl: string;
  citationDate: string;
  evidenceSummary: string;
  recommendationTarget: string;
}

export const EVIDENCE_REGISTRY: Record<string, EvidenceItem> = {
  age: {
    variable: 'age',
    name: 'Current Age',
    sourceName: 'WHO & Global Burden of Disease',
    sourceUrl: 'https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates',
    citationDate: '2023',
    evidenceSummary: 'Age is a fundamental baseline demographic variable in epidemiological life table models and mortality projections.',
    recommendationTarget: 'Baseline demographic entry.'
  },
  nicotine_exposure: {
    variable: 'nicotine_exposure',
    name: 'Nicotine & Tobacco Exposure',
    sourceName: 'American Heart Association — Life’s Essential 8',
    sourceUrl: 'https://www.heart.org/en/healthy-living/healthy-lifestyle/lifes-essential-8',
    citationDate: '2022',
    evidenceSummary: 'Nicotine exposure is one of the strongest modifiable risk factors for cardiovascular disease and premature mortality. Quitting smoking yields substantial longevity gains.',
    recommendationTarget: 'Zero nicotine or tobacco exposure (including chewing tobacco & vaping).'
  },
  physical_activity: {
    variable: 'physical_activity',
    name: 'Physical Activity',
    sourceName: 'American Heart Association & WHO Physical Activity Guidelines',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity',
    citationDate: '2020',
    evidenceSummary: 'Adults obtaining 150+ minutes of moderate exercise or 75+ minutes of vigorous exercise weekly demonstrate significantly lower all-cause and cardiovascular mortality rates.',
    recommendationTarget: '150+ minutes of moderate activity or 75+ minutes of vigorous activity per week.'
  },
  diet_quality: {
    variable: 'diet_quality',
    name: 'Dietary Quality',
    sourceName: 'American Heart Association — Life’s Essential 8',
    sourceUrl: 'https://www.heart.org/en/healthy-living/healthy-lifestyle/lifes-essential-8',
    citationDate: '2022',
    evidenceSummary: 'Dietary patterns rich in whole foods, vegetables, fruits, legumes, nuts, and healthy proteins are associated with lower cardiovascular risk and favorable biological ageing metrics.',
    recommendationTarget: 'Emphasis on whole, minimally processed nutrient-dense foods.'
  },
  sleep_duration: {
    variable: 'sleep_duration',
    name: 'Sleep Duration',
    sourceName: 'American Heart Association — Life’s Essential 8',
    sourceUrl: 'https://www.heart.org/en/healthy-living/healthy-lifestyle/lifes-essential-8',
    citationDate: '2022',
    evidenceSummary: 'Adequate sleep (7–9 hours per night for adults) promotes cellular repair, metabolic stability, immune integrity, and vascular health.',
    recommendationTarget: '7 to 9 hours of uninterrupted sleep per night.'
  },
  bmi: {
    variable: 'bmi',
    name: 'Body Mass Index (BMI)',
    sourceName: 'American Heart Association & WHO Obesity Guidelines',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight',
    citationDate: '2021',
    evidenceSummary: 'Maintaining a healthy body weight reduces metabolic strain, systemic low-grade inflammation, and risk of type 2 diabetes and hypertension.',
    recommendationTarget: 'Healthy BMI range (18.5 – 24.9 kg/m²).'
  },
  blood_pressure: {
    variable: 'blood_pressure',
    name: 'Blood Pressure',
    sourceName: 'AHA/ACC Hypertension Guidelines & WHO',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/hypertension',
    citationDate: '2021',
    evidenceSummary: 'Elevated blood pressure is the single leading modifiable contributor to cardiovascular events. Optimal levels are under 120/80 mmHg.',
    recommendationTarget: 'Systolic BP < 120 mmHg and Diastolic BP < 80 mmHg.'
  },
  lipids: {
    variable: 'lipids',
    name: 'Blood Lipids / Cholesterol',
    sourceName: 'American Heart Association — Life’s Essential 8',
    sourceUrl: 'https://www.heart.org/en/healthy-living/healthy-lifestyle/lifes-essential-8',
    citationDate: '2022',
    evidenceSummary: 'Optimal non-HDL cholesterol and lipid levels lower atherogenic plaque development risk over a lifetime timeline.',
    recommendationTarget: 'Periodic lipid profile screening and maintaining recommended cholesterol levels.'
  },
  glucose: {
    variable: 'glucose',
    name: 'Blood Glucose / HbA1c',
    sourceName: 'American Heart Association & American Diabetes Association',
    sourceUrl: 'https://www.heart.org/en/healthy-living/healthy-lifestyle/lifes-essential-8',
    citationDate: '2022',
    evidenceSummary: 'Maintaining fasting blood glucose < 100 mg/dL or HbA1c < 5.7% preserves vascular endothelium and prevents microvascular complications.',
    recommendationTarget: 'Normal glycemic regulation (Fasting Glucose < 100 mg/dL or HbA1c < 5.7%).'
  },
  alcohol_exposure: {
    variable: 'alcohol_exposure',
    name: 'Alcohol Consumption',
    sourceName: 'World Health Organization Alcohol & Health Guidelines',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/alcohol',
    citationDate: '2023',
    evidenceSummary: 'Minimizing or eliminating alcohol intake reduces liver stress, blood pressure volatility, cellular DNA damage, and cancer risk.',
    recommendationTarget: 'Low frequency or abstinence from alcoholic beverages.'
  }
};
