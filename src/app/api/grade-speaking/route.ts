import { NextRequest, NextResponse } from 'next/server';
import { analyzeSpeakingWithGemini, generateMockSpeakingAnalysis } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let promptTopic = 'IELTS Speaking';
  let transcript = '';
  let durationSeconds = 30;
  let speakingPart: any = 'part2_cuecard';

  try {
    const body = await req.json();
    const {
      promptTopic: topic,
      audioData,
      transcript: text,
      durationSeconds: duration,
      speakingPart: part,
      mimeType,
      apiKey
    } = body;

    promptTopic = topic || 'IELTS Speaking Practice';
    transcript = text || '';
    durationSeconds = typeof duration === 'number' ? duration : 30;
    speakingPart = part || 'part2_cuecard';

    if (!audioData && !transcript && durationSeconds < 3) {
      return NextResponse.json(
        { error: 'Either recorded audio or a spoken transcript must be provided.' },
        { status: 400 }
      );
    }

    const result = await analyzeSpeakingWithGemini(
      promptTopic,
      {
        audioData: audioData || undefined,
        transcript: transcript || undefined,
        durationSeconds: durationSeconds,
        mimeType: mimeType || 'audio/webm'
      },
      speakingPart,
      apiKey
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error in /api/grade-speaking, using examiner fallback:', error);
    try {
      const fallbackResult = generateMockSpeakingAnalysis(
        promptTopic,
        transcript,
        durationSeconds,
        speakingPart
      );
      return NextResponse.json(fallbackResult);
    } catch (fallbackError: any) {
      return NextResponse.json(
        { error: error?.message || 'Failed to analyze speaking response' },
        { status: 500 }
      );
    }
  }
}
