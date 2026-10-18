import { NextRequest, NextResponse } from 'next/server';
import { analyzeWritingWithGemini } from '@/lib/gemini';
import { evaluateWritingDynamically } from '@/lib/dynamicIeltsExaminer';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let promptText = '';
  let essayText = '';
  let taskType: any = 'task2';
  let apiKey: string | undefined;
  let imageBase64: string | undefined;
  let imageMimeType: string | undefined;

  try {
    const body = await req.json();
    promptText = body.promptText;
    essayText = body.essayText;
    taskType = body.taskType || 'task2';
    apiKey = body.apiKey;
    imageBase64 = body.imageBase64;
    imageMimeType = body.imageMimeType;

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
    console.error('API Error in /api/grade-writing, using examiner fallback:', error);
    try {
      if (promptText && essayText) {
        const fallbackResult = evaluateWritingDynamically(
          promptText,
          essayText,
          taskType || 'task2',
          imageBase64
        );
        return NextResponse.json(fallbackResult);
      }
    } catch (fallbackError) {
      console.error('Dynamic examiner fallback failed:', fallbackError);
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to analyze writing submission' },
      { status: 500 }
    );
  }
}
