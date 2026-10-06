import { NextRequest, NextResponse } from 'next/server';
import { analyzeWritingWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { promptText, essayText, taskType, apiKey } = body;

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
      apiKey
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error in /api/grade-writing:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze writing submission' },
      { status: 500 }
    );
  }
}
