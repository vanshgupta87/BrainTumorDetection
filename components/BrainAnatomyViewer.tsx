'use client';

import { useState } from 'react';

interface LobeInfo {
  name: string;
  functions: string[];
  symptoms: string[];
  tumorTypes: string[];
  color: string;
  description: string;
}

const LOBE_DATA: Record<string, LobeInfo> = {
  frontal: {
    name: 'Frontal Lobe',
    color: '#2DD4BF',
    description: 'Located at the front of the brain. Responsible for executive functions, motor skills, expressive language, and voluntary movement.',
    functions: ['Decision making & reasoning', 'Motor control & movement', 'Personality & behavior control', 'Speech production (Broca\'s area)'],
    symptoms: ['Changes in personality or mood', 'Weakness on one side of the body', 'Difficulty planning or organizing', 'Loss of smell or speech difficulties'],
    tumorTypes: ['Glioma (Astrocytoma, Oligodendroglioma)', 'Meningioma'],
  },
  temporal: {
    name: 'Temporal Lobe',
    color: '#818CF8',
    description: 'Located on the sides of the brain near the ears. Essential for auditory processing, memory, emotion, and language comprehension.',
    functions: ['Memory storage & recall', 'Auditory perception & hearing', 'Emotion & sensory input integration', 'Language comprehension (Wernicke\'s area)'],
    symptoms: ['Short-term memory loss', 'Localized seizures (temporal lobe epilepsy)', 'Difficulty understanding language', 'Sensory hallucinations (smells, sounds)'],
    tumorTypes: ['Glioma (Glioblastoma)', 'Meningioma'],
  },
  parietal: {
    name: 'Parietal Lobe',
    color: '#F5A623',
    description: 'Located in the upper middle part of the brain. Processes sensory information such as touch, pressure, temperature, and pain.',
    functions: ['Sensory perception (touch, pain)', 'Spatial coordination & orientation', 'Mathematical calculations', 'Reading and writing skills'],
    symptoms: ['Numbness or tingling sensations', 'Difficulty with writing or arithmetic', 'Spatial disorientation (getting lost easily)', 'Inability to recognize body parts'],
    tumorTypes: ['Glioma', 'Meningioma'],
  },
  occipital: {
    name: 'Occipital Lobe',
    color: '#FB6B5B',
    description: 'Located at the back of the brain. Serves as the primary visual processing center of the mammalian brain.',
    functions: ['Visual processing & interpretation', 'Color, shape, and recognition', 'Spatial vision input'],
    symptoms: ['Partial or complete vision loss', 'Visual hallucinations or distortions', 'Difficulty recognizing objects or colors', 'Double vision'],
    tumorTypes: ['Glioma (rare)', 'Meningioma (tentorial)'],
  },
  cerebellum: {
    name: 'Cerebellum',
    color: '#34D399',
    description: 'Located under the cerebrum at the back of the brain. Coordinates muscle movements, maintains posture, and balance.',
    functions: ['Balance and posture maintenance', 'Coordination of voluntary movement', 'Motor skill learning & fine motor tasks'],
    symptoms: ['Loss of balance and coordination (Ataxia)', 'Dizziness or vertigo', 'Nausea and vomiting', 'Uncontrolled rapid eye movements (Nystagmus)'],
    tumorTypes: ['Medulloblastoma (common in pediatric)', 'Astrocytoma', 'Ependymoma'],
  },
  brainstem: {
    name: 'Brain Stem',
    color: '#C084FC',
    description: 'Located at the base of the brain, connecting it to the spinal cord. Controls automatic body functions essential for life.',
    functions: ['Cardiac and respiratory control', 'Autonomic functions (digestion, heart rate)', 'Sleep and consciousness regulation', 'Cranial nerve passage'],
    symptoms: ['Double vision or facial weakness', 'Difficulty swallowing or breathing', 'Unsteady gait or limb weakness', 'Headaches and stiff neck'],
    tumorTypes: ['Diffuse Intrinsic Pontine Glioma (DIPG)', 'Ependymoma'],
  },
};

