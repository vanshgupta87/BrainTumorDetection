'use client';

import { useState } from 'react';

interface Symptom {
  id: string;
  label: string;
  weights: Record<string, number>; // weight score for each lobe/region
}

const SYMPTOMS_LIST: Symptom[] = [
  { id: 'headache', label: 'Progressive headaches (worse in the morning)', weights: { frontal: 1.5, parietal: 1.0, general: 2.0 } },
  { id: 'seizure', label: 'New-onset seizures (localized or general)', weights: { temporal: 2.5, frontal: 2.0, parietal: 1.5 } },
  { id: 'personality', label: 'Personality, mood, or behavior changes', weights: { frontal: 3.0 } },
  { id: 'vision', label: 'Vision deficits (blind spots, double vision)', weights: { occipital: 3.0, brainstem: 2.0 } },
  { id: 'speech', label: 'Difficulty with speech or memory loss', weights: { temporal: 3.0, frontal: 1.5 } },
  { id: 'numbness', label: 'Numbness, tingling, or limb weakness', weights: { parietal: 2.5, frontal: 2.0 } },
  { id: 'balance', label: 'Loss of balance, dizziness, or clumsy gait', weights: { cerebellum: 3.0, brainstem: 2.0 } },
  { id: 'swallowing', label: 'Difficulty swallowing or facial paralysis', weights: { brainstem: 3.0 } },
];

const LOBE_NAMES: Record<string, string> = {
  frontal: 'Frontal Lobe',
  temporal: 'Temporal Lobe',
  parietal: 'Parietal Lobe',
  occipital: 'Occipital Lobe',
  cerebellum: 'Cerebellum',
  brainstem: 'Brain Stem',
};

const LOBE_COLORS: Record<string, string> = {
  frontal: '#2DD4BF',
  temporal: '#818CF8',
  parietal: '#F5A623',
  occipital: '#FB6B5B',
  cerebellum: '#34D399',
  brainstem: '#C084FC',
};

export default function SymptomCorrelation() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const handleToggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Compute correlation scores
  const getCorrelationScores = () => {
    const scores: Record<string, number> = {
      frontal: 0,
      temporal: 0,
      parietal: 0,
      occipital: 0,
      cerebellum: 0,
      brainstem: 0,
    };

    let totalWeight = 0;
    selectedSymptoms.forEach((symId) => {
      const symptom = SYMPTOMS_LIST.find((s) => s.id === symId);
      if (symptom) {
        Object.entries(symptom.weights).forEach(([lobe, weight]) => {
          if (lobe in scores) {
            scores[lobe] += weight;
            totalWeight += weight;
          }
        });
      }
    });

    if (totalWeight === 0) return [];

    return Object.entries(scores)
      .map(([key, score]) => ({
        key,
        name: LOBE_NAMES[key],
        color: LOBE_COLORS[key],
        percentage: Math.round((score / totalWeight) * 100),
      }))
      .filter((s) => s.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage);
  };

  const scores = getCorrelationScores();

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Symptom Checklist */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-6 space-y-4">
        <h3 className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#2DD4BF] tracking-wide mb-2">SYMPTOM CHECKLIST</h3>
        <p className="text-xs text-[#7C8798]">Select patient clinical indicators to correlate with anatomical regions.</p>
        
        <div className="space-y-3 pt-2">
          {SYMPTOMS_LIST.map((sym) => {
            const isChecked = selectedSymptoms.includes(sym.id);
            return (
              <div
                key={sym.id}
                onClick={() => handleToggleSymptom(sym.id)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                  isChecked
                    ? 'bg-white/[0.04] border-[#2DD4BF]/40 text-white'
                    : 'bg-black/20 border-white/5 text-[#9AA5B6] hover:bg-white/[0.02]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#2DD4BF] focus:ring-[#2DD4BF] pointer-events-none accent-[#2DD4BF]"
                />
                <span className="text-xs font-medium leading-tight">{sym.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analysis Output */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-6 flex flex-col justify-between">
        <div>
          <h3 className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#2DD4BF] tracking-wide mb-4">CORRELATION REPORT</h3>
          
          {selectedSymptoms.length === 0 ? (
            <div className="h-[200px] flex flex-col items-center justify-center text-center p-4">
              <svg className="w-8 h-8 text-[#5B6577] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs text-[#7C8798]">Select symptoms to generate real-time anatomical mapping.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {scores.map((s) => (
                  <div key={s.key} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#E7ECF3]">{s.name}</span>
                      <span className="font-[family-name:var(--font-geist-mono)]" style={{ color: s.color }}>{s.percentage}% match</span>
                    </div>
                    <div className="w-full bg-white/[0.04] rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ width: `${s.percentage}%`, backgroundColor: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-black/30 p-4 space-y-2 mt-6">
                <h4 className="text-xs font-semibold text-[#2DD4BF] flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Clinical Suggestion
                </h4>
                <p className="text-xs text-[#9AA5B6] leading-relaxed">
                  Based on the selected symptoms, the highest localization is correlated with the{' '}
                  <span className="font-semibold text-white">{scores[0]?.name}</span>. We highly recommend reviewing MRI slices corresponding to this anatomical plane.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-white/[0.06] text-[10px] text-[#5B6577] leading-normal flex items-start gap-2">
          <svg className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>
            This tool computes probabilities based on anatomical averages. Clinical decisions must rely on MRI/histology confirmation.
          </span>
        </div>
      </div>
    </div>
  );
}
