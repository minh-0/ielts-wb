import { NextRequest, NextResponse } from 'next/server';
import { analyzeWritingWithGemini } from '@/lib/gemini';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { promptText, essayText, taskType, apiKey, imageBase64, imageMimeType } = body;

    if (!promptText || !essayText) {
      return NextResponse.json(
        { error: 'Both prompt text and essay content are required.' },
        { status: 400 }
      );
    }

    const result = await analyzeWritingWithGemini(
      promptText,
      essayText,
      taskType || 'task2',
      apiKey,
      imageBase64,
      imageMimeType
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error in /api/grade-writing:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze writing submission with live AI examiner.' },
      { status: 500 }
    );
  }
}
