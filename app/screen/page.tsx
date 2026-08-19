'use client';

import Link from 'next/link';

const SCREENING_TYPES = [
  {
    id: 'brain',
    name: 'Brain Tumor',
    desc: 'Glioma, Meningioma, Pituitary — MRI-based YOLOv8 detection',
    accent: '#2DD4BF',
    href: '/detect',
    active: true,
  },
  {
    id: 'lung',
    name: 'Lung Cancer',
    desc: 'CT-based nodule detection',
    accent: '#818CF8',
    href: '#',
    active: false,
  },
  {
    id: 'skin',
    name: 'Skin Cancer',
    desc: 'Dermoscopy image classification',
    accent: '#F5A623',
    href: '#',
    active: false,
  },
  {
    id: 'breast',
    name: 'Breast Cancer',
    desc: 'Mammogram lesion detection',
    accent: '#FB6B5B',
    href: '#',
    active: false,
  },
];

export default function ScreenSelectPage() {
  return (
    <div className="min-h-screen bg-[#080B11] text-[#E7ECF3]">
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080B11]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-lg border border-[#2DD4BF]/40 bg-[#0F1520] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#2DD4BF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold tracking-tight">NeuroSight</p>
          </Link>
          <Link href="/history" className="text-sm font-medium text-[#9AA5B6] hover:text-white transition-colors">
            History
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <p className="font-[family-name:var(--font-geist-mono)] text-[12px] text-[#2DD4BF] tracking-wide mb-2 text-center">
          SELECT SCREENING TYPE
        </p>
        <h2 className="text-4xl font-semibold tracking-tight mb-3 text-center">What are you checking today?</h2>
        <p className="text-[#9AA5B6] text-center mb-12 max-w-xl mx-auto">
          Choose a screening model. Only Brain Tumor detection is trained and active right now — the rest are on the
          roadmap.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {SCREENING_TYPES.map((s) => {
            const card = (
              <div
                className={`relative rounded-2xl border p-6 h-full transition-all ${
                  s.active
                    ? 'border-white/[0.1] bg-white/[0.02] hover:border-white/20 cursor-pointer'
                    : 'border-white/[0.06] bg-white/[0.01] opacity-50 cursor-not-allowed'
                }`}
              >
                {!s.active && (
                  <span className="absolute top-4 right-4 text-[10px] font-[family-name:var(--font-geist-mono)] px-2 py-1 rounded-md border border-white/10 text-[#7C8798] tracking-wide">
                    COMING SOON
                  </span>
                )}
                <span className="w-2.5 h-2.5 rounded-full inline-block mb-4" style={{ backgroundColor: s.accent }} />
                <h3 className="text-lg font-semibold mb-1">{s.name}</h3>
                <p className="text-sm text-[#7C8798]">{s.desc}</p>
              </div>
            );
            return s.active ? (
              <Link key={s.id} href={s.href}>
                {card}
              </Link>
            ) : (
              <div key={s.id}>{card}</div>
            );
          })}
        </div>
      </main>
    </div>
  );
}