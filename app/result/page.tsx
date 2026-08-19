'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImagePreview from '@/components/ImagePreview';
import { PredictionResponse } from '@/types/api';
import { getTumorDescription } from '@/lib/utils';
import { generateResultPdf } from '@/lib/generatePdf';
import VoiceAssistant from '@/components/VoiceAssistant';

const TUMOR_ACCENT: Record<string, string> = {
  Glioma: '#FB6B5B',
  Meningioma: '#F5A623',
  Pituitary: '#818CF8',
  'No Tumor': '#34D399',
  Tumor: '#FB6B5B', // Added support for custom single-class trained model
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [filter, setFilter] = useState<'normal' | 'invert' | 'thermal'>('normal');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  useEffect(() => {
    const resultData = localStorage.getItem('detectionResult');
    const imageData = localStorage.getItem('detectionImage');

    if (!resultData || !imageData) {
      router.push('/detect');
      return;
    }

    try {
      setResult(JSON.parse(resultData));
      setImageUrl(imageData);
    } catch (error) {
      console.error('Error loading results:', error);
      router.push('/detect');
    }
  }, [router]);

  const handleNewScan = () => {
    localStorage.removeItem('detectionResult');
    localStorage.removeItem('detectionImage');
    router.push('/detect');
  };

  const handleDownloadPdf = () => {
    if (result && imageUrl) generateResultPdf(result, imageUrl);
  };

  if (!result || !imageUrl) {
    return (
      <div className="min-h-screen bg-[#080B11] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2DD4BF] mx-auto" />
          <p className="mt-4 text-[#7C8798] font-[family-name:var(--font-geist-mono)] text-sm">Loading results…</p>
        </div>
      </div>
    );
  }

  const tumorType = result.tumor_type ?? 'No Tumor';
  const accent = TUMOR_ACCENT[tumorType] || '#2DD4BF';

  return (
    <div className="min-h-screen bg-[#080B11] text-[#E7ECF3]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080B11]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-lg border border-[#2DD4BF]/40 bg-[#0F1520] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#2DD4BF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold tracking-tight leading-none">NeuroSight</p>
              <p className="text-[11px] text-[#7C8798] font-[family-name:var(--font-geist-mono)] tracking-wide mt-1">
                TUMOR DETECTION SYSTEM
              </p>
            </div>
          </Link>
          <Link
            href="/"
            className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-[#9AA5B6] hover:text-white hover:border-white/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-14 space-y-6">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#34D399]/30 bg-[#34D399]/[0.08] text-[#34D399] text-xs font-[family-name:var(--font-geist-mono)] tracking-wide mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
            ANALYSIS COMPLETE
          </div>
          <h2 className="text-4xl font-semibold tracking-tight mb-3">Detection Results</h2>
          <p className="text-[#9AA5B6] text-lg">AI-powered analysis of your brain MRI scan</p>
        </div>

        {/* Primary Result */}
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: `${accent}40`, background: `${accent}0D` }}>
          <p className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#7C8798] tracking-wide mb-3">
            DETECTED CONDITION
          </p>
          <div className="text-5xl font-bold mb-4" style={{ color: accent }}>
            {result.tumor_type}
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-[#9AA5B6]">Confidence</span>
            <span className="text-2xl font-semibold font-[family-name:var(--font-geist-mono)]">
              {(result.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full max-w-md mx-auto bg-white/[0.07] rounded-full h-2 mb-6">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${result.confidence * 100}%`, backgroundColor: accent }}
            />
          </div>
          <p className="text-[#9AA5B6] max-w-2xl mx-auto text-sm leading-relaxed">
            {getTumorDescription(result.tumor_type)}
          </p>
        </div>

        {/* Annotated Image & Workstation Controls */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <h3 className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#2DD4BF] tracking-wide mb-4">
            CLINICAL WORKSTATION VIEWPORT
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-lg overflow-hidden border border-white/[0.06] bg-black/30 flex items-center justify-center p-2">
              <ImagePreview
                imageUrl={imageUrl}
                boxes={result.boxes}
                alt="Detected tumor regions"
                filter={filter}
                brightness={brightness}
                contrast={contrast}
              />
            </div>
            {/* Control panel */}
            <div className="rounded-xl border border-white/[0.06] bg-black/25 p-5 space-y-5 flex flex-col justify-center">
              <h4 className="text-xs font-semibold text-[#7C8798] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">Workstation Console</h4>
              
              <div className="space-y-3">
                <label className="text-[10px] text-[#7C8798] font-[family-name:var(--font-geist-mono)] tracking-wider">SPECTRAL FILTERS</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'normal', name: 'Original' },
                    { id: 'invert', name: 'Invert' },
                    { id: 'thermal', name: 'Thermal' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id as any)}
                      className={`px-2 py-2 rounded-lg border text-[10px] font-semibold transition-all duration-200 ${
                        filter === f.id
                          ? 'bg-[#2DD4BF]/10 border-[#2DD4BF] text-[#2DD4BF]'
                          : 'bg-black/20 border-white/5 text-[#9AA5B6] hover:bg-white/[0.01]'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-3 border-t border-white/[0.06]">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#9AA5B6]">Brightness</span>
                    <span className="font-[family-name:var(--font-geist-mono)] text-[#2DD4BF]">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2DD4BF]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#9AA5B6]">Contrast</span>
                    <span className="font-[family-name:var(--font-geist-mono)] text-[#2DD4BF]">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2DD4BF]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detection Details */}
        {result.boxes.length > 0 && (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <h3 className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#2DD4BF] tracking-wide mb-4">
              DETECTION DETAILS
            </h3>
            <div className="divide-y divide-white/[0.06]">
              {result.boxes.map((box, index) => (
                <div key={index} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: TUMOR_ACCENT[box.label] || '#7C8798' }}
                    />
                    <span className="font-medium">{box.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold font-[family-name:var(--font-geist-mono)]">
                      {(box.score * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-[#5B6577] font-[family-name:var(--font-geist-mono)]">
                      ({Math.round(box.x1)}, {Math.round(box.y1)}) – ({Math.round(box.x2)}, {Math.round(box.y2)})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Stats */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <h3 className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#2DD4BF] tracking-wide mb-5">
            ANALYSIS INFORMATION
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Detections', value: String(result.boxes.length) },
              { label: 'Processing Time', value: `${result.inference_time?.toFixed(2) ?? 'N/A'}s` },
              {
                label: 'Image Resolution',
                value: result.image_shape ? `${result.image_shape[1]}×${result.image_shape[0]}` : 'N/A',
              },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-center">
                <div className="text-2xl font-semibold font-[family-name:var(--font-geist-mono)] text-[#2DD4BF] mb-1">
                  {s.value}
                </div>
                <div className="text-xs text-[#7C8798]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Voice Assistant */}
        <VoiceAssistant result={result} />

        {/* Disclaimer */}
        <div className="rounded-2xl border border-[#F5A623]/30 bg-[#F5A623]/[0.06] p-5">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-[#F5A623] mb-1">Medical Disclaimer</h4>
              <p className="text-sm text-[#d8c199]">
                This AI-powered analysis is for research and educational purposes only. It should not be used as a
                substitute for professional medical diagnosis. Always consult with qualified healthcare professionals.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleNewScan}
            className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2DD4BF] text-[#04140F] font-semibold hover:bg-[#5EEAD4] transition-colors shadow-[0_0_40px_-12px_rgba(45,212,191,0.6)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Analyze New Scan
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 text-[#E7ECF3] font-semibold hover:bg-white/[0.05] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF Report
          </button>
          <Link href="/" className="flex-1 min-w-[200px]">
            <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 text-[#E7ECF3] font-semibold hover:bg-white/[0.05] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}