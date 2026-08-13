import React from 'react';
import { BookOpen } from 'lucide-react';
import { EVIDENCE_REGISTRY } from '@/lib/evidence';

export default function MethodologyPage() {
  return (
    <div className="editorial-container max-w-4xl py-12 space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
          <BookOpen className="w-4 h-4" /> Methodology Documentation
        </div>
        <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[var(--text-primary)]">
          PredLife Scoring Model (PL-1.0)
        </h1>
        <p className="text-base text-[var(--text-secondary)]">
          Transparent documentation on inputs, scoring algorithms, evidence foundations, and model limitations.
        </p>
      </div>

      {/* Model Overview Card */}
      <div className="card-editorial p-8 space-y-4 bg-[var(--card-bg)] border border-[var(--border-color)]">
        <h2 className="font-serif-editorial text-2xl font-bold text-[var(--text-primary)]">1. Theoretical Framework</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          PredLife PL-1.0 is an educational longevity risk profiling algorithm built upon established public health measures, primarily drawing from the American Heart Association (AHA) <strong>Life’s Essential 8</strong> construct and World Health Organization (WHO) non-communicable disease risk guidelines.
        </p>
        <p className="text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)] p-4 rounded-sm border border-[var(--border-color)]">
          <strong>Disclaimer:</strong> PredLife uses an original proprietary scoring model. It does not claim official endorsement by or affiliation with the American Heart Association or the World Health Organization.
        </p>
      </div>

      {/* Evidence Table */}
      <div className="space-y-4">
        <h2 className="font-serif-editorial text-2xl font-bold text-[var(--text-primary)]">2. Evidence Registry & Variable Mapping</h2>
        <div className="overflow-x-auto card-editorial border border-[var(--border-color)] bg-[var(--card-bg)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]">
                <th className="p-3">Variable ID</th>
                <th className="p-3">Measure Name</th>
                <th className="p-3">Primary Evidence Source</th>
                <th className="p-3">Target Recommendation</th>
              </tr>
            </thead>
            <tbody className="text-xs text-[var(--text-secondary)] divide-y divide-[var(--border-color)]">
              {Object.values(EVIDENCE_REGISTRY).map((item) => (
                <tr key={item.variable} className="hover:bg-[var(--bg-subtle)]">
                  <td className="p-3 font-mono text-[11px] text-[var(--accent-primary)] font-semibold">{item.variable}</td>
                  <td className="p-3 font-medium text-[var(--text-primary)]">{item.name}</td>
                  <td className="p-3">
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-[var(--accent-primary)] hover:underline">
                      {item.sourceName}
                    </a>
                  </td>
                  <td className="p-3 text-[var(--text-muted)]">{item.recommendationTarget}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Limitations */}
      <div className="card-editorial p-8 space-y-4 bg-[var(--card-bg)] border border-[var(--border-color)]">
        <h2 className="font-serif-editorial text-2xl font-bold text-[var(--text-primary)]">3. What PL-1.0 Does NOT Predict</h2>
        <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc pl-5">
          <li><strong>Does NOT predict exact date or age of death:</strong> Lifespan is influenced by unpredictable stochastic factors, genetics, environmental exposures, and acute events.</li>
          <li><strong>Does NOT provide a medical diagnosis:</strong> PredLife does not diagnose hypertension, diabetes, hyperlipidemia, or heart disease.</li>
          <li><strong>Does NOT guarantee lifespan extension:</strong> Improving modifiable risk factors lowers statistical population-level risk, but individual biological outcomes vary.</li>
        </ul>
      </div>
    </div>
  );
}
