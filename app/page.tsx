import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080B11] text-[#E7ECF3]">
      <style>{`
        @keyframes scanline {
          0%   { transform: translateY(0);    opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translateY(300px); opacity: 0; }
        }
        @keyframes bboxIn {
          0%, 15%   { opacity: 0; transform: scale(1.04); }
          25%, 88%  { opacity: 1; transform: scale(1); }
          100%      { opacity: 0; transform: scale(1.04); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
        @keyframes drift {
          0%   { transform: translate(0, 0) rotate(0deg); }
          50%  { transform: translate(6px, -8px) rotate(2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .anim-scan, .anim-bbox, .anim-pulse, .anim-drift { animation: none !important; }
        }
      `}</style>

      {/* ============ HEADER ============ */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#080B11]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-lg border border-[#2DD4BF]/40 bg-[#0F1520] flex items-center justify-center">
              <span className="absolute inset-0 rounded-lg border border-[#2DD4BF]/20 anim-pulse" style={{ animation: 'pulseDot 2.4s ease-in-out infinite' }} />
              <svg className="w-5 h-5 text-[#2DD4BF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold tracking-tight leading-none">NeuroSight</p>
              <p className="text-[11px] text-[#7C8798] font-[family-name:var(--font-geist-mono)] tracking-wide mt-1">TUMOR DETECTION SYSTEM</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-white text-[#080B11] hover:bg-[#2DD4BF] transition-colors"
          >
            Start Analysis
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {/* ============ HERO ============ */}
        <section className="grid lg:grid-cols-2 gap-14 items-center pt-16 pb-24">
          <div>
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] anim-pulse" style={{ animation: 'pulseDot 1.8s ease-in-out infinite' }} />
              <span className="text-[12px] font-[family-name:var(--font-geist-mono)] text-[#9AA5B6] tracking-wide">YOLOv8 · REAL-TIME INFERENCE</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.05] mb-6">
              See what the
              <br />
              scan is hiding.
            </h1>

            <p className="text-lg text-[#9AA5B6] leading-relaxed mb-9 max-w-md">
              Upload an MRI slice and NeuroSight locates and classifies glioma,
              meningioma, and pituitary tumors in a single pass — with the
              confidence score to back it up.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2DD4BF] text-[#04140F] font-semibold hover:bg-[#5EEAD4] transition-colors shadow-[0_0_40px_-10px_rgba(45,212,191,0.6)]"
              >
                Run a scan
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a href="#classes" className="text-sm font-medium text-[#9AA5B6] hover:text-white transition-colors">
                View detectable classes →
              </a>
            </div>
          </div>

          {/* Signature element: live-look detection viewport */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="relative aspect-[4/5] rounded-2xl border border-white/10 bg-[#0B0F17] overflow-hidden shadow-[0_0_80px_-20px_rgba(45,212,191,0.25)]">
              {/* grid */}
              <div
                className="absolute inset-0 opacity-[0.12] pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(#2DD4BF 1px, transparent 1px), linear-gradient(90deg, #2DD4BF 1px, transparent 1px)',
                  backgroundSize: '22px 22px',
                }}
              />

              {/* mock brain slice */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="relative w-52 h-52 anim-drift"
                  style={{ animation: 'drift 9s ease-in-out infinite' }}
                >
                  <div className="absolute inset-0 rounded-[48%_52%_58%_42%/54%_46%_58%_42%] bg-gradient-to-br from-[#3A4152] via-[#232936] to-[#12161f]" />
                  <div className="absolute inset-3 rounded-[45%_55%_50%_50%/50%_55%_45%_50%] bg-gradient-to-tr from-[#464e60] via-[#2b3140] to-[#181c26] opacity-90" />
                  <div className="absolute inset-8 rounded-[55%_45%_45%_55%/45%_55%_50%_50%] bg-[#20242f] opacity-80" />
                </div>
              </div>

              {/* bounding box */}
              <div
                className="absolute left-[38%] top-[34%] w-24 h-20 anim-bbox"
                style={{ animation: 'bboxIn 4.5s ease-in-out infinite' }}
              >
                <div className="absolute inset-0 border-2 border-[#FB6B5B] rounded-[2px]" />
                <span className="absolute -top-[22px] left-0 px-1.5 py-0.5 rounded-sm bg-[#FB6B5B] text-[#1A0705] text-[10px] font-[family-name:var(--font-geist-mono)] font-medium tracking-tight whitespace-nowrap">
                  glioma · 0.942
                </span>
              </div>

              {/* scanline */}
              <div
                className="absolute left-0 right-0 h-[2px] bg-[#2DD4BF] anim-scan"
                style={{
                  animation: 'scanline 3.2s linear infinite',
                  boxShadow: '0 0 16px 3px rgba(45,212,191,0.7)',
                }}
              />

              {/* corner brackets */}
              {[
                'top-3 left-3 border-t-2 border-l-2',
                'top-3 right-3 border-t-2 border-r-2',
                'bottom-3 left-3 border-b-2 border-l-2',
                'bottom-3 right-3 border-b-2 border-r-2',
              ].map((pos, i) => (
                <div key={i} className={`absolute w-4 h-4 border-white/25 ${pos}`} />
              ))}

              {/* HUD readouts */}
              <div className="absolute top-3 left-9 font-[family-name:var(--font-geist-mono)] text-[9px] text-[#7C8798] tracking-wide">
                MODEL · yolov8m
              </div>
              <div className="absolute top-3 right-9 font-[family-name:var(--font-geist-mono)] text-[9px] text-[#7C8798] tracking-wide">
                42 FPS
              </div>
              <div className="absolute bottom-3 left-9 font-[family-name:var(--font-geist-mono)] text-[9px] text-[#7C8798] tracking-wide">
                FRAME 0842
              </div>
              <div className="absolute bottom-3 right-9 font-[family-name:var(--font-geist-mono)] text-[9px] text-[#34D399] tracking-wide flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#34D399]" />
                LIVE
              </div>
            </div>
          </div>
        </section>

        {/* ============ HUD STAT STRIP ============ */}
        <section className="grid grid-cols-2 sm:grid-cols-4 border-y border-white/[0.07] py-8 mb-24">
          {[
            { label: 'CLASSES', value: '04' },
            { label: 'MODEL VARIANTS', value: '02' },
            { label: 'INFERENCE', value: '<50ms' },
            { label: 'ARCHITECTURE', value: 'YOLOv8' },
          ].map((stat) => (
            <div key={stat.label} className="px-2">
              <p className="font-[family-name:var(--font-geist-mono)] text-2xl font-semibold text-white">{stat.value}</p>
              <p className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#7C8798] tracking-wide mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* ============ DETECTION CLASSES ============ */}
        <section id="classes" className="mb-28 scroll-mt-24">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="font-[family-name:var(--font-geist-mono)] text-[12px] text-[#2DD4BF] tracking-wide mb-2">OUTPUT LAYER</p>
              <h2 className="text-3xl font-semibold tracking-tight">What it detects</h2>
            </div>
            <p className="text-sm text-[#7C8798] max-w-xs">
              Every prediction ships with a class label and a confidence
              score, the same way it appears in the live viewer above.
            </p>
          </div>

          <div className="border border-white/[0.07] rounded-2xl divide-y divide-white/[0.07] overflow-hidden bg-white/[0.015]">
            {[
              { name: 'Glioma', desc: 'Tumors arising in the brain or spinal cord glial tissue', color: '#FB6B5B', conf: 94 },
              { name: 'Meningioma', desc: 'Tumors forming in the meninges membrane layers', color: '#F5A623', conf: 89 },
              { name: 'Pituitary', desc: 'Tumors located in the pituitary gland', color: '#818CF8', conf: 91 },
              { name: 'No Tumor', desc: 'Healthy brain tissue, no abnormality located', color: '#34D399', conf: 99 },
            ].map((c) => (
              <div key={c.name} className="flex items-center gap-5 px-6 py-5 hover:bg-white/[0.02] transition-colors">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <div className="w-32 shrink-0">
                  <p className="font-medium text-[15px]">{c.name}</p>
                </div>
                <p className="text-sm text-[#7C8798] flex-1 hidden sm:block">{c.desc}</p>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-24 h-1.5 rounded-full bg-white/[0.07] overflow-hidden hidden xs:block">
                    <div className="h-full rounded-full" style={{ width: `${c.conf}%`, backgroundColor: c.color }} />
                  </div>
                  <span className="font-[family-name:var(--font-geist-mono)] text-[13px] text-[#9AA5B6] w-10 text-right">{c.conf}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ ARCHITECTURE / MODEL SWITCH ============ */}
        <section className="mb-28">
          <p className="font-[family-name:var(--font-geist-mono)] text-[12px] text-[#2DD4BF] tracking-wide mb-2">SWITCHABLE ARCHITECTURE</p>
          <h2 className="text-3xl font-semibold tracking-tight mb-8">Pick your trade-off</h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-7">
              <div className="flex items-center justify-between mb-6">
                <p className="font-semibold text-lg">Nano</p>
                <span className="text-[11px] font-[family-name:var(--font-geist-mono)] px-2 py-1 rounded-md bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20">SPEED</span>
              </div>
              <dl className="space-y-3 font-[family-name:var(--font-geist-mono)] text-sm">
                <div className="flex justify-between"><dt className="text-[#7C8798]">Params</dt><dd>3.2M</dd></div>
                <div className="flex justify-between"><dt className="text-[#7C8798]">Inference</dt><dd>~18ms</dd></div>
                <div className="flex justify-between"><dt className="text-[#7C8798]">Best for</dt><dd>Live / batch triage</dd></div>
              </dl>
            </div>

            <div className="rounded-2xl border border-[#FB6B5B]/25 bg-white/[0.015] p-7">
              <div className="flex items-center justify-between mb-6">
                <p className="font-semibold text-lg">Medium</p>
                <span className="text-[11px] font-[family-name:var(--font-geist-mono)] px-2 py-1 rounded-md bg-[#FB6B5B]/10 text-[#FB6B5B] border border-[#FB6B5B]/20">ACCURACY</span>
              </div>
              <dl className="space-y-3 font-[family-name:var(--font-geist-mono)] text-sm">
                <div className="flex justify-between"><dt className="text-[#7C8798]">Params</dt><dd>25.9M</dd></div>
                <div className="flex justify-between"><dt className="text-[#7C8798]">Inference</dt><dd>~47ms</dd></div>
                <div className="flex justify-between"><dt className="text-[#7C8798]">Best for</dt><dd>Clinical-grade review</dd></div>
              </dl>
            </div>
          </div>
        </section>

        {/* ============ TECH STACK ============ */}
        <section className="mb-16">
          <p className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#7C8798] tracking-widest text-center mb-6">POWERED BY</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['YOLOv8 · Ultralytics', 'PyTorch', 'FastAPI', 'Next.js'].map((t) => (
              <span
                key={t}
                className="px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-[#9AA5B6] font-[family-name:var(--font-geist-mono)]"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-center text-[#5B6577] text-sm">
            © 2026 NeuroSight — research &amp; educational use only.
          </p>
        </div>
      </footer>
    </div>
  );
}