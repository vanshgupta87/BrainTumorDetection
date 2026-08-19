'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';
import ImagePreview from '@/components/ImagePreview';
import Button from '@/components/Button';
import Card from '@/components/Card';
import LoadingSpinner from '@/components/LoadingSpinner';
import AnalysisProgress from '@/components/AnalysisProgress';
import { predictTumor, APIError } from '@/lib/api';
import { formatFileSize } from '@/lib/utils';

export default function DetectPage() {
  const router = useRouter();
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
    <div className="min-h-screen bg-[#080B11] text-[#E7ECF3]">
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
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080B11]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
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

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <p className="font-[family-name:var(--font-geist-mono)] text-[12px] text-[#2DD4BF] tracking-wide mb-3">
            UPLOAD · ANALYZE · CLASSIFY
          </p>
          <h2 className="text-4xl font-semibold tracking-tight mb-3">Upload MRI Scan</h2>
          <p className="text-[#9AA5B6] text-lg">Upload a brain MRI image to detect and classify tumors</p>
        </div>

        {!selectedFile ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2">
            <ImageUpload onImageSelect={handleImageSelect} disabled={isProcessing} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Selected Image</h3>
                <button
                  onClick={handleReset}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border border-white/10 text-[#9AA5B6] hover:text-white hover:border-white/20 transition-colors disabled:opacity-40"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Upload different image
                </button>
              </div>

              <div className="rounded-lg border border-white/[0.06] bg-black/30 px-4 py-3 mb-4">
                <div className="flex items-center gap-3 text-sm text-[#9AA5B6] font-[family-name:var(--font-geist-mono)]">
                  <svg className="w-4 h-4 text-[#2DD4BF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-[#E7ECF3]">{selectedFile.name}</span>
                  <span className="text-[#5B6577]">({formatFileSize(selectedFile.size)})</span>
                </div>
              </div>

              {previewUrl && (
                <div className="rounded-lg overflow-hidden border border-white/[0.06]">
                  <ImagePreview imageUrl={previewUrl} />
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-2xl border border-[#FB6B5B]/30 bg-[#FB6B5B]/[0.06] p-5">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#FB6B5B] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#FB6B5B] mb-1">Error</h4>
                    <p className="text-[#e0a8a1] text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!isProcessing && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                  <h4 className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#7C8798] tracking-wide mb-4">
                    SELECT AI MODEL
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setModelVersion('nano')}
                      className={`relative flex flex-col items-center justify-center p-5 rounded-xl border transition-all duration-200 ${
                        modelVersion === 'nano'
                          ? 'border-[#2DD4BF]/50 bg-[#2DD4BF]/[0.06] shadow-[0_0_30px_-12px_rgba(45,212,191,0.5)]'
                          : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      {modelVersion === 'nano' && (
                        <span
                          className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#2DD4BF] anim-pulse"
                          style={{ animation: 'pulseDot 1.8s ease-in-out infinite' }}
                        />
                      )}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                          modelVersion === 'nano' ? 'bg-[#2DD4BF]/15' : 'bg-white/[0.05]'
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 ${modelVersion === 'nano' ? 'text-[#2DD4BF]' : 'text-[#7C8798]'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span className={`font-semibold ${modelVersion === 'nano' ? 'text-[#2DD4BF]' : 'text-[#E7ECF3]'}`}>
                        YOLOv8 Nano
                      </span>
                      <span className="text-xs mt-1 text-[#7C8798] font-[family-name:var(--font-geist-mono)]">
                        SPEED · ~18ms
                      </span>
                    </button>

                    <button
                      onClick={() => setModelVersion('medium')}
                      className={`relative flex flex-col items-center justify-center p-5 rounded-xl border transition-all duration-200 ${
                        modelVersion === 'medium'
                          ? 'border-[#FB6B5B]/50 bg-[#FB6B5B]/[0.06] shadow-[0_0_30px_-12px_rgba(251,107,91,0.5)]'
                          : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      {modelVersion === 'medium' && (
                        <span
                          className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#FB6B5B] anim-pulse"
                          style={{ animation: 'pulseDot 1.8s ease-in-out infinite' }}
                        />
                      )}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                          modelVersion === 'medium' ? 'bg-[#FB6B5B]/15' : 'bg-white/[0.05]'
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 ${modelVersion === 'medium' ? 'text-[#FB6B5B]' : 'text-[#7C8798]'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className={`font-semibold ${modelVersion === 'medium' ? 'text-[#FB6B5B]' : 'text-[#E7ECF3]'}`}>
                        YOLOv8 Medium
                      </span>
                      <span className="text-xs mt-1 text-[#7C8798] font-[family-name:var(--font-geist-mono)]">
                        ACCURACY · ~47ms
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#2DD4BF] text-[#04140F] font-semibold hover:bg-[#5EEAD4] transition-colors shadow-[0_0_40px_-10px_rgba(45,212,191,0.6)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Analyze MRI Scan
                </button>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <h3 className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#2DD4BF] tracking-wide mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            INSTRUCTIONS
          </h3>
          <ul className="space-y-3 text-[#9AA5B6] text-sm">
            <li className="flex items-start gap-3">
              <span className="font-[family-name:var(--font-geist-mono)] text-[#2DD4BF]">01</span>
              <span>Upload a clear brain MRI image in JPEG, PNG, or WebP format</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-[family-name:var(--font-geist-mono)] text-[#2DD4BF]">02</span>
              <span>Ensure the image is well-lit and the brain tissue is clearly visible</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-[family-name:var(--font-geist-mono)] text-[#2DD4BF]">03</span>
              <span>Click &quot;Analyze MRI Scan&quot; to detect tumors</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-[family-name:var(--font-geist-mono)] text-[#2DD4BF]">04</span>
              <span>View the detection results with bounding boxes and classifications</span>
            </li>
          </ul>
        </div>
      </main>

      <AnalysisProgress isProcessing={isProcessing} />
    </div>
  );
}