import { NextRequest, NextResponse } from 'next/server';

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  ta: 'Tamil',
  te: 'Telugu',
  kn: 'Kannada',
  ml: 'Malayalam',
  bn: 'Bengali',
  mr: 'Marathi',
  gu: 'Gujarati',
  pa: 'Punjabi',
};

export async function POST(req: NextRequest) {
  try {
    const { question, language, context } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const langName = LANGUAGE_NAMES[language] || 'English';

    const prompt = `You are a calm assistant explaining a brain MRI AI detection result to a patient.
Respond ONLY in ${langName}. 2-4 short spoken sentences. Simple, non-technical words. No markdown, no headers, no bullet points.
Report data: ${JSON.stringify(context)}
Patient's question: "${question}"
If the question relates to the result itself, briefly remind them this is not a medical diagnosis and to consult a doctor.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('Gemini API error:', res.status, errText);
      return NextResponse.json(
        { error: `Gemini API failed: ${res.status} - ${errText}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    
    if (!data.candidates || !data.candidates[0]) {
      console.error('Unexpected Gemini response:', JSON.stringify(data));
      return NextResponse.json(
        { error: 'Invalid response from Gemini API' },
        { status: 502 }
      );
    }
    
    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      'Sorry, I could not generate a response right now.';

    return NextResponse.json({ answer });
  } catch (err) {
    console.error('Voice assistant error:', err);
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}