export default function BrainAnatomyViewer() {
  const [selectedLobe, setSelectedLobe] = useState<string>('frontal');
  const lobe = LOBE_DATA[selectedLobe];

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      {/* Interactive Brain Map */}
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-white/[0.08] bg-black/35">
        <h4 className="font-[family-name:var(--font-geist-mono)] text-[10px] text-[#7C8798] tracking-widest mb-6">INTERACTIVE ANATOMICAL INTERFACE</h4>
        
        {/* SVG Brain Silhouette */}
        <svg viewBox="0 0 400 320" className="w-full max-w-[320px] h-auto drop-shadow-[0_0_30px_rgba(45,212,191,0.15)]">
          <g cursor="pointer">
            {/* Frontal Lobe */}
            <path
              d="M 220,50 C 130,50 120,130 130,170 C 150,180 180,180 200,180 C 230,185 240,160 250,140 C 265,140 270,100 250,70 Z"
              fill={selectedLobe === 'frontal' ? '#2DD4BF' : '#1e2d31'}
              stroke="#2DD4BF"
              strokeWidth={selectedLobe === 'frontal' ? 2 : 1}
              onClick={() => setSelectedLobe('frontal')}
              className="transition-all duration-200 hover:opacity-90"
            />
            {/* Parietal Lobe */}
            <path
              d="M 220,50 C 275,50 310,95 295,140 C 270,140 250,140 250,140 C 240,160 230,185 200,180 C 210,130 200,70 220,50 Z"
              fill={selectedLobe === 'parietal' ? '#F5A623' : '#2b2318'}
              stroke="#F5A623"
              strokeWidth={selectedLobe === 'parietal' ? 2 : 1}
              onClick={() => setSelectedLobe('parietal')}
              className="transition-all duration-200 hover:opacity-90"
            />
            {/* Occipital Lobe */}
            <path
              d="M 295,140 C 320,140 330,180 300,210 C 285,200 270,195 270,180 C 270,160 280,145 295,140 Z"
              fill={selectedLobe === 'occipital' ? '#FB6B5B' : '#2d1d1b'}
              stroke="#FB6B5B"
              strokeWidth={selectedLobe === 'occipital' ? 2 : 1}
              onClick={() => setSelectedLobe('occipital')}
              className="transition-all duration-200 hover:opacity-90"
            />
            {/* Temporal Lobe */}
            <path
              d="M 130,170 C 120,210 160,240 190,230 C 210,230 230,225 240,200 C 240,200 230,185 200,180 C 180,180 150,180 130,170 Z"
              fill={selectedLobe === 'temporal' ? '#818CF8' : '#212235'}
              stroke="#818CF8"
              strokeWidth={selectedLobe === 'temporal' ? 2 : 1}
              onClick={() => setSelectedLobe('temporal')}
              className="transition-all duration-200 hover:opacity-90"
            />
            {/* Cerebellum */}
            <path
              d="M 270,195 C 285,200 300,210 300,210 C 300,240 270,270 235,260 C 235,240 250,220 270,195 Z"
              fill={selectedLobe === 'cerebellum' ? '#34D399' : '#1d2c25'}
              stroke="#34D399"
              strokeWidth={selectedLobe === 'cerebellum' ? 2 : 1}
              onClick={() => setSelectedLobe('cerebellum')}
              className="transition-all duration-200 hover:opacity-90"
            />
            {/* Brain Stem */}
            <path
              d="M 190,230 C 210,230 230,225 240,200 C 250,220 235,240 235,260 C 235,280 220,310 200,310 C 180,310 185,260 190,230 Z"
              fill={selectedLobe === 'brainstem' ? '#C084FC' : '#2c1e35'}
              stroke="#C084FC"
              strokeWidth={selectedLobe === 'brainstem' ? 2 : 1}
              onClick={() => setSelectedLobe('brainstem')}
              className="transition-all duration-200 hover:opacity-90"
            />
          </g>

          {/* Connective labels */}
          <text x="50" y="90" fill="#2DD4BF" fontSize="10" fontFamily="monospace">Frontal Lobe</text>
          <line x1="115" y1="87" x2="160" y2="105" stroke="#2DD4BF" strokeDasharray="2" strokeWidth="0.5" />

          <text x="310" y="70" fill="#F5A623" fontSize="10" fontFamily="monospace">Parietal Lobe</text>
          <line x1="305" y1="73" x2="260" y2="95" stroke="#F5A623" strokeDasharray="2" strokeWidth="0.5" />

          <text x="335" y="170" fill="#FB6B5B" fontSize="10" fontFamily="monospace">Occipital Lobe</text>
          <line x1="330" y1="167" x2="295" y2="170" stroke="#FB6B5B" strokeDasharray="2" strokeWidth="0.5" />
        </svg>

        <p className="text-[11px] text-[#7C8798] text-center mt-4">
          Click any colored region of the cortex/brainstem to inspect localized properties.
        </p>
      </div>

      {/* Info Panel */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: lobe.color }} />
            <h3 className="text-2xl font-bold">{lobe.name}</h3>
          </div>
          <p className="text-[#9AA5B6] text-sm leading-relaxed">{lobe.description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-[#7C8798] uppercase tracking-wider mb-2">Primary Functions</h4>
            <ul className="grid grid-cols-1 gap-1.5">
              {lobe.functions.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-[#E7ECF3]">
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#7C8798] uppercase tracking-wider mb-2">Key Tumor Susceptibilities</h4>
            <div className="flex flex-wrap gap-2">
              {lobe.tumorTypes.map((t, i) => (
                <span key={i} className="px-2 py-1 rounded bg-white/[0.04] border border-white/5 text-[11px] font-semibold text-[#2DD4BF]">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06]">
            <h4 className="text-xs font-semibold text-[#FB6B5B] uppercase tracking-wider mb-2">Associated Clinical Symptoms</h4>
            <ul className="grid grid-cols-1 gap-1.5">
              {lobe.symptoms.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#e0a8a1]">
                  <span className="text-[#FB6B5B] font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
