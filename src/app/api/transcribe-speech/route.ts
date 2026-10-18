import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const GEMINI_PRIMARY_MODEL = 'gemini-3.8-flash';
const GEMINI_FALLBACK_MODEL = 'gemini-3.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_PRIMARY_MODEL}:generateContent`;
const GEMINI_FALLBACK_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_FALLBACK_MODEL}:generateContent`;

/**
 * Transcribe WAV audio file locally using Windows built-in System.Speech.Recognition
 */
async function transcribeWithWindowsSpeechEngine(wavBase64: string): Promise<string> {
  const tmpDir = os.tmpdir();
  const tempWavPath = path.join(tmpDir, `speech_${Date.now()}_${Math.random().toString(36).slice(2)}.wav`);
  const tempPs1Path = path.join(tmpDir, `speech_recognize_${Date.now()}_${Math.random().toString(36).slice(2)}.ps1`);

  try {
    const buffer = Buffer.from(wavBase64, 'base64');
    await fs.promises.writeFile(tempWavPath, buffer);

    const psScript = `
Add-Type -AssemblyName System.Speech
$engine = New-Object System.Speech.Recognition.SpeechRecognitionEngine
try {
  $engine.SetInputToWaveFile('${tempWavPath.replace(/\\/g, '\\\\')}')
  $grammar = New-Object System.Speech.Recognition.DictationGrammar
  $engine.LoadGrammar($grammar)
  $fullText = ''
  while ($true) {
    $res = $engine.Recognize([TimeSpan]::FromSeconds(30))
    if ($null -eq $res) { break }
    if ($res.Text) { $fullText += $res.Text + ' ' }
  }
  Write-Output $fullText.Trim()
} catch {
  Write-Output ''
} finally {
  $engine.Dispose()
}
`;

    await fs.promises.writeFile(tempPs1Path, psScript, 'utf8');

    const { stdout } = await execAsync(
      `powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "${tempPs1Path}"`,
      { timeout: 15000 }
    );

    return (stdout || '').trim();
  } catch (err) {
    console.warn('Windows Speech Recognition Engine error:', err);
    return '';
  } finally {
    fs.promises.unlink(tempWavPath).catch(() => {});
    fs.promises.unlink(tempPs1Path).catch(() => {});
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audioData, mimeType, apiKey } = body;

    if (!audioData) {
      return NextResponse.json({ error: 'Audio data is required' }, { status: 400 });
    }

    const key = apiKey || process.env.GEMINI_API_KEY;
    const cleanMimeType = (mimeType || 'audio/webm').split(';')[0].trim();

    // Strategy 1: Use Gemini 3.8 Flash if API key is available
    if (key) {
      try {
        const payloadBody = JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: cleanMimeType,
                    data: audioData
                  }
                },
                {
                  text: 'Listen directly to this candidate audio recording. Transcribe EVERY spoken English word verbatim. Return ONLY the transcribed text. Do NOT add notes, explanations, or quotes.'
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            thinkingConfig: {
              thinkingLevel: 'low'
            }
          }
        });

        let res = await fetch(`${GEMINI_API_URL}?key=${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payloadBody,
          signal: AbortSignal.timeout(20000)
        });

        if (!res.ok) {
          res = await fetch(`${GEMINI_FALLBACK_API_URL}?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payloadBody,
            signal: AbortSignal.timeout(18000)
          });
        }

        if (res.ok) {
          const data = await res.json();
          const transcriptText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          if (transcriptText) {
            return NextResponse.json({ transcript: transcriptText, source: 'gemini-3.8-flash' });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini 3.8 Flash transcription call failed:', geminiErr);
      }
    }

    // Strategy 2: If audio is WAV or can be decoded on Windows, use Windows Speech Recognition
    if (cleanMimeType.includes('wav')) {
      const windowsTranscript = await transcribeWithWindowsSpeechEngine(audioData);
      if (windowsTranscript) {
        return NextResponse.json({ transcript: windowsTranscript, source: 'windows-speech-engine' });
      }
    }

    return NextResponse.json({ transcript: '', source: 'none' });
  } catch (error: any) {
    console.error('Error in /api/transcribe-speech:', error);
    return NextResponse.json({ error: error?.message || 'Transcription error' }, { status: 500 });
  }
}
