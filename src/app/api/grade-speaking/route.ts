import { NextRequest, NextResponse } from 'next/server';
import { analyzeSpeakingWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { promptTopic, audioData, transcript, durationSeconds, speakingPart, mimeType, apiKey } = body;

    if (!promptTopic) {
      return NextResponse.json(
        { error: 'Prompt topic is required.' },
        { status: 400 }
      );
    }

    if (!audioData && !transcript) {
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
        durationSeconds: typeof durationSeconds === 'number' ? durationSeconds : undefined,
        mimeType: mimeType || 'audio/webm'
      },
      speakingPart || 'part2_cuecard',
      apiKey
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error in /api/grade-speaking:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze speaking response' },
      { status: 500 }
    );
  }
}
