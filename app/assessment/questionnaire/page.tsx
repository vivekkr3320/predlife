'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, Info } from 'lucide-react';
import { EVIDENCE_REGISTRY } from '@/lib/evidence';

interface QuestionState {
  age: string;
  nicotine_exposure: string;
  physical_activity: string;
  diet_quality: string;
  sleep_duration: string;
  knows_bmi: string;
  height_cm: string;
  weight_kg: string;
  knows_bp: string;
  systolic_bp: string;
  diastolic_bp: string;
  lipids_status: string;
  glucose_status: string;
  alcohol_exposure: string;
}

export default function QuestionnairePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showEvidenceModal, setShowEvidenceModal] = useState<string | null>(null);

  const [answers, setAnswers] = useState<QuestionState>({
    age: '',
    nicotine_exposure: '',
    physical_activity: '',
    diet_quality: '',
    sleep_duration: '',
    knows_bmi: 'no',
    height_cm: '',
    weight_kg: '',
    knows_bp: 'no',
    systolic_bp: '',
    diastolic_bp: '',
    lipids_status: 'unknown',
    glucose_status: 'unknown',
    alcohol_exposure: ''
  });

  const totalSteps = 10;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionId = sessionStorage.getItem('predlife_session_id');
      if (!sessionId) {
        router.push('/checkout');
      }
    }
  }, [router]);

  const updateAnswer = (key: keyof QuestionState, val: string) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
    setErrorMsg('');
  };

  const handleNext = () => {
    if (currentStep === 1 && !answers.age) return setErrorMsg('Please select your current age range.');
    if (currentStep === 2 && !answers.nicotine_exposure) return setErrorMsg('Please select your nicotine exposure.');
    if (currentStep === 3 && !answers.physical_activity) return setErrorMsg('Please select your weekly physical activity level.');
    if (currentStep === 4 && !answers.diet_quality) return setErrorMsg('Please select your dietary pattern.');
    if (currentStep === 5 && !answers.sleep_duration) return setErrorMsg('Please select your typical sleep duration.');
    if (currentStep === 6 && answers.knows_bmi === 'yes' && (!answers.height_cm || !answers.weight_kg)) {
      return setErrorMsg('Please enter both height and weight, or select "No" to continue.');
    }
    if (currentStep === 7 && answers.knows_bp === 'yes' && (!answers.systolic_bp || !answers.diastolic_bp)) {
      return setErrorMsg('Please enter both Systolic and Diastolic values, or select "No".');
    }
    if (currentStep === 8 && !answers.lipids_status) return setErrorMsg('Please select your cholesterol status.');
    if (currentStep === 9 && !answers.glucose_status) return setErrorMsg('Please select your blood glucose status.');
    if (currentStep === 10 && !answers.alcohol_exposure) return setErrorMsg('Please select your alcohol frequency.');

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitAssessment();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setErrorMsg('');
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const sessionId = sessionStorage.getItem('predlife_session_id') || 'PL-demo-session';

      const res = await fetch('/api/assessment/save-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          answers
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to submit assessment answers');
      }

      sessionStorage.setItem('predlife_report_token', data.reportToken);
      router.push(`/report?token=${data.reportToken}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error processing assessment results.');
      setLoading(false);
    }
  };

  return (
    <div className="editorial-container max-w-2xl py-12 space-y-8">
      {/* Progress Bar & Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs font-semibold text-[var(--text-secondary)]">
          <span className="uppercase tracking-widest text-[var(--accent-primary)]">Question {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-[var(--border-color)] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[var(--accent-primary)] h-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card Container */}
      <div className="card-editorial p-6 sm:p-10 space-y-8 bg-[var(--card-bg)] border border-[var(--border-color)]">
        {/* Step 1: Age */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                What is your current age?
              </h2>
              <button onClick={() => setShowEvidenceModal('age')} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Under 20', val: 'under_20' },
                { label: '20–29 years', val: '20_29' },
                { label: '30–39 years', val: '30_39' },
                { label: '40–49 years', val: '40_49' },
                { label: '50–59 years', val: '50_59' },
                { label: '60–69 years', val: '60_69' },
                { label: '70+ years', val: '70_plus' },
              ].map(opt => (
                <div
                  key={opt.val}
                  onClick={() => updateAnswer('age', opt.val)}
                  className={`p-4 border rounded-sm cursor-pointer transition-all flex items-center justify-between ${
                    answers.age === opt.val
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-subtle-text)] font-semibold'
                      : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)] text-[var(--text-primary)] bg-[var(--card-bg)]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {answers.age === opt.val && <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Nicotine */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                Do you currently use tobacco or nicotine products?
              </h2>
              <button onClick={() => setShowEvidenceModal('nicotine_exposure')} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Includes cigarettes, chewing tobacco, vaping, and nicotine e-cigarettes.
            </p>
            <div className="space-y-3">
              {[
                { label: 'Never used tobacco/nicotine', val: 'never' },
                { label: 'Former user — quit more than 5 years ago', val: 'former_5plus' },
                { label: 'Former user — quit within the last 5 years', val: 'former_under5' },
                { label: 'Occasional user', val: 'occasionally' },
                { label: 'Regular user', val: 'regularly' },
                { label: 'Daily user', val: 'daily' },
              ].map(opt => (
                <div
                  key={opt.val}
                  onClick={() => updateAnswer('nicotine_exposure', opt.val)}
                  className={`p-4 border rounded-sm cursor-pointer transition-all flex items-center justify-between ${
                    answers.nicotine_exposure === opt.val
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-subtle-text)] font-semibold'
                      : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)] text-[var(--text-primary)] bg-[var(--card-bg)]'
                  }`}
                >
                  <span className="text-sm">{opt.label}</span>
                  {answers.nicotine_exposure === opt.val && <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Physical Activity */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                How much moderate or vigorous physical activity do you get weekly?
              </h2>
              <button onClick={() => setShowEvidenceModal('physical_activity')} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-sm text-xs text-[var(--text-secondary)] flex gap-2">
              <Info className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
              <span>Examples of moderate activity include brisk walking. Vigorous activity includes higher-intensity running or sports.</span>
            </div>
            <div className="space-y-3">
              {[
                { label: '150+ minutes moderate activity (Target reached)', val: '150_plus' },
                { label: '75–149 minutes weekly', val: '75_149' },
                { label: '30–74 minutes weekly', val: '30_74' },
                { label: 'Less than 30 minutes weekly', val: 'under_30' },
                { label: 'Almost none / Sedentary', val: 'almost_none' },
              ].map(opt => (
                <div
                  key={opt.val}
                  onClick={() => updateAnswer('physical_activity', opt.val)}
                  className={`p-4 border rounded-sm cursor-pointer transition-all flex items-center justify-between ${
                    answers.physical_activity === opt.val
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-subtle-text)] font-semibold'
                      : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)] text-[var(--text-primary)] bg-[var(--card-bg)]'
                  }`}
                >
                  <span className="text-sm">{opt.label}</span>
                  {answers.physical_activity === opt.val && <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Diet */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                Which best describes your usual eating pattern?
              </h2>
              <button onClick={() => setShowEvidenceModal('diet_quality')} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Mostly whole/minimally processed foods with vegetables, fruits, legumes & healthy proteins', val: 'mostly_whole' },
                { label: 'Generally healthy with occasional processed or fast food', val: 'generally_healthy' },
                { label: 'Mixed dietary pattern', val: 'mixed' },
                { label: 'Frequently processed/fast foods or sugary foods', val: 'frequent_processed' },
                { label: 'Mostly highly ultra-processed foods', val: 'mostly_processed' },
              ].map(opt => (
                <div
                  key={opt.val}
                  onClick={() => updateAnswer('diet_quality', opt.val)}
                  className={`p-4 border rounded-sm cursor-pointer transition-all flex items-center justify-between ${
                    answers.diet_quality === opt.val
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-subtle-text)] font-semibold'
                      : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)] text-[var(--text-primary)] bg-[var(--card-bg)]'
                  }`}
                >
                  <span className="text-sm">{opt.label}</span>
                  {answers.diet_quality === opt.val && <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Sleep */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                How many hours do you usually sleep per night?
              </h2>
              <button onClick={() => setShowEvidenceModal('sleep_duration')} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: '7–9 hours (Recommended target)', val: '7_9' },
                { label: '6–7 hours', val: '6_7' },
                { label: '5–6 hours', val: '5_6' },
                { label: 'Less than 5 hours', val: 'under_5' },
                { label: 'More than 9 hours', val: 'over_9' },
              ].map(opt => (
                <div
                  key={opt.val}
                  onClick={() => updateAnswer('sleep_duration', opt.val)}
                  className={`p-4 border rounded-sm cursor-pointer transition-all flex items-center justify-between ${
                    answers.sleep_duration === opt.val
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-subtle-text)] font-semibold'
                      : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)] text-[var(--text-primary)] bg-[var(--card-bg)]'
                  }`}
                >
                  <span className="text-sm">{opt.label}</span>
                  {answers.sleep_duration === opt.val && <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Height & Weight (BMI) */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                Do you know your height and weight?
              </h2>
              <button onClick={() => setShowEvidenceModal('bmi')} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateAnswer('knows_bmi', 'yes')}
                className={`p-4 border rounded-sm text-center font-medium ${
                  answers.knows_bmi === 'yes' ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-subtle-text)]' : 'border-[var(--border-color)] text-[var(--text-primary)]'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  updateAnswer('knows_bmi', 'no');
                  updateAnswer('height_cm', '');
                  updateAnswer('weight_kg', '');
                }}
                className={`p-4 border rounded-sm text-center font-medium ${
                  answers.knows_bmi === 'no' ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-subtle-text)]' : 'border-[var(--border-color)] text-[var(--text-primary)]'
                }`}
              >
                No / Skip
              </button>
            </div>

            {answers.knows_bmi === 'yes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--border-color)]">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="e.g. 175"
                    value={answers.height_cm}
                    onChange={e => updateAnswer('height_cm', e.target.value)}
                    className="w-full p-3 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-sm text-sm focus:outline-[var(--accent-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 70"
                    value={answers.weight_kg}
                    onChange={e => updateAnswer('weight_kg', e.target.value)}
                    className="w-full p-3 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-sm text-sm focus:outline-[var(--accent-primary)]"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 7: Blood Pressure */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                Do you know your usual blood pressure?
              </h2>
              <button onClick={() => setShowEvidenceModal('blood_pressure')} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-sm text-xs text-[var(--text-secondary)]">
              Blood pressure measurements should ideally come from a reliable blood-pressure monitor or healthcare professional.
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['yes', 'no', 'not_sure'].map(mode => (
                <button
                  key={mode}
                  onClick={() => {
                    updateAnswer('knows_bp', mode);
                    if (mode !== 'yes') {
                      updateAnswer('systolic_bp', '');
                      updateAnswer('diastolic_bp', '');
                    }
                  }}
                  className={`p-3 border rounded-sm text-center text-sm font-medium capitalize ${
                    answers.knows_bp === mode ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-subtle-text)]' : 'border-[var(--border-color)] text-[var(--text-primary)]'
                  }`}
                >
                  {mode.replace('_', ' ')}
                </button>
              ))}
            </div>

            {answers.knows_bp === 'yes' && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border-color)]">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Systolic (Top number, mmHg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 120"
                    value={answers.systolic_bp}
                    onChange={e => updateAnswer('systolic_bp', e.target.value)}
                    className="w-full p-3 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-sm text-sm focus:outline-[var(--accent-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Diastolic (Bottom number, mmHg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 80"
                    value={answers.diastolic_bp}
                    onChange={e => updateAnswer('diastolic_bp', e.target.value)}
                    className="w-full p-3 border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-sm text-sm focus:outline-[var(--accent-primary)]"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 8: Cholesterol */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                Do you know your recent cholesterol / lipid results?
              </h2>
              <button onClick={() => setShowEvidenceModal('lipids')} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Normal / Optimal lipid profile', val: 'optimal' },
                { label: 'Borderline elevated cholesterol', val: 'borderline' },
                { label: 'High cholesterol / On lipid medication', val: 'high' },
                { label: 'Don’t know / Haven’t checked recently', val: 'unknown' },
              ].map(opt => (
                <div
                  key={opt.val}
                  onClick={() => updateAnswer('lipids_status', opt.val)}
                  className={`p-4 border rounded-sm cursor-pointer transition-all flex items-center justify-between ${
                    answers.lipids_status === opt.val
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-subtle-text)] font-semibold'
                      : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)] text-[var(--text-primary)] bg-[var(--card-bg)]'
                  }`}
                >
                  <span className="text-sm">{opt.label}</span>
                  {answers.lipids_status === opt.val && <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 9: Blood Glucose */}
        {currentStep === 9 && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                Do you know your blood sugar or HbA1c result?
              </h2>
              <button onClick={() => setShowEvidenceModal('glucose')} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Normal blood sugar (Fasting < 100 mg/dL or HbA1c < 5.7%)', val: 'normal' },
                { label: 'Borderline / Prediabetes range', val: 'borderline' },
                { label: 'Elevated / High glucose range', val: 'high' },
                { label: 'Don’t know / Haven’t tested', val: 'unknown' },
              ].map(opt => (
                <div
                  key={opt.val}
                  onClick={() => updateAnswer('glucose_status', opt.val)}
                  className={`p-4 border rounded-sm cursor-pointer transition-all flex items-center justify-between ${
                    answers.glucose_status === opt.val
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-subtle-text)] font-semibold'
                      : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)] text-[var(--text-primary)] bg-[var(--card-bg)]'
                  }`}
                >
                  <span className="text-sm">{opt.label}</span>
                  {answers.glucose_status === opt.val && <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 10: Alcohol */}
        {currentStep === 10 && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                How often do you consume alcoholic drinks?
              </h2>
              <button onClick={() => setShowEvidenceModal('alcohol_exposure')} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Never drink alcohol', val: 'never' },
                { label: 'Less than once a month', val: 'less_monthly' },
                { label: '1–3 times a month', val: '1_3_monthly' },
                { label: '1–3 times a week', val: '1_3_weekly' },
                { label: '4+ times a week', val: '4_plus_weekly' },
                { label: 'Daily', val: 'daily' },
              ].map(opt => (
                <div
                  key={opt.val}
                  onClick={() => updateAnswer('alcohol_exposure', opt.val)}
                  className={`p-4 border rounded-sm cursor-pointer transition-all flex items-center justify-between ${
                    answers.alcohol_exposure === opt.val
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-subtle-text)] font-semibold'
                      : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)] text-[var(--text-primary)] bg-[var(--card-bg)]'
                  }`}
                >
                  <span className="text-sm">{opt.label}</span>
                  {answers.alcohol_exposure === opt.val && <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-sm">
            {errorMsg}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex justify-between items-center pt-6 border-t border-[var(--border-color)]">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            className="btn-secondary-editorial py-2.5 px-4 text-xs disabled:opacity-30 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={loading}
            className="btn-editorial py-3 px-6 text-sm shadow-md flex items-center gap-2"
          >
            <span>{loading ? 'Calculating Profile...' : currentStep === totalSteps ? 'Generate Longevity Report' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Evidence Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--card-bg)] card-editorial p-6 max-w-md w-full space-y-4 border border-[var(--border-color)] text-[var(--text-primary)]">
            <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
              <h3 className="font-serif-editorial font-bold text-lg text-[var(--text-primary)]">
                {EVIDENCE_REGISTRY[showEvidenceModal]?.name}
              </h3>
              <button onClick={() => setShowEvidenceModal(null)} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                Close ✕
              </button>
            </div>
            <div className="space-y-2 text-xs text-[var(--text-secondary)]">
              <p><strong>Source:</strong> {EVIDENCE_REGISTRY[showEvidenceModal]?.sourceName}</p>
              <p><strong>Summary:</strong> {EVIDENCE_REGISTRY[showEvidenceModal]?.evidenceSummary}</p>
              <p><strong>Target:</strong> {EVIDENCE_REGISTRY[showEvidenceModal]?.recommendationTarget}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
