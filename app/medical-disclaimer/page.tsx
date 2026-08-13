import React from 'react';

export default function MedicalDisclaimerPage() {
  return (
    <div className="editorial-container max-w-3xl py-12 space-y-8">
      <h1 className="font-serif-editorial text-4xl font-bold text-[#171717]">Statutory Medical Disclaimer</h1>

      <div className="card-editorial p-8 space-y-6 bg-white text-sm text-[#525252] leading-relaxed">
        <h2 className="font-serif-editorial text-xl font-bold text-[#171717]">Educational & Statistical Purpose Only</h2>
        <p>
          PredLife is an educational tool designed to assess lifestyle alignment with cardiovascular longevity benchmarks. It does <strong>NOT</strong> provide medical diagnosis, predict exact lifespan, prescribe medication, or substitute for professional clinical care.
        </p>
        <p>
          If you have abnormal blood pressure, elevated blood sugar, severe symptoms, or medical concerns, immediately consult an appropriately qualified healthcare professional.
        </p>
      </div>
    </div>
  );
}
