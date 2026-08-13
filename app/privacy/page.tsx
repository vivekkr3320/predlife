import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="editorial-container max-w-3xl py-12 space-y-8">
      <h1 className="font-serif-editorial text-4xl font-bold text-[#171717]">Privacy Policy</h1>
      <p className="text-xs text-[#737373]">Effective Date: August 13, 2026 | DPDP Act 2025 Compliant</p>

      <div className="card-editorial p-8 space-y-6 bg-white text-sm text-[#525252] leading-relaxed">
        <h2 className="font-serif-editorial text-xl font-bold text-[#171717]">1. Data Minimization & Accountless Architecture</h2>
        <p>
          PredLife operates on a 100% accountless model. We do NOT collect Aadhaar, PAN, phone numbers, passwords, or precise location coordinates. Assessment sessions are tracked using cryptographically generated anonymous session tokens (`PL-[hex]`).
        </p>

        <h2 className="font-serif-editorial text-xl font-bold text-[#171717]">2. Information We Collect</h2>
        <p>
          We only process the 10 self-reported lifestyle & clinical indicator answers (age, nicotine, exercise, diet, sleep, height/weight, BP, lipids, glucose, alcohol) necessary to generate your longevity report. If you voluntarily enter your email to receive a copy, it is stored solely for that delivery purpose.
        </p>

        <h2 className="font-serif-editorial text-xl font-bold text-[#171717]">3. Data Retention Policy</h2>
        <p>
          Assessment records are retained for a default retention period of 90 days (`DATA_RETENTION_DAYS`), after which inactive anonymous records are automatically purged from our databases.
        </p>

        <h2 className="font-serif-editorial text-xl font-bold text-[#171717]">4. Your Rights Under DPDP 2025</h2>
        <p>
          You have the right to request deletion of your session data or inquire about processing activities by contacting support at support@predlife.com.
        </p>
      </div>
    </div>
  );
}
