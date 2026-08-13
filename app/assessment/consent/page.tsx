'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CheckSquare, Square, ArrowRight, Lock, FileText } from 'lucide-react';

export default function ConsentPage() {
  const router = useRouter();
  const [consentedAssessment, setConsentedAssessment] = useState(false);
  const [consentedData, setConsentedData] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleProceed = () => {
    if (!consentedAssessment || !consentedData) {
      setErrorMsg('Please review and check both consent acknowledgements to proceed.');
      return;
    }
    setErrorMsg('');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('predlife_consent_given', 'true');
    }
    router.push('/checkout');
  };

  return (
    <div className="editorial-container max-w-2xl py-12 space-y-8">
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
          <ShieldCheck className="w-4 h-4" /> Legal & Privacy Consent Notice
        </div>
        <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          Before You Begin Your Assessment
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          In compliance with the Digital Personal Data Protection (DPDP) Act 2025 and consumer protection guidelines, please review our assessment scope and data handling notice.
        </p>
      </div>

      <div className="card-editorial p-6 sm:p-8 space-y-6 bg-[var(--card-bg)] border border-[var(--border-color)]">
        {/* Notice Box 1 */}
        <div className="space-y-3 pb-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)] text-base">
            <FileText className="w-5 h-5 text-[var(--accent-primary)]" />
            <h3>1. Assessment Scope & Medical Disclaimer</h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            PredLife provides an educational and statistical longevity profile based on the lifestyle and health responses you enter. It does <strong>NOT</strong> predict an exact date of death, diagnose medical diseases, prescribe medication, or replace consultation with a qualified doctor.
          </p>
        </div>

        {/* Notice Box 2 */}
        <div className="space-y-3 pb-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)] text-base">
            <Lock className="w-5 h-5 text-[var(--accent-primary)]" />
            <h3>2. Data Processing & Privacy Safeguards</h3>
          </div>
          <ul className="text-xs text-[var(--text-secondary)] space-y-2 list-disc pl-5">
            <li><strong>Minimal Data Collection:</strong> We only collect the 10 questionnaire answers needed to compute your profile.</li>
            <li><strong>No Accounts:</strong> We do NOT ask for passwords, phone numbers, Aadhaar, or PAN cards.</li>
            <li><strong>Retention Policy:</strong> Assessment responses are retained securely under configurable data retention policies for generating your report and are never sold to third parties.</li>
          </ul>
        </div>

        {/* Checkbox 1 */}
        <div
          onClick={() => setConsentedAssessment(!consentedAssessment)}
          className={`p-4 border rounded-sm cursor-pointer transition-all flex items-start gap-3 ${
            consentedAssessment
              ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]'
              : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)] bg-[var(--card-bg)]'
          }`}
        >
          <div className="mt-0.5 text-[var(--accent-primary)] shrink-0">
            {consentedAssessment ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-[var(--text-muted)]" />}
          </div>
          <p className="text-xs font-medium text-[var(--text-primary)] leading-relaxed select-none">
            I understand that PredLife provides a statistical and educational longevity assessment based on information I provide. It does not predict an exact date or age of death, diagnose medical conditions, or replace professional medical advice.
          </p>
        </div>

        {/* Checkbox 2 */}
        <div
          onClick={() => setConsentedData(!consentedData)}
          className={`p-4 border rounded-sm cursor-pointer transition-all flex items-start gap-3 ${
            consentedData
              ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)]'
              : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)] bg-[var(--card-bg)]'
          }`}
        >
          <div className="mt-0.5 text-[var(--accent-primary)] shrink-0">
            {consentedData ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-[var(--text-muted)]" />}
          </div>
          <p className="text-xs font-medium text-[var(--text-primary)] leading-relaxed select-none">
            I agree to the processing of my responses for generating my anonymous longevity report in accordance with the <a href="/privacy" target="_blank" className="underline text-[var(--accent-primary)]">Privacy Policy</a> and <a href="/terms" target="_blank" className="underline text-[var(--accent-primary)]">Terms of Service</a>.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-sm">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleProceed}
          className="btn-editorial w-full text-base py-4 shadow-md group"
        >
          <span>I Agree — Proceed to Checkout (₹199)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
