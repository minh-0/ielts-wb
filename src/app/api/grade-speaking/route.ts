import { NextRequest, NextResponse } from 'next/server';
import { analyzeSpeakingWithGemini } from '@/lib/gemini';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      promptTopic,
      audioData,
      transcript,
      durationSeconds,
      speakingPart,
      mimeType,
      apiKey
    } = body;

    if (!audioData && !transcript && (typeof durationSeconds !== 'number' || durationSeconds < 3)) {
      return NextResponse.json(
        { error: 'Either recorded audio or a spoken transcript must be provided.' },
        { status: 400 }
      );
    }

    const result = await analyzeSpeakingWithGemini(
      promptTopic || 'IELTS Speaking Practice',
      {
        audioData: audioData || undefined,
        transcript: transcript || undefined,
        durationSeconds: typeof durationSeconds === 'number' ? durationSeconds : 30,
        mimeType: mimeType || 'audio/webm'
      },
      speakingPart || 'part2_cuecard',
      apiKey
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error in /api/grade-speaking:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze speaking response with live AI examiner.' },
      { status: 500 }
    );
  }
}
