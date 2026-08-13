'use client';

import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function LandingPage() {
  const [showWhatYouGet, setShowWhatYouGet] = useState(false);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="pt-16 pb-12 border-b border-[var(--border-color)]">
        <div className="editorial-container max-w-4xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--accent-subtle)] text-[var(--accent-subtle-text)] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Built using established health research</span>
          </div>

          <h1 className="font-serif-editorial text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.08]">
            How Long Could <span className="text-[var(--accent-primary)]">You Live?</span>
          </h1>

          <p className="text-xl sm:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto font-light leading-relaxed">
            Answer a few simple questions and get your personal longevity estimate and health improvement plan.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/checkout"
              className="btn-editorial text-lg px-8 py-4 w-full sm:w-auto shadow-md group"
            >
              <span>Check My Longevity — ₹199</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#how-it-works"
              className="btn-secondary-editorial text-base px-6 py-4 w-full sm:w-auto"
            >
              How It Works
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--text-muted)] pt-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" /> One-time ₹199 payment
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" /> No signup or account
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" /> Get your report instantly
            </span>
          </div>
        </div>
      </section>

      {/* Light & Clean Transparency Notice */}
      <section className="editorial-container max-w-3xl">
        <div className="card-editorial p-6 border border-[var(--border-color)] bg-[var(--bg-subtle)] space-y-3">
          <h3 className="font-serif-editorial text-lg font-bold text-[var(--text-primary)]">What PredLife Does</h3>
          <ul className="text-xs sm:text-sm text-[var(--text-secondary)] space-y-2 list-disc pl-5 leading-relaxed">
            <li>PredLife uses your answers and established health research to create a personalized longevity estimate.</li>
            <li>Your result is an estimate, not a guaranteed prediction of how long you will live.</li>
            <li>PredLife does not diagnose diseases or replace a doctor.</li>
          </ul>
        </div>
      </section>

      {/* How It Works Section (3 Simple Steps) */}
      <section id="how-it-works" className="editorial-container space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[var(--accent-primary)] font-bold">Simple 3-Step Process</span>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-editorial p-8 space-y-3 bg-[var(--card-bg)]">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-subtle-text)] font-bold text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="font-serif-editorial text-xl font-bold text-[var(--text-primary)]">
              Pay ₹199
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              One simple payment. No account needed.
            </p>
          </div>

          <div className="card-editorial p-8 space-y-3 bg-[var(--card-bg)]">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-subtle-text)] font-bold text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="font-serif-editorial text-xl font-bold text-[var(--text-primary)]">
              Answer 10 questions
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Tell us about your age, habits and health information.
            </p>
          </div>

          <div className="card-editorial p-8 space-y-3 bg-[var(--card-bg)]">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-subtle-text)] font-bold text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="font-serif-editorial text-xl font-bold text-[var(--text-primary)]">
              Get your result
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              See your estimated longevity range and a personalized plan.
            </p>
          </div>
        </div>
      </section>

      {/* Collapsible "What You Get" Section */}
      <section className="editorial-container text-center space-y-6">
        <div className="flex justify-center">
          <button
            onClick={() => setShowWhatYouGet(!showWhatYouGet)}
            aria-expanded={showWhatYouGet}
            aria-controls="what-you-get-section"
            className="btn-secondary-editorial py-3 px-6 text-sm font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>{showWhatYouGet ? 'Hide Details' : 'See What You Get'}</span>
            {showWhatYouGet ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <div
          id="what-you-get-section"
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showWhatYouGet ? 'max-h-[1000px] opacity-100 pt-6' : 'max-h-0 opacity-0 pt-0'
          }`}
        >
          <div className="bg-[var(--bg-subtle)] p-8 sm:p-12 border border-[var(--border-color)] rounded-md space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                What You Get
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              <div className="bg-[var(--card-bg)] p-6 border border-[var(--border-color)] rounded-sm space-y-2">
                <h3 className="font-serif-editorial text-xl font-bold text-[var(--text-primary)]">
                  Your Longevity Estimate
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  See your estimated age range based on your answers.
                </p>
              </div>

              <div className="bg-[var(--card-bg)] p-6 border border-[var(--border-color)] rounded-sm space-y-2">
                <h3 className="font-serif-editorial text-xl font-bold text-[var(--text-primary)]">
                  Your Risk Profile
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Understand which habits may be helping or hurting your score.
                </p>
              </div>

              <div className="bg-[var(--card-bg)] p-6 border border-[var(--border-color)] rounded-sm space-y-2">
                <h3 className="font-serif-editorial text-xl font-bold text-[var(--text-primary)]">
                  Your Personal Plan
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Get simple steps you can take to improve your health and ageing profile.
                </p>
              </div>

              <div className="bg-[var(--card-bg)] p-6 border border-[var(--border-color)] rounded-sm space-y-2">
                <h3 className="font-serif-editorial text-xl font-bold text-[var(--text-primary)]">
                  Your PDF Report
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Download your complete PredLife report.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curiosity Driven Section */}
      <section className="editorial-container max-w-3xl text-center space-y-6">
        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          Your answers tell a story.
        </h2>
        <div className="space-y-4 text-base text-[var(--text-secondary)] leading-relaxed font-light">
          <p>
            Your daily habits, activity, sleep, tobacco use, alcohol use and other health factors can affect your long-term health.
          </p>
          <p className="font-normal text-[var(--text-primary)]">
            PredLife brings these factors together into one simple report.
          </p>
        </div>

        <div className="pt-4">
          <a
            href="/checkout"
            className="btn-editorial text-lg px-8 py-4 shadow-md inline-flex items-center gap-2 group"
          >
            <span>Check My Longevity — ₹199</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Simple Legal Disclaimer */}
      <section className="editorial-container max-w-3xl">
        <div className="p-4 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)] text-center leading-relaxed">
          <p>
            <strong>Important:</strong> PredLife gives a statistical estimate based on the information you provide. It cannot know the exact age or date when someone will die. It is not a medical diagnosis or medical advice.
          </p>
        </div>
      </section>
    </div>
  );
}
