import { NextRequest, NextResponse } from 'next/server';
import { analyzeSpeakingWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { promptTopic, audioData, transcript, speakingPart, mimeType, apiKey } = body;

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

    const payload = audioData
      ? { type: 'audio' as const, data: audioData, mimeType: mimeType || 'audio/webm' }
      : { type: 'transcript' as const, data: transcript };

    const result = await analyzeSpeakingWithGemini(
      promptTopic,
      payload,
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
