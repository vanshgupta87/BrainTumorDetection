'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getHistory, deleteFromHistory, clearHistory, HistoryEntry } from '@/lib/history';
import { generateResultPdf } from '@/lib/generatePdf';

const TUMOR_ACCENT: Record<string, string> = {
  Glioma: '#FB6B5B',
  Meningioma: '#F5A623',
  Pituitary: '#818CF8',
  'No Tumor': '#34D399',
};

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteFromHistory(id);
    setEntries(getHistory());
  };

  const handleClear = () => {
    clearHistory();
    setEntries([]);
  };

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
          <Link href="/screen" className="text-sm font-medium text-[#2DD4BF] hover:text-[#5EEAD4] transition-colors">
            + New Scan
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-14">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="font-[family-name:var(--font-geist-mono)] text-[12px] text-[#2DD4BF] tracking-wide mb-2">
              PATIENT RECORDS
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">Scan History</h2>
          </div>
          {entries.length > 0 && (
            <button
              onClick={handleClear}
              className="text-sm font-medium text-[#FB6B5B] hover:text-[#ff8a7c] transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-12 text-center">
            <p className="text-[#7C8798] mb-6">No scans yet. Results are saved here automatically after analysis.</p>
            <Link
              href="/screen"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2DD4BF] text-[#04140F] font-semibold hover:bg-[#5EEAD4] transition-colors"
            >
              Run your first scan
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] divide-y divide-white/[0.06] overflow-hidden">
            {entries.map((e) => {
              const accent = TUMOR_ACCENT[e.tumor_type] || '#7C8798';
              return (
                <div key={e.id} className="flex items-center gap-4 px-6 py-5">
                  <img
                    src={e.imageUrl}
                    alt={e.tumor_type}
                    className="w-14 h-14 rounded-lg object-cover border border-white/[0.08] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                      <span className="font-semibold">{e.tumor_type}</span>
                    </div>
                    <p className="text-xs text-[#7C8798] font-[family-name:var(--font-geist-mono)] mt-1">
                      {new Date(e.date).toLocaleString()} · {e.detections} detection{e.detections === 1 ? '' : 's'}
                    </p>
                  </div>
                  <span className="font-[family-name:var(--font-geist-mono)] text-sm text-[#9AA5B6] shrink-0">
                    {(e.confidence * 100).toFixed(1)}%
                  </span>
                  <button
                    onClick={() => generateResultPdf(e.result, e.imageUrl)}
                    className="text-sm font-medium text-[#2DD4BF] hover:text-[#5EEAD4] transition-colors shrink-0"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="text-sm font-medium text-[#7C8798] hover:text-[#FB6B5B] transition-colors shrink-0"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}