'use client';

import { useState, useEffect, useRef } from 'react';

interface CaseStudy {
  id: string;
  name: string;
  type: string;
  volume: number;
  sliceRange: [number, number];
  peakSize: number;
  description: string;
  tumorCoords: { x: number; y: number };
}

const CASES: CaseStudy[] = [
  {
    id: 'gbm',
    name: 'Case #201: Glioblastoma Multiforme',
    type: 'Glioma',
    volume: 24.6,
    sliceRange: [3, 9],
    peakSize: 45,
    tumorCoords: { x: 260, y: 150 },
    description: 'High-grade temporal lobe tumor showing necrotic core with surrounding vasogenic edema.',
  },
  {
    id: 'pit',
    name: 'Case #304: Pituitary Adenoma',
    type: 'Pituitary',
    volume: 8.2,
    sliceRange: [5, 8],
    peakSize: 22,
    tumorCoords: { x: 200, y: 190 },
    description: 'Benign sellar mass with suprasellar extension, causing compression of the optic chiasm.',
  },
];

export default function MriVolumeSimulator() {
  const [selectedCase, setSelectedCase] = useState<string>('gbm');
  const [currentSlice, setCurrentSlice] = useState<number>(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const activeCase = CASES.find(c => c.id === selectedCase) || CASES[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions
    canvas.width = 400;
    canvas.height = 400;

    // Draw background
    ctx.fillStyle = '#080B11';
    ctx.fillRect(0, 0, 400, 400);

    // Draw Grid Lines (Clinical Style)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 400; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 400);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(400, i);
      ctx.stroke();
    }

    // Draw Brain outline (simulating axial slice)
    ctx.fillStyle = 'rgba(43, 51, 68, 0.15)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(200, 200, 140, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Ventricles (dark butterfly shapes in the center)
    ctx.fillStyle = '#05070a';
    ctx.beginPath();
    // Left ventricle
    ctx.moveTo(190, 160);
    ctx.bezierCurveTo(160, 150, 160, 250, 190, 240);
    ctx.bezierCurveTo(180, 210, 180, 190, 190, 160);
    // Right ventricle
    ctx.moveTo(210, 160);
    ctx.bezierCurveTo(240, 150, 240, 250, 210, 240);
    ctx.bezierCurveTo(220, 210, 220, 190, 210, 160);
    ctx.fill();

    // Draw Tumor slice if slice is in range
    const [minSlice, maxSlice] = activeCase.sliceRange;
    const isVisible = currentSlice >= minSlice && currentSlice <= maxSlice;
    
    if (isVisible) {
      // Calculate tumor size factor depending on proximity to peak slice (middle)
      const midSlice = (minSlice + maxSlice) / 2;
      const distFromCenter = Math.abs(currentSlice - midSlice);
      const sizeMultiplier = Math.max(0.1, 1 - distFromCenter / (maxSlice - midSlice + 1));
      const tumorRadius = activeCase.peakSize * sizeMultiplier;

      const { x, y } = activeCase.tumorCoords;

      // Draw Edema (outer blurry circle)
      const edemaGrad = ctx.createRadialGradient(x, y, 2, x, y, tumorRadius * 1.6);
      edemaGrad.addColorStop(0, 'rgba(129, 140, 248, 0.2)');
      edemaGrad.addColorStop(1, 'rgba(129, 140, 248, 0)');
      ctx.fillStyle = edemaGrad;
      ctx.beginPath();
      ctx.arc(x, y, tumorRadius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Draw Tumor Mass (solid inner circle)
      const tumorGrad = ctx.createRadialGradient(x, y, 2, x, y, tumorRadius);
      tumorGrad.addColorStop(0, '#FB6B5B');
      tumorGrad.addColorStop(0.7, '#e85c4c');
      tumorGrad.addColorStop(1, 'rgba(251, 107, 91, 0.5)');
      ctx.fillStyle = tumorGrad;
      ctx.beginPath();
      ctx.arc(x, y, tumorRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw AI Bounding Box overlay
      ctx.strokeStyle = '#2DD4BF';
      ctx.lineWidth = 1.5;
      const boxSize = tumorRadius * 2.6;
      const bx = x - boxSize / 2;
      const by = y - boxSize / 2;
      ctx.strokeRect(bx, by, boxSize, boxSize);

      // Box tag
      ctx.fillStyle = '#2DD4BF';
      ctx.fillRect(bx, by - 16, 120, 16);
      ctx.fillStyle = '#04140F';
      ctx.font = 'bold 9px monospace';
      const conf = (0.95 - distFromCenter * 0.03).toFixed(2);
      ctx.fillText(`${activeCase.type} ${conf}`, bx + 4, by - 5);
    }
  }, [selectedCase, currentSlice]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Simulation Viewport */}
      <div className="lg:col-span-2 flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.01] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-black/25">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] animate-pulse" />
            <span className="text-xs font-semibold tracking-wide font-[family-name:var(--font-geist-mono)]">VOLUMETRIC SLICE SCRUBBER</span>
          </div>
          <span className="text-xs font-semibold text-[#2DD4BF] font-[family-name:var(--font-geist-mono)]">
            SLICE {currentSlice} / 12
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center bg-black/40 p-4 min-h-[350px]">
          <canvas ref={canvasRef} className="w-full max-w-[350px] aspect-square rounded-lg border border-white/[0.06]" />
        </div>

        <div className="px-6 py-5 border-t border-white/[0.08] bg-black/20 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#9AA5B6]">Axial Axis Coordinate (Z-axis)</span>
            <span className="font-[family-name:var(--font-geist-mono)] text-[#2DD4BF]">Z = {(currentSlice * 1.25).toFixed(2)} mm</span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            value={currentSlice}
            onChange={(e) => setCurrentSlice(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2DD4BF]"
          />
        </div>
      </div>

      {/* Volumetric Metrics Sidebar */}
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-5">
          <h3 className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#2DD4BF] tracking-wide">CASE INFORMATION</h3>
          
          <select
            value={selectedCase}
            onChange={(e) => {
              setSelectedCase(e.target.value);
              setCurrentSlice(5);
            }}
            className="w-full bg-black/35 border border-white/10 rounded-xl px-4 py-3 text-xs text-[#E7ECF3] focus:outline-none focus:border-[#2DD4BF]/50"
          >
            {CASES.map(c => (
              <option key={c.id} value={c.id} className="bg-[#0B0F17]">{c.name}</option>
            ))}
          </select>

          <p className="text-xs text-[#9AA5B6] leading-relaxed">{activeCase.description}</p>

          <div className="pt-4 border-t border-white/[0.06] space-y-4 font-[family-name:var(--font-geist-mono)] text-xs">
            <div className="flex justify-between">
              <span className="text-[#7C8798]">Est. Tumor Volume</span>
              <span className="font-semibold text-white">{activeCase.volume} cc</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7C8798]">Slice Penetration</span>
              <span className="font-semibold text-white">
                Slices {activeCase.sliceRange[0]} – {activeCase.sliceRange[1]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7C8798]">Peak Slice Diameter</span>
              <span className="font-semibold text-white">{activeCase.peakSize} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7C8798]">Coordinates (X, Y)</span>
              <span className="font-semibold text-white">
                ({activeCase.tumorCoords.x}, {activeCase.tumorCoords.y})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
