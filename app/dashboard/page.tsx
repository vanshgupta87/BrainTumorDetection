'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';
import ImagePreview from '@/components/ImagePreview';
import AnalysisProgress from '@/components/AnalysisProgress';
import MriFilterSandbox from '@/components/MriFilterSandbox';
import MriVolumeSimulator from '@/components/MriVolumeSimulator';
import BrainAnatomyViewer from '@/components/BrainAnatomyViewer';
import SymptomCorrelation from '@/components/SymptomCorrelation';
import { predictTumor, APIError } from '@/lib/api';
import { formatFileSize } from '@/lib/utils';

type Tab = 'diagnosis' | 'sandbox' | 'volumetric' | 'anatomy' | 'symptoms';

const TAB_ITEMS = [
  {
    id: 'diagnosis',
    name: 'AI MRI Diagnosis',
    shortName: 'AI Detect',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
      </svg>
    ),
    desc: 'YOLOv8 tumor detection',
  },
  {
    id: 'sandbox',
    name: 'Radiology Sandbox',
    shortName: 'Sandbox',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    desc: 'Contrast & filters editor',
  },
  {
    id: 'volumetric',
    name: 'Volumetric Simulator',
    shortName: 'Volumetric',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    desc: 'Axial multi-slice scrubber',
  },
  {
    id: 'anatomy',
    name: 'Anatomy Explorer',
    shortName: 'Anatomy',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    desc: 'Interactive brain map',
  },
  {
    id: 'symptoms',
    name: 'Symptom Correlation',
    shortName: 'Symptoms',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    desc: 'Anatomical symptom mapping',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('diagnosis');

  // AI Detection State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelVersion, setModelVersion] = useState<'nano' | 'medium'>('medium');

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await predictTumor(selectedFile, modelVersion);

      if (result.success) {
        localStorage.setItem('detectionResult', JSON.stringify(result));
        localStorage.setItem('detectionImage', previewUrl || '');
        router.push('/result');
      } else {
        setError(result.error || 'Prediction failed');
      }
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Detection error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-[#E7ECF3] flex flex-col pb-20 md:pb-0">
      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
        @media (prefers-reduced-motion: reduce) {
          .anim-pulse { animation: none !important; }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080B11]/80 backdrop-blur-xl shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative w-9 h-9 rounded-lg border border-[#2DD4BF]/40 bg-[#0F1520] flex items-center justify-center">
              <span
                className="absolute inset-0 rounded-lg border border-[#2DD4BF]/20 anim-pulse"
                style={{ animation: 'pulseDot 2.4s ease-in-out infinite' }}
              />
              <svg className="w-5 h-5 text-[#2DD4BF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold tracking-tight leading-none">NeuroSight</p>
              <p className="text-[11px] text-[#7C8798] font-[family-name:var(--font-geist-mono)] tracking-wide mt-1">
                CLINICAL DIAGNOSTIC SUITE
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

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Navigation Sidebar (Desktop) */}
        <aside className="hidden md:flex md:w-64 shrink-0 flex-col gap-2">
          <div className="text-[10px] font-semibold text-[#7C8798] tracking-widest uppercase px-3 mb-2 font-[family-name:var(--font-geist-mono)]">
            Medical Facilities
          </div>
          {TAB_ITEMS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-start gap-3.5 p-3 rounded-xl border text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/30 text-white shadow-[0_0_20px_-10px_rgba(45,212,191,0.3)]'
                    : 'bg-transparent border-transparent text-[#9AA5B6] hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-[#2DD4BF]/15 text-[#2DD4BF]' : 'bg-white/[0.04]'}`}>
                  {tab.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold">{tab.name}</div>
                  <div className="text-[10px] text-[#7C8798] mt-0.5">{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Tab Workspace Panel */}
        <main className="flex-1 min-w-0">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 md:p-8 min-h-[500px]">
            {/* 1. AI MRI Diagnosis */}
            {activeTab === 'diagnosis' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1">AI Brain Tumor Detector</h2>
                  <p className="text-xs md:text-sm text-[#9AA5B6]">Upload an MRI scan to detect and localize glioma, meningioma, or pituitary tumors.</p>
                </div>

                {!selectedFile ? (
                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-1 md:p-2">
                    <ImageUpload onImageSelect={handleImageSelect} disabled={isProcessing} />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-white/[0.06] bg-black/30 p-4 md:p-6">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                        <h3 className="text-sm md:text-md font-semibold">Selected Image Slice</h3>
                        <button
                          onClick={handleReset}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border border-white/10 text-[#9AA5B6] hover:text-white hover:border-white/20 transition-colors disabled:opacity-40"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Change Slice
                        </button>
                      </div>

                      <div className="rounded-lg border border-white/[0.06] bg-black/40 px-4 py-2.5 mb-4">
                        <div className="flex items-center gap-3 text-xs text-[#9AA5B6] font-[family-name:var(--font-geist-mono)]">
                          <svg className="w-3.5 h-3.5 text-[#2DD4BF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-[#E7ECF3] truncate max-w-[150px] sm:max-w-xs">{selectedFile.name}</span>
                          <span className="text-[#5B6577]">({formatFileSize(selectedFile.size)})</span>
                        </div>
                      </div>

                      {previewUrl && (
                        <div className="rounded-lg overflow-hidden border border-white/[0.06] bg-black/40 max-w-md mx-auto">
                          <ImagePreview imageUrl={previewUrl} />
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="rounded-xl border border-[#FB6B5B]/30 bg-[#FB6B5B]/[0.06] p-4">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-[#FB6B5B] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <h4 className="font-semibold text-[#FB6B5B] text-sm mb-0.5">Analysis Connection Error</h4>
                            <p className="text-[#e0a8a1] text-xs">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {!isProcessing && (
                      <div className="space-y-6">
                        <div className="rounded-xl border border-white/[0.08] bg-black/25 p-4 md:p-5">
                          <h4 className="font-[family-name:var(--font-geist-mono)] text-[10px] text-[#7C8798] tracking-widest mb-4">SELECT DETECTION MODEL</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={() => setModelVersion('nano')}
                              className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                                modelVersion === 'nano'
                                  ? 'border-[#2DD4BF]/50 bg-[#2DD4BF]/[0.06] shadow-[0_0_20px_-10px_rgba(45,212,191,0.4)]'
                                  : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.01]'
                              }`}
                            >
                              <span className="font-semibold text-sm">YOLOv8 Nano</span>
                              <span className="text-[10px] mt-1 text-[#7C8798] font-[family-name:var(--font-geist-mono)]">SPEED · ~18ms</span>
                            </button>
                            <button
                              onClick={() => setModelVersion('medium')}
                              className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                                modelVersion === 'medium'
                                  ? 'border-[#FB6B5B]/50 bg-[#FB6B5B]/[0.06] shadow-[0_0_20px_-10px_rgba(251,107,91,0.4)]'
                                  : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.01]'
                              }`}
                            >
                              <span className="font-semibold text-sm">YOLOv8 Medium</span>
                              <span className="text-[10px] mt-1 text-[#7C8798] font-[family-name:var(--font-geist-mono)]">ACCURACY · ~47ms</span>
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={handleAnalyze}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#2DD4BF] text-[#04140F] font-bold hover:bg-[#5EEAD4] transition-colors shadow-[0_0_40px_-10px_rgba(45,212,191,0.6)] animate-none md:animate-pulse"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                          </svg>
                          Execute Tumor Inference
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. Radiology Sandbox */}
            {activeTab === 'sandbox' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1">Radiology Enhancement Console</h2>
                  <p className="text-xs md:text-sm text-[#9AA5B6]">Adjust visual metrics, zoom in on key coordinates, and apply advanced spectral colormaps.</p>
                </div>
                <MriFilterSandbox />
              </div>
            )}

            {/* 3. Volumetric Simulator */}
            {activeTab === 'volumetric' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1">3D Volumetric Slice Simulator</h2>
                  <p className="text-xs md:text-sm text-[#9AA5B6]">Scrub through MRI slice layers to compute estimated tumor volumes and coordinates.</p>
                </div>
                <MriVolumeSimulator />
              </div>
            )}

            {/* 4. Anatomy Explorer */}
            {activeTab === 'anatomy' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1">Brain Anatomy Explorer</h2>
                  <p className="text-xs md:text-sm text-[#9AA5B6]">Map functional areas of the cerebral cortex and read typical localization details.</p>
                </div>
                <BrainAnatomyViewer />
              </div>
            )}

            {/* 5. Symptom Correlation */}
            {activeTab === 'symptoms' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1">Clinical Symptom Mapper</h2>
                  <p className="text-xs md:text-sm text-[#9AA5B6]">Tick presenting patient indicators to compute statistical cortical localizations.</p>
                </div>
                <SymptomCorrelation />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar (App-Style Navigation) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080B11]/90 backdrop-blur-xl border-t border-white/[0.08] flex justify-around py-2 px-3 md:hidden">
        {TAB_ITEMS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex flex-col items-center justify-center py-1 select-none ${
                isActive ? 'text-[#2DD4BF]' : 'text-[#7C8798]'
              }`}
            >
              {tab.icon}
              <span className="text-[9px] font-semibold mt-1">{tab.shortName}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] shrink-0 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-xs text-[#5B6577]">
          © 2026 NeuroSight Suite — Strictly for research & educational purposes.
        </div>
      </footer>

      <AnalysisProgress isProcessing={isProcessing} />
    </div>
  );
}
