'use client';

import { useEffect, useRef, useState } from 'react';
import { PredictionResponse } from '@/types/api';

const LANGUAGES = [
  { code: 'en', label: 'English', speech: 'en-US' },
  { code: 'hi', label: 'Hindi', speech: 'hi-IN' },
  { code: 'ta', label: 'Tamil', speech: 'ta-IN' },
  { code: 'te', label: 'Telugu', speech: 'te-IN' },
  { code: 'kn', label: 'Kannada', speech: 'kn-IN' },
  { code: 'ml', label: 'Malayalam', speech: 'ml-IN' },
  { code: 'bn', label: 'Bengali', speech: 'bn-IN' },
  { code: 'mr', label: 'Marathi', speech: 'mr-IN' },
];

export default function VoiceAssistant({ result }: { result: PredictionResponse }) {
  const [language, setLanguage] = useState('en');
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [answer, setAnswer] = useState('');
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
  }, []);

  const speak = (text: string, langCode: string) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech Synthesis not supported');
      return;
    }
    
    window.speechSynthesis.cancel();
    
    const utter = new SpeechSynthesisUtterance(text);
    const langLocale = LANGUAGES.find((l) => l.code === langCode)?.speech || 'en-US';
    utter.lang = langLocale;
    utter.rate = 0.9;
    utter.pitch = 1;
    utter.volume = 1;
    
    // Get available voices and log them
    const voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
    
    // Try to find voice for the language
    let selectedVoice = voices.find((v) => v.lang.startsWith(langLocale));
    
    if (!selectedVoice) {
      // Fallback: try just the language code (e.g., 'hi' from 'hi-IN')
      const langCode2 = langLocale.split('-')[0];
      selectedVoice = voices.find((v) => v.lang.startsWith(langCode2));
    }
    
    if (selectedVoice) {
      utter.voice = selectedVoice;
      console.log('Using voice:', selectedVoice.name, selectedVoice.lang);
    } else {
      console.warn(`No voice found for language: ${langLocale}`);
    }
    
    utter.onstart = () => console.log('Speech started');
    utter.onend = () => console.log('Speech ended');
    utter.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
    };
    
    window.speechSynthesis.speak(utter);
  };

  const askGemini = async (question: string) => {
    setThinking(true);
    setAnswer('');
    try {
      const res = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          language,
          context: {
            tumor_type: result.tumor_type,
            confidence: result.confidence,
            detections: result.boxes?.length ?? 0,
          },
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        console.error('API error:', data.error);
        setAnswer(`Error: ${data.error || 'Something went wrong'}`);
        return;
      }
      
      const text = data.answer || 'Sorry, I could not generate a response.';
      setAnswer(text);
      speak(text, language);
    } catch (err) {
      console.error('Voice assistant error:', err);
      setAnswer(`Error: ${err instanceof Error ? err.message : 'Something went wrong'}`);
    } finally {
      setThinking(false);
    }
  };

  const startListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    recognition.lang = LANGUAGES.find((l) => l.code === language)?.speech || 'en-US';

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      askGemini(text);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    setListening(true);
    setTranscript('');
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const askDefault = () => {
    const q =
      language === 'hi'
        ? 'मेरे नतीजे का मतलब सरल भाषा में समझाइए'
        : 'Explain my result in simple terms';
    setTranscript(q);
    askGemini(q);
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#2DD4BF] tracking-wide">
          VOICE ASSISTANT · GEMINI
        </h3>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-black/30 border border-white/10 rounded-lg text-sm px-3 py-1.5 text-[#E7ECF3] focus:outline-none focus:border-[#2DD4BF]/50"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code} className="bg-[#0B0F17]">
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {!supported ? (
        <p className="text-sm text-[#7C8798]">
          Voice input isn&apos;t supported in this browser. Try Chrome on desktop or Android.
        </p>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <button
              onClick={listening ? stopListening : startListening}
              disabled={thinking}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-colors disabled:opacity-40 ${
                listening
                  ? 'bg-[#FB6B5B] text-[#1A0705]'
                  : 'bg-[#2DD4BF] text-[#04140F] hover:bg-[#5EEAD4]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${listening ? 'bg-[#1A0705] animate-pulse' : 'bg-[#04140F]'}`} />
              {listening ? 'Listening…' : 'Ask by voice'}
            </button>
            <button
              onClick={askDefault}
              disabled={thinking || listening}
              className="text-sm font-medium text-[#9AA5B6] hover:text-white transition-colors disabled:opacity-40"
            >
              Explain in simple terms
            </button>
          </div>

          {transcript && (
            <p className="text-sm text-[#7C8798] mb-2 font-[family-name:var(--font-geist-mono)]">
              You asked: &ldquo;{transcript}&rdquo;
            </p>
          )}
          {thinking && <p className="text-sm text-[#2DD4BF]">Thinking…</p>}
          {answer && !thinking && <p className="text-[#E7ECF3] leading-relaxed">{answer}</p>}
        </>
      )}
    </div>
  );
}