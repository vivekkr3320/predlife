import React from 'react';

export default function TermsPage() {
  return (
    <div className="editorial-container max-w-3xl py-12 space-y-8">
      <h1 className="font-serif-editorial text-4xl font-bold text-[#171717]">Terms of Service</h1>
      <p className="text-xs text-[#737373]">Last Updated: August 13, 2026</p>

      <div className="card-editorial p-8 space-y-6 bg-white text-sm text-[#525252] leading-relaxed">
        <h2 className="font-serif-editorial text-xl font-bold text-[#171717]">1. Service Scope</h2>
        <p>
          PredLife is an educational digital tool providing statistical longevity estimates based on self-reported inputs. Payment of ₹199 grants one-time access to complete the assessment and view/download the personalized report.
        </p>

        <h2 className="font-serif-editorial text-xl font-bold text-[#171717]">2. No Medical Advice</h2>
        <p>
          The service does NOT provide medical advice, diagnosis, treatment, or exact lifespan prediction. Always consult a licensed healthcare professional for medical concerns.
        </p>
      </div>
    </div>
  );
}
