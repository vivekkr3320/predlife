'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Download, Mail, Activity, Heart, CheckCircle2, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { generatePredLifePDF } from '@/lib/pdf-generator';

function ReportContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState<any>(null);
  const [emailInput, setEmailInput] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [token]);

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const activeToken = token || (typeof window !== 'undefined' ? sessionStorage.getItem('predlife_report_token') : null);
      const sessionId = typeof window !== 'undefined' ? sessionStorage.getItem('predlife_session_id') : null;

      if (!activeToken && !sessionId) {
        throw new Error('No valid report token found. Please complete the assessment.');
      }

      const url = activeToken ? `/api/report?token=${activeToken}` : `/api/report?sessionId=${sessionId}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load longevity report');
      }

      setReportData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error loading report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!reportData?.report) return;
    const r = reportData.report;
    generatePredLifePDF({
      score: r.score,
      riskBand: r.riskBand,
      minAge: r.estimatedRange.minAge,
      maxAge: r.estimatedRange.maxAge,
      strengths: r.strengths,
      priorityFactors: r.priorityFactors,
      plan: r.plan,
      methodologyVersion: r.methodologyVersion,
      createdAt: new Date(r.createdAt).toLocaleDateString(),
      sessionId: r.sessionId
    });
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    setEmailLoading(true);
    setEmailSuccess('');
    try {
      const activeToken = token || (typeof window !== 'undefined' ? sessionStorage.getItem('predlife_report_token') : null);
      const res = await fetch('/api/report/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: activeToken,
          email: emailInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setEmailSuccess('Report copy registered for email dispatch!');
        setEmailInput('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEmailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="editorial-container max-w-xl py-20 text-center space-y-4">
        <Activity className="w-8 h-8 text-[var(--accent-primary)] animate-spin mx-auto" />
        <h2 className="font-serif-editorial text-2xl font-bold text-[var(--text-primary)]">Loading Longevity Report...</h2>
        <p className="text-xs text-[var(--text-muted)]">Evaluating responses against PL-1.0 scoring model...</p>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="editorial-container max-w-lg py-16 text-center space-y-6">
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-sm">
          {error || 'Unable to access report.'}
        </div>
        <a href="/checkout" className="btn-editorial inline-block text-sm py-3 px-6">
          Return to Checkout — ₹199
        </a>
      </div>
    );
  }

  const { report, clinicalAlerts, answers } = reportData;

  // Determine missing items
  const missingItems: string[] = [];
  if (!answers?.bmi) missingItems.push('Height & Weight (BMI)');
  if (!answers?.systolic_bp) missingItems.push('Blood Pressure');
  if (!answers?.lipids_status || answers?.lipids_status === 'unknown') missingItems.push('Cholesterol / Lipids');
  if (!answers?.glucose_status || answers?.glucose_status === 'unknown') missingItems.push('Blood Sugar / HbA1c');

  return (
    <div className="editorial-container max-w-4xl py-12 space-y-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[var(--border-color)]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-primary)]">
            Official Longevity Assessment Report
          </span>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-1">
            Your Longevity Risk Profile
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Methodology: {report.methodologyVersion} • Session ID: {report.sessionId}
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="btn-editorial text-xs py-3 px-5 shadow-sm flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Download PDF Report
        </button>
      </div>

      {/* Hero Result Box: Estimated Longevity Range */}
      <div className="card-editorial p-8 sm:p-12 text-center bg-[var(--card-bg)] border border-[var(--border-color)] space-y-4">
        <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold">
          Your Estimated Longevity Range
        </span>

        <div className="font-serif-editorial text-5xl sm:text-7xl font-bold text-[var(--accent-primary)] tracking-tight">
          {report.estimatedRange.minAge}–{report.estimatedRange.maxAge} <span className="text-2xl sm:text-3xl font-light text-[var(--text-primary)]">Years</span>
        </div>

        <div className="max-w-xl mx-auto p-4 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-sm text-xs text-[var(--text-secondary)] leading-relaxed">
          This is a statistical estimate based on the information you provided. It is <strong>not a guaranteed prediction</strong> of your lifespan or date of death.
        </div>
      </div>

      {/* Missing Data Warning Box */}
      {missingItems.length > 0 && (
        <div className="card-editorial p-5 bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
          <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold text-sm">
            <Info className="w-4 h-4 text-[var(--accent-primary)]" />
            <h3>Some information was unavailable. Your estimate may be less precise.</h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] pl-6">
            Missing items: {missingItems.join(', ')}. Your score was calculated using your available inputs without unfair penalties.
          </p>
        </div>
      )}

      {/* Red Flag Safety Alerts */}
      {clinicalAlerts && clinicalAlerts.length > 0 && (
        <div className="space-y-3">
          {clinicalAlerts.map((alert: any, idx: number) => (
            <div key={idx} className="card-editorial p-5 border-l-4 border-l-amber-600 bg-amber-50/50 dark:bg-amber-950/20 space-y-1">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <h4>{alert.title}</h4>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed pl-6">
                {alert.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* PredLife Score & Your Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-editorial p-8 space-y-4 bg-[var(--card-bg)] border border-[var(--border-color)]">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">PredLife Score</span>
            <span className="text-xs px-2 py-0.5 border border-[var(--border-color)] bg-[var(--accent-subtle)] text-[var(--accent-subtle-text)] font-semibold rounded-full">
              PL-1.0 Model
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-serif-editorial text-5xl font-bold text-[var(--text-primary)]">{report.score}</span>
            <span className="text-sm text-[var(--text-muted)]">/ 100 Baseline Points</span>
          </div>

          <div className="w-full bg-[var(--border-color)] h-2 rounded-full overflow-hidden">
            <div className="bg-[var(--accent-primary)] h-full" style={{ width: `${report.score}%` }} />
          </div>

          <p className="text-xs text-[var(--text-secondary)]">
            Your score reflects alignment with AHA Life’s Essential 8 cardiovascular longevity guidelines.
          </p>
        </div>

        <div className="card-editorial p-8 space-y-4 bg-[var(--card-bg)] border border-[var(--border-color)]">
          <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">Your Profile</span>

          <div className="font-serif-editorial text-3xl font-bold text-[var(--text-primary)]">
            {report.riskBand} Risk
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {report.riskBand === 'Lower' && 'Your habits reflect strong cardiovascular and lifestyle protection associated with healthy ageing.'}
            {report.riskBand === 'Moderate' && 'Your profile indicates moderate protective factors with actionable room for lifestyle optimization.'}
            {report.riskBand === 'Higher' && 'Your profile identifies several high-yield modifiable factors where targeted lifestyle changes can significantly lower long-term risk.'}
          </p>
        </div>
      </div>

      {/* What Looks Good & What You Could Improve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What Looks Good */}
        <div className="card-editorial p-6 space-y-4 bg-[var(--card-bg)] border border-[var(--border-color)]">
          <h3 className="font-serif-editorial text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)]" />
            <span>What Looks Good</span>
          </h3>

          <div className="space-y-4">
            {report.strengths.map((item: any, i: number) => (
              <div key={i} className="p-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-sm space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-xs text-[var(--text-primary)]">{item.name}</h4>
                  <span className="text-[10px] font-bold text-[var(--accent-primary)]">{item.score}/100</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">{item.statusText}</p>
                <p className="text-[10px] text-[var(--text-muted)] italic">{item.impactText}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What You Could Improve */}
        <div className="card-editorial p-6 space-y-4 bg-[var(--card-bg)] border border-[var(--border-color)]">
          <h3 className="font-serif-editorial text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Heart className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <span>What You Could Improve</span>
          </h3>

          <div className="space-y-4">
            {report.priorityFactors.map((item: any, i: number) => (
              <div key={i} className="p-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-sm space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-xs text-[var(--text-primary)]">{item.name}</h4>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{item.score}/100</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">{item.statusText}</p>
                <p className="text-[10px] text-[var(--text-muted)] italic">{item.impactText}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 30-Day Personalized Improvement Plan */}
      <div id="personal-plan" className="card-editorial p-8 space-y-6 bg-[var(--card-bg)] border border-[var(--border-color)]">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider text-[var(--accent-primary)] font-bold">Actionable Habit Roadmap</span>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Personalized 30-Day Improvement Plan
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            This plan targets modifiable factors associated with healthier ageing and may support healthier longevity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {report.plan.map((week: any) => (
            <div key={week.week} className="p-4 border border-[var(--border-color)] rounded-sm space-y-2 bg-[var(--bg-primary)]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-primary)]">Week 0{week.week}</span>
              <h4 className="font-semibold text-sm text-[var(--text-primary)]">{week.title}</h4>
              <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 list-disc pl-4">
                {week.goals.map((g: string, idx: number) => (
                  <li key={idx}>{g}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Your Next Step CTA */}
      <div className="card-editorial p-8 text-center bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-4">
        <h3 className="font-serif-editorial text-2xl font-bold text-[var(--text-primary)]">
          Your Next Step
        </h3>
        <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
          Explore your 30-day habits roadmap above or download your 10-page formatted PDF report.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <a
            href="#personal-plan"
            className="btn-editorial text-sm py-3 px-6 shadow-md inline-flex items-center justify-center gap-2"
          >
            <span>Build My Personal Plan</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <button
            onClick={handleDownloadPDF}
            className="btn-secondary-editorial text-sm py-3 px-6 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download PDF Report
          </button>
        </div>
      </div>

      {/* Optional Email Delivery Section */}
      <div className="card-editorial p-6 bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-[var(--accent-primary)]" />
          <h3 className="font-serif-editorial text-lg font-bold text-[var(--text-primary)]">
            Want us to email your report? (Optional)
          </h3>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          Enter your email address if you would like a copy sent to your inbox. This is completely optional — you can download your PDF report directly above.
        </p>

        {emailSuccess ? (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-sm font-medium">
            ✓ {emailSuccess}
          </div>
        ) : (
          <form onSubmit={handleSendEmail} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              className="p-3 border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-primary)] rounded-sm text-xs grow focus:outline-[var(--accent-primary)]"
            />
            <button
              type="submit"
              disabled={emailLoading}
              className="btn-editorial text-xs py-3 px-6 shrink-0"
            >
              {emailLoading ? 'Sending...' : 'Send My Report'}
            </button>
          </form>
        )}
      </div>

      {/* Statutory Safety Disclaimer */}
      <div className="p-4 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)] text-center leading-relaxed">
        <p>
          <strong>Important:</strong> PredLife provides a statistical estimate based on the information you provide. It cannot know the exact age or date when someone will die. It is not a medical diagnosis or medical advice.
        </p>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs">Loading report...</div>}>
      <ReportContent />
    </Suspense>
  );
}
