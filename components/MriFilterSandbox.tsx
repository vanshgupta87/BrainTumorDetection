'use client';

import { useState, useRef } from 'react';

type PresetFilter = 'normal' | 'invert' | 'thermal' | 'edge';

export default function MriFilterSandbox() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [activeFilter, setActiveFilter] = useState<PresetFilter>('normal');
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        resetAdjustments();
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setActiveFilter('normal');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - panX, y: e.clientY - panY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.current.x);
    setPanY(e.clientY - dragStart.current.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getFilterStyle = () => {
    let filterString = `brightness(${brightness}%) contrast(${contrast}%)`;
    if (activeFilter === 'invert') {
      filterString += ' invert(100%)';
    } else if (activeFilter === 'thermal') {
      filterString += ' url(#thermal-filter)';
    } else if (activeFilter === 'edge') {
      filterString += ' url(#edge-filter)';
    }
    return filterString;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="thermal-filter">
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0 0 0.5 1 1 1 0.5" />
              <feFuncG type="table" tableValues="0 0 0 0 0.5 1 1" />
              <feFuncB type="table" tableValues="0.5 1 1 0 0 0 0" />
            </feComponentTransfer>
          </filter>
          <filter id="edge-filter">
            <feConvolveMatrix
              order="3"
              kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1"
              preserveAlpha="true"
            />
          </filter>
        </defs>
      </svg>

      <div className="lg:col-span-2 flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.01] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-black/25">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] animate-pulse" />
            <span className="text-sm font-semibold tracking-wide font-[family-name:var(--font-geist-mono)]">RADIOLOGY SANDBOX</span>
          </div>
          {selectedImage && (
            <button
              onClick={resetAdjustments}
              className="text-xs text-[#7C8798] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Console
            </button>
          )}
        </div>

        <div
          className={`relative flex-1 min-h-[400px] flex items-center justify-center bg-black/40 overflow-hidden select-none ${zoom > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {selectedImage ? (
            <div
              className="transition-transform duration-75"
              style={{
                transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
                filter: getFilterStyle(),
              }}
            >
              <img
                src={selectedImage}
                alt="Radiology scan"
                className="max-h-[450px] w-auto object-contain rounded-lg pointer-events-none"
              />
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center mx-auto mb-4 text-[#7C8798]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-semibold mb-1">Load MRI Scan into Sandbox</p>
              <p className="text-xs text-[#7C8798] mb-4">Enhance contrast, map colors, and magnify structures</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2DD4BF] text-[#04140F] hover:bg-[#5EEAD4] transition-colors"
              >
                Choose File
              </button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-6">
          <h3 className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#2DD4BF] tracking-wide">IMAGE ENHANCEMENT</h3>

          <div className="space-y-3">
            <label className="text-xs text-[#7C8798] font-medium">VISUALIZATION PRESETS</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'normal', name: 'Original' },
                { id: 'invert', name: 'High Contrast' },
                { id: 'thermal', name: 'Thermal Map' },
                { id: 'edge', name: 'Edge Outline' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as PresetFilter)}
                  disabled={!selectedImage}
                  className={`px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none ${
                    activeFilter === filter.id
                      ? 'bg-[#2DD4BF]/10 border-[#2DD4BF] text-[#2DD4BF]'
                      : 'bg-black/20 border-white/5 text-[#9AA5B6] hover:bg-white/[0.02]'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/[0.06]">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#9AA5B6]">Brightness</span>
                <span className="font-[family-name:var(--font-geist-mono)] text-[#2DD4BF]">{brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                value={brightness}
                disabled={!selectedImage}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2DD4BF] disabled:opacity-40"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#9AA5B6]">Contrast</span>
                <span className="font-[family-name:var(--font-geist-mono)] text-[#2DD4BF]">{contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                value={contrast}
                disabled={!selectedImage}
                onChange={(e) => setContrast(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2DD4BF] disabled:opacity-40"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#9AA5B6]">Magnification</span>
                <span className="font-[family-name:var(--font-geist-mono)] text-[#2DD4BF]">{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                disabled={!selectedImage}
                onChange={(e) => {
                  const z = parseFloat(e.target.value);
                  setZoom(z);
                  if (z === 1) {
                    setPanX(0);
                    setPanY(0);
                  }
                }}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2DD4BF] disabled:opacity-40"
              />
            </div>
          </div>
        </div>

        {selectedImage && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/[0.05] transition-colors"
          >
            Upload Different MRI
          </button>
        )}
      </div>
    </div>
  );
}
