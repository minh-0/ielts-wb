/**
 * Convert an in-memory AudioBuffer from the Web Audio API into a standard
 * 16kHz Mono 16-bit PCM WAV Blob for speech recognition engines.
 */
export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const targetSampleRate = 16000;
  const numChannels = 1;
  const sourceData = buffer.getChannelData(0);

  // Resample to targetSampleRate if different
  let samples: Float32Array;
  if (buffer.sampleRate === targetSampleRate) {
    samples = sourceData;
  } else {
    const ratio = buffer.sampleRate / targetSampleRate;
    const newLength = Math.round(sourceData.length / ratio);
    samples = new Float32Array(newLength);
    for (let i = 0; i < newLength; i++) {
      const srcIndex = Math.floor(i * ratio);
      samples[i] = sourceData[srcIndex];
    }
  }

  const numSamples = samples.length;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = targetSampleRate * blockAlign;
  const dataSize = numSamples * bytesPerSample;

  const wavBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(wavBuffer);

  // Helper to write string to DataView
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF Chunk Descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true); // ChunkSize
  writeString(8, 'WAVE');

  // fmt sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true); // NumChannels (1 = Mono)
  view.setUint32(24, targetSampleRate, true); // SampleRate (16000)
  view.setUint32(28, byteRate, true); // ByteRate (16000 * 1 * 2)
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample (16)

  // data sub-chunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true); // Subchunk2Size

  // Write PCM samples (Float32 to Int16)
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    // Clamp sample between -1 and 1
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intSample = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(offset, intSample, true);
    offset += 2;
  }

  return new Blob([wavBuffer], { type: 'audio/wav' });
}

/**
 * Decode a recorded audio Blob (webm/ogg/mp4) in the browser and convert to 16kHz WAV Blob.
 */
export async function convertAudioBlobToWav(audioBlob: Blob): Promise<Blob> {
  if (typeof window === 'undefined') {
    return audioBlob;
  }
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    return audioBlob;
  }

  const audioCtx = new AudioContextClass();
  try {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBufferToWavBlob(audioBuffer);
  } finally {
    audioCtx.close().catch(() => {});
  }
}
