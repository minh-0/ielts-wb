"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Mic,
  Square,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  ChevronDown,
  Copy,
  Check,
  Search,
  Sparkles,
  BookOpen,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Circle,
  HelpCircle,
  FileText,
  Flame,
} from "lucide-react";
import {
  AUTHENTIC_SPEAKING_BANK,
  AuthenticSpeakingPrompt,
  SpeakingCollocation,
} from "@/lib/speakingAuthenticData";
import { SpeakingQuestionPickerModal } from "./SpeakingQuestionPickerModal";
import { cn } from "@/lib/utils";

interface SpeakingStudioProps {
  apiKey?: string;
  onOpenApiKeyModal?: () => void;
}

type TimerMode = "standard" | "exam" | "drill_432";
type PostTab = "transcript_audit" | "authentic_models";

const FILLER_WORDS = [
  "um",
  "uh",
  "er",
  "ah",
  "like",
  "you know",
  "basically",
  "actually",
  "sort of",
  "kinda",
  "kind of",
  "so yeah",
  "i mean",
];

const FILLER_REGEX = new RegExp(`\\b(${FILLER_WORDS.join("|")})\\b`, "gi");

export function SpeakingStudio({}: SpeakingStudioProps) {
  // Part Selection
  const [activePart, setActivePart] = useState<1 | 2 | 3>(2);
  const promptsForPart = useMemo(
    () => AUTHENTIC_SPEAKING_BANK.filter((p) => p.part === activePart),
    [activePart]
  );

  const [selectedPrompt, setSelectedPrompt] = useState<AuthenticSpeakingPrompt>(
    () => promptsForPart[0] || AUTHENTIC_SPEAKING_BANK[0]
  );

  // Sync selected prompt when switching parts if prompt doesn't belong to part
  useEffect(() => {
    if (selectedPrompt.part !== activePart) {
      const match = AUTHENTIC_SPEAKING_BANK.find((p) => p.part === activePart);
      if (match) setSelectedPrompt(match);
    }
  }, [activePart, selectedPrompt.part]);

  // Modals & Strips
  const [isQuestionPickerOpen, setIsQuestionPickerOpen] = useState(false);
  const [showScaffoldStrip, setShowScaffoldStrip] = useState(true);

  // Timer Modes
  const [timerMode, setTimerMode] = useState<TimerMode>("standard");
  const [drillAttempt, setDrillAttempt] = useState<1 | 2 | 3>(1);

  // Target duration based on mode and prompt
  const effectiveTargetDuration = useMemo(() => {
    if (timerMode === "drill_432") {
      if (drillAttempt === 1) return 120;
      if (drillAttempt === 2) return 90;
      return 60;
    }
    return selectedPrompt.targetDurationSec;
  }, [timerMode, drillAttempt, selectedPrompt.targetDurationSec]);

  // Part 2 Prep Timer & 4-Cell Scratchpad
  const [prepSecondsRemaining, setPrepSecondsRemaining] = useState(60);
  const [isPrepping, setIsPrepping] = useState(false);
  const [scratchpad, setScratchpad] = useState({
    context: "",
    core: "",
    impact: "",
    outcome: "",
  });

  // Recording State & Acoustic Telemetry
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [manuallyCheckedCollocs, setManuallyCheckedCollocs] = useState<string[]>([]);
  const [hesitationCount, setHesitationCount] = useState(0);

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25>(1);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Post-recording tabs & checklists
  const [postTab, setPostTab] = useState<PostTab>("transcript_audit");
  const [checklist, setChecklist] = useState({
    answeredDirectly: false,
    zeroPauses: false,
    usedCollocations: false,
    complexClause: false,
  });

  // Web Speech API, MediaRecorder, AudioContext Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Acoustic Pause Tracking Refs
  const silenceStartRef = useRef<number | null>(null);
  const hasSpokenRef = useRef(false);
  const pauseRecordedRef = useRef(false);

  // Timer Interval Ref
  const timerIntervalRef = useRef<any>(null);
  const prepIntervalRef = useRef<any>(null);

  // Copy State
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Reset recording when changing prompt
  useEffect(() => {
    resetRecording();
    setPrepSecondsRemaining(60);
    setIsPrepping(false);
    setScratchpad({ context: "", core: "", impact: "", outcome: "" });
    setManuallyCheckedCollocs([]);
    setFinalTranscript("");
    setLiveTranscript("");
    setChecklist({
      answeredDirectly: false,
      zeroPauses: false,
      usedCollocations: false,
      complexClause: false,
    });
  }, [selectedPrompt.id]);

  // Prep Timer Effect
  useEffect(() => {
    if (isPrepping && prepSecondsRemaining > 0) {
      prepIntervalRef.current = setInterval(() => {
        setPrepSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(prepIntervalRef.current);
            setIsPrepping(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(prepIntervalRef.current);
    }
    return () => clearInterval(prepIntervalRef.current);
  }, [isPrepping, prepSecondsRemaining]);

  // UK TTS Reader for Examiner Prompt
  const handleReadQuestion = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    let fullText = selectedPrompt.question;
    if (selectedPrompt.cueCardBullets && selectedPrompt.cueCardBullets.length > 0) {
      fullText += ". You should say: " + selectedPrompt.cueCardBullets.join(". ");
    }

    const utterance = new SpeechSynthesisUtterance(fullText);
    const voices = window.speechSynthesis.getVoices();
    const ukVoice = voices.find(
      (v) => v.lang === "en-GB" || v.name.includes("UK") || v.name.includes("British")
    );
    if (ukVoice) utterance.voice = ukVoice;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // UK TTS Reader for Band 9 Model Transcript
  const handleReadModel = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(selectedPrompt.transcripts.band9.text);
    const voices = window.speechSynthesis.getVoices();
    const ukVoice = voices.find(
      (v) => v.lang === "en-GB" || v.name.includes("UK") || v.name.includes("British")
    );
    if (ukVoice) utterance.voice = ukVoice;
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };

  // Copy Model Transcript
  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Active Pacing Segment index based on elapsed seconds
  const activePacingIndex = useMemo(() => {
    const segments = selectedPrompt.pacingSegments;
    for (let i = 0; i < segments.length; i++) {
      if (elapsedSeconds >= segments[i].startSec && elapsedSeconds < segments[i].endSec) {
        return i;
      }
    }
    return segments.length - 1;
  }, [elapsedSeconds, selectedPrompt.pacingSegments]);

  // Filler words detected in current transcript
  const activeTranscriptText = finalTranscript || liveTranscript;
  const detectedFillers = useMemo(() => {
    if (!activeTranscriptText) return [];
    const matches = activeTranscriptText.match(FILLER_REGEX) || [];
    return matches.map((m) => m.toLowerCase());
  }, [activeTranscriptText]);

  // Target collocations used (detected or manually checked)
  const usedCollocations = useMemo(() => {
    const textLower = activeTranscriptText.toLowerCase();
    return selectedPrompt.targetCollocations.filter(
      (c) => textLower.includes(c.phrase.toLowerCase()) || manuallyCheckedCollocs.includes(c.phrase)
    );
  }, [activeTranscriptText, selectedPrompt.targetCollocations, manuallyCheckedCollocs]);

  // Live / Final Words Per Minute
  const currentWpm = useMemo(() => {
    const words = activeTranscriptText.trim().split(/\s+/).filter(Boolean).length;
    if (elapsedSeconds <= 3 || words === 0) return 0;
    const mins = elapsedSeconds / 60;
    return Math.round(words / mins);
  }, [activeTranscriptText, elapsedSeconds]);

  // Toggle Manual Collocation Check
  const toggleCollocationCheck = (phrase: string) => {
    setManuallyCheckedCollocs((prev) =>
      prev.includes(phrase) ? prev.filter((p) => p !== phrase) : [...prev, phrase]
    );
  };

  // START RECORDING
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // AudioContext & AnalyserNode for Waveform & Acoustic Silence Detection
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      // MediaRecorder for Audio File Blob
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start(100);

      // Web Speech API
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        speechRecognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        let accumulatedFinal = "";

        recognition.onresult = (event: any) => {
          let interim = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              accumulatedFinal += transcript + " ";
            } else {
              interim += transcript;
            }
          }
          setFinalTranscript(accumulatedFinal.trim());
          setLiveTranscript(interim.trim());
        };

        recognition.onerror = () => {
          // ignore recognized audio errors silently
        };

        try {
          recognition.start();
        } catch (e) {
          // ignore already started error
        }
      }

      // Reset Telemetry
      setIsRecording(true);
      setElapsedSeconds(0);
      setHesitationCount(0);
      setAudioUrl(null);
      setFinalTranscript("");
      setLiveTranscript("");
      silenceStartRef.current = null;
      hasSpokenRef.current = false;
      pauseRecordedRef.current = false;

      // Timer Interval
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          if (next >= effectiveTargetDuration && timerMode === "exam") {
            stopRecording();
          }
          return next;
        });
      }, 1000);

      // Start Audio Waveform & Pause Detection Loop
      drawWaveformAndDetectPauses();
    } catch (err) {
      console.error("Microphone access error:", err);
    }
  };

  // WAVEFORM & HESITATION MONITOR LOOP
  const drawWaveformAndDetectPauses = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkFrame = () => {
      analyser.getByteTimeDomainData(dataArray);

      // 1. Calculate RMS volume
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const norm = (dataArray[i] - 128) / 128;
        sum += norm * norm;
      }
      const rms = Math.sqrt(sum / bufferLength);

      // Threshold for voice activity
      const VOICE_THRESHOLD = 0.018;

      if (rms > VOICE_THRESHOLD) {
        hasSpokenRef.current = true;
        silenceStartRef.current = null;
        pauseRecordedRef.current = false;
      } else if (hasSpokenRef.current) {
        const now = performance.now();
        if (silenceStartRef.current === null) {
          silenceStartRef.current = now;
        } else {
          const pauseDuration = now - silenceStartRef.current;
          if (pauseDuration >= 2000 && !pauseRecordedRef.current) {
            setHesitationCount((c) => c + 1);
            pauseRecordedRef.current = true;
          }
        }
      }

      // 2. Draw Waveform on Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#10b981"; // emerald line
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(checkFrame);
    };

    checkFrame();
  };

  // STOP RECORDING
  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(timerIntervalRef.current);

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // RESET
  const resetRecording = () => {
    stopRecording();
    setElapsedSeconds(0);
    setAudioUrl(null);
    setLiveTranscript("");
    setFinalTranscript("");
    setHesitationCount(0);
    setIsPlayingAudio(false);
  };

  // FORMAT SECONDS -> MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Audio Playback Listeners
  const togglePlayAudio = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (!audioPlayerRef.current) return;
    setAudioCurrentTime(audioPlayerRef.current.currentTime);
  };

  const handleAudioLoadedMetadata = () => {
    if (!audioPlayerRef.current) return;
    setAudioDuration(audioPlayerRef.current.duration);
  };

  const handleAudioSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (!audioPlayerRef.current) return;
    audioPlayerRef.current.currentTime = time;
    setAudioCurrentTime(time);
  };

  const handleToggleSpeed = () => {
    const next = playbackSpeed === 1 ? 1.25 : 1;
    setPlaybackSpeed(next);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = next;
    }
  };

  // Highlight Candidate Transcript (Fillers in rose, Collocations in emerald)
  const renderAnnotatedTranscript = (text: string) => {
    if (!text.trim()) {
      return (
        <span className="text-neutral-400 italic">
          (No speech detected yet. Click the record button below to speak your response).
        </span>
      );
    }

    // Build regex that captures target collocations and fillers
    const collocPhrases = selectedPrompt.targetCollocations.map((c) =>
      c.phrase.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    );
    const fillerPhrases = FILLER_WORDS.map((f) =>
      f.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    );

    const pattern = new RegExp(
      `\\b(${[...collocPhrases, ...fillerPhrases].join("|")})\\b`,
      "gi"
    );

    const parts = text.split(pattern);

    return parts.map((part, i) => {
      const lower = part.toLowerCase();
      const isColloc = selectedPrompt.targetCollocations.some(
        (c) => c.phrase.toLowerCase() === lower
      );
      const isFiller = FILLER_WORDS.includes(lower);

      if (isColloc) {
        return (
          <span
            key={i}
            className="text-emerald-700 bg-emerald-50 dark:text-emerald-300/90 dark:bg-emerald-950/40 px-1 py-0.5 rounded font-medium underline decoration-solid decoration-emerald-500/80"
            title="Target Collocation Used"
          >
            {part}
          </span>
        );
      }

      if (isFiller) {
        return (
          <span
            key={i}
            className="text-rose-700 bg-rose-50 dark:text-rose-300/90 dark:bg-rose-950/40 px-1 py-0.5 rounded font-medium underline decoration-wavy decoration-rose-500/80"
            title="Spoken Crutch / Filler Word"
          >
            {part}
          </span>
        );
      }

      return <span key={i}>{part}</span>;
    });
  };

  // Highlight Target Collocations in Model Answer
  const renderModelWithHighlights = (modelText: string) => {
    const collocPhrases = selectedPrompt.targetCollocations.map((c) =>
      c.phrase.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    );
    const pattern = new RegExp(`(${collocPhrases.join("|")})`, "gi");
    const parts = modelText.split(pattern);

    return parts.map((part, i) => {
      const lower = part.toLowerCase();
      const isColloc = selectedPrompt.targetCollocations.some(
        (c) => c.phrase.toLowerCase() === lower
      );

      if (isColloc) {
        return (
          <span
            key={i}
            className="text-purple-700 bg-purple-50 dark:text-purple-300/90 dark:bg-purple-950/40 px-1 py-0.5 rounded font-medium"
            title="Authentic C1/C2 Collocation"
          >
            {part}
          </span>
        );
      }

      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* ======================================================== */}
      {/* SECTION A: TOP STUDIO BAR (Hairline Divided)             */}
      {/* ======================================================== */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Part Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80">
          {([1, 2, 3] as const).map((part) => (
            <button
              key={part}
              onClick={() => setActivePart(part)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer",
                activePart === part
                  ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              )}
            >
              Part {part}
            </button>
          ))}
        </div>

        {/* Right: Timer Mode Toggle & Question Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs">
            <button
              onClick={() => setTimerMode("standard")}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer",
                timerMode === "standard"
                  ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
              )}
            >
              Standard
            </button>
            <button
              onClick={() => setTimerMode("exam")}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer",
                timerMode === "exam"
                  ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
              )}
            >
              Exam
            </button>
            {activePart === 2 && (
              <button
                onClick={() => setTimerMode("drill_432")}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1",
                  timerMode === "drill_432"
                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
                )}
              >
                <Flame className="w-3 h-3 text-rose-500" />
                <span>4-3-2 Drill</span>
              </button>
            )}
          </div>

          {/* 4-3-2 Drill Attempt Pills */}
          {timerMode === "drill_432" && (
            <div className="flex items-center gap-1">
              {([1, 2, 3] as const).map((att) => (
                <button
                  key={att}
                  onClick={() => setDrillAttempt(att)}
                  className={cn(
                    "px-2 py-0.5 text-[10px] font-mono rounded border transition-colors cursor-pointer",
                    drillAttempt === att
                      ? "border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300"
                  )}
                >
                  #{att} ({att === 1 ? "2:00" : att === 2 ? "1:30" : "1:00"})
                </button>
              ))}
            </div>
          )}

          {/* Question Controls */}
          <button
            onClick={() => {
              if (promptsForPart.length <= 1) return;
              let nextIdx = Math.floor(Math.random() * promptsForPart.length);
              while (promptsForPart[nextIdx].id === selectedPrompt.id) {
                nextIdx = Math.floor(Math.random() * promptsForPart.length);
              }
              setSelectedPrompt(promptsForPart[nextIdx]);
            }}
            title="Random Question"
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsQuestionPickerOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span>Browse</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION B: QUESTION HEADER & ACTIVE SCAFFOLDING STRIP    */}
      {/* ======================================================== */}
      <div className="space-y-4">
        {/* Question Metadata & TTS */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-800/80">
              {selectedPrompt.topic}
            </span>
            <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
              {selectedPrompt.sourceBadge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReadQuestion}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
              title="Listen to UK Examiner voice"
            >
              <Volume2 className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-[11px] font-mono">Examiner Audio</span>
            </button>

            <button
              onClick={() => setShowScaffoldStrip(!showScaffoldStrip)}
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md border transition-colors cursor-pointer",
                showScaffoldStrip
                  ? "border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-neutral-100"
                  : "border-neutral-200 dark:border-neutral-800 text-neutral-500"
              )}
            >
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>Scaffold</span>
            </button>
          </div>
        </div>

        {/* Prompt Text */}
        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-medium text-neutral-950 dark:text-white leading-snug">
            {selectedPrompt.question}
          </h2>

          {selectedPrompt.cueCardBullets && selectedPrompt.cueCardBullets.length > 0 && (
            <ul className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 space-y-1 pl-4 list-disc marker:text-neutral-400">
              {selectedPrompt.cueCardBullets.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Active Scaffolding Strip */}
        {showScaffoldStrip && (
          <div className="p-3 rounded-xl border border-neutral-200/90 dark:border-neutral-800/90 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-2.5">
            {/* Target Collocations Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-medium text-neutral-500 mr-1 shrink-0">
                Target Chunks:
              </span>
              {selectedPrompt.targetCollocations.map((colloc, idx) => {
                const isChecked = usedCollocations.some(
                  (c) => c.phrase.toLowerCase() === colloc.phrase.toLowerCase()
                );
                return (
                  <button
                    key={idx}
                    onClick={() => toggleCollocationCheck(colloc.phrase)}
                    title={`Context: "${colloc.contextSnippet}" (Click to toggle)`}
                    className={cn(
                      "flex items-center gap-1 px-2 py-0.5 text-xs rounded-lg border transition-all cursor-pointer",
                      isChecked
                        ? "text-emerald-700 bg-emerald-50 dark:text-emerald-300/90 dark:bg-emerald-950/40 border-emerald-300/80 dark:border-emerald-800/60 font-medium"
                        : "text-purple-700 bg-purple-50 dark:text-purple-300/90 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-800/40 hover:border-purple-300"
                    )}
                  >
                    {isChecked ? (
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <span className="text-[9px] font-mono px-1 rounded bg-purple-200/50 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200">
                        {colloc.cefr}
                      </span>
                    )}
                    <span>{colloc.phrase}</span>
                  </button>
                );
              })}
            </div>

            {/* Grammar Target Formula */}
            <div className="flex items-baseline gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              <span className="font-medium text-neutral-500 shrink-0">
                Target Grammar:
              </span>
              <span className="font-mono text-neutral-900 dark:text-neutral-200 font-medium">
                {selectedPrompt.grammarTarget.label}
              </span>
              <span className="hidden md:inline text-neutral-400 font-sans italic truncate">
                — "{selectedPrompt.grammarTarget.exampleFromModel}"
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SECTION C: RECORDING & PACING WORKBENCH                  */}
      {/* ======================================================== */}
      <div className="space-y-4">
        {/* Part 2 Scratchpad (60s prep + 4-cell inline structure) */}
        {activePart === 2 && (
          <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Part 2 60s Scratchpad
                </span>
              </div>

              {/* Prep Timer */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatTime(prepSecondsRemaining)}
                </span>
                <button
                  onClick={() => setIsPrepping(!isPrepping)}
                  className="px-2 py-0.5 text-[11px] font-medium rounded border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
                >
                  {isPrepping ? "Pause" : "Start 1m Prep"}
                </button>
                <button
                  onClick={() => {
                    setIsPrepping(false);
                    setPrepSecondsRemaining(60);
                  }}
                  className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                  title="Reset Prep Timer"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 4-Cell Inline Keyword Scratchpad */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase">
                  1. Context
                </label>
                <input
                  type="text"
                  value={scratchpad.context}
                  onChange={(e) => setScratchpad({ ...scratchpad, context: e.target.value })}
                  placeholder="Who, where, setting..."
                  className="w-full text-xs px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase">
                  2. Core Detail
                </label>
                <input
                  type="text"
                  value={scratchpad.core}
                  onChange={(e) => setScratchpad({ ...scratchpad, core: e.target.value })}
                  placeholder="Key event, action..."
                  className="w-full text-xs px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase">
                  3. Impact
                </label>
                <input
                  type="text"
                  value={scratchpad.impact}
                  onChange={(e) => setScratchpad({ ...scratchpad, impact: e.target.value })}
                  placeholder="Why significant, feelings..."
                  className="w-full text-xs px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase">
                  4. Outcome
                </label>
                <input
                  type="text"
                  value={scratchpad.outcome}
                  onChange={(e) => setScratchpad({ ...scratchpad, outcome: e.target.value })}
                  placeholder="Reflection, legacy..."
                  className="w-full text-xs px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-100 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Segmented Pacing Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>Pacing Breakdown</span>
            <span>
              Segment {activePacingIndex + 1}/{selectedPrompt.pacingSegments.length}:{" "}
              <strong className="text-neutral-900 dark:text-neutral-100">
                {selectedPrompt.pacingSegments[activePacingIndex]?.label}
              </strong>
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
            {selectedPrompt.pacingSegments.map((seg, idx) => {
              const isActive = idx === activePacingIndex && isRecording;
              const isPast = elapsedSeconds >= seg.endSec;
              return (
                <div
                  key={idx}
                  className={cn(
                    "p-1.5 rounded-lg border text-left transition-colors",
                    isActive
                      ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-medium"
                      : isPast
                      ? "border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/20 text-neutral-400"
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400"
                  )}
                >
                  <div className="text-[10px] font-mono leading-none mb-0.5 opacity-80">
                    {seg.label.split("•")[0].trim()}
                  </div>
                  <div className="text-xs truncate font-medium">
                    {seg.label.split("•")[1]?.trim() || seg.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Audio Waveform Canvas */}
        <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-950 overflow-hidden h-24 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={720}
            height={96}
            className="w-full h-full block"
          />

          {!isRecording && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-mono text-neutral-500">
              {audioUrl ? "Audio recorded • ready for playback" : "Microphone idle • click to record"}
            </div>
          )}

          {isRecording && (
            <div className="absolute top-2 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>LIVE</span>
            </div>
          )}
        </div>

        {/* Recording Controls & Deterministic Telemetry Bar */}
        <div className="p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-wrap items-center justify-between gap-4">
          {/* Main Action: Record / Stop */}
          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-medium tracking-tight transition-colors cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Start Speaking</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium tracking-tight transition-colors cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Finish Response</span>
              </button>
            )}

            {/* JetBrains Mono Timer */}
            <div className="font-mono text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100">
              {formatTime(elapsedSeconds)}{" "}
              <span className="text-neutral-400 text-xs font-normal">
                / {formatTime(effectiveTargetDuration)}
              </span>
            </div>

            {audioUrl && !isRecording && (
              <button
                onClick={resetRecording}
                className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                title="Reset Recording"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Telemetry Stats (Zero AI) */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs font-mono">
            {/* WPM Counter */}
            <div className="flex items-baseline gap-1">
              <span className="text-neutral-400">Pace:</span>
              <span
                className={cn(
                  "font-semibold",
                  currentWpm >= 120 && currentWpm <= 150
                    ? "text-emerald-600 dark:text-emerald-400"
                    : currentWpm > 0
                    ? "text-neutral-900 dark:text-neutral-100"
                    : "text-neutral-400"
                )}
              >
                {currentWpm} WPM
              </span>
              <span className="text-[10px] text-neutral-400">(120–150 target)</span>
            </div>

            {/* Hesitation >2.0s Pauses */}
            <div className="flex items-baseline gap-1">
              <span className="text-neutral-400">Pauses &gt;2s:</span>
              <span
                className={cn(
                  "font-semibold",
                  hesitationCount === 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                )}
              >
                {hesitationCount}
              </span>
            </div>

            {/* Filler Words Count */}
            <div className="flex items-baseline gap-1">
              <span className="text-neutral-400">Fillers:</span>
              <span
                className={cn(
                  "font-semibold",
                  detectedFillers.length === 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                )}
              >
                {detectedFillers.length}
              </span>
            </div>

            {/* Collocations Hit */}
            <div className="flex items-baseline gap-1">
              <span className="text-neutral-400">Collocations:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {usedCollocations.length}/{selectedPrompt.targetCollocations.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION D: POST-RECORDING WORKSPACE (2 Hairline Tabs)    */}
      {/* ======================================================== */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-4">
        {/* Tab Switcher */}
        <div className="flex items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
          <button
            onClick={() => setPostTab("transcript_audit")}
            className={cn(
              "text-xs sm:text-sm font-medium pb-2 -mb-2 border-b-2 transition-all cursor-pointer",
              postTab === "transcript_audit"
                ? "border-neutral-900 dark:border-neutral-100 text-neutral-950 dark:text-neutral-50 font-semibold"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
            )}
          >
            Transcript & Audit
          </button>

          <button
            onClick={() => setPostTab("authentic_models")}
            className={cn(
              "text-xs sm:text-sm font-medium pb-2 -mb-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5",
              postTab === "authentic_models"
                ? "border-neutral-900 dark:border-neutral-100 text-neutral-950 dark:text-neutral-50 font-semibold"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
            )}
          >
            <span>Authentic Examiner Models</span>
            {selectedPrompt.transcripts.band6 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                Band 6 vs 9
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: TRANSCRIPT & AUDIT */}
        {postTab === "transcript_audit" && (
          <div className="space-y-4">
            {/* Minimalist Audio Playback Scrub Bar */}
            {audioUrl && (
              <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 flex items-center gap-3">
                <audio
                  ref={audioPlayerRef}
                  src={audioUrl}
                  onTimeUpdate={handleAudioTimeUpdate}
                  onLoadedMetadata={handleAudioLoadedMetadata}
                  onEnded={() => setIsPlayingAudio(false)}
                />

                <button
                  onClick={togglePlayAudio}
                  className="p-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 cursor-pointer shrink-0"
                >
                  {isPlayingAudio ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </button>

                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={audioDuration || 1}
                    step={0.1}
                    value={audioCurrentTime}
                    onChange={handleAudioSeek}
                    className="w-full accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-neutral-500 shrink-0">
                    {formatTime(Math.floor(audioCurrentTime))} / {formatTime(Math.floor(audioDuration))}
                  </span>
                </div>

                <button
                  onClick={handleToggleSpeed}
                  className="px-2 py-1 text-[11px] font-mono rounded border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer shrink-0"
                >
                  {playbackSpeed}x
                </button>

                <button
                  onClick={resetRecording}
                  className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer shrink-0"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Annotated Candidate Transcript Box */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>Spoken Transcript (Live Acoustic Log)</span>
                <span>
                  {activeTranscriptText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              {/* SelectionToolbar & Oxford Modal Contract */}
              <div
                data-paragraph="true"
                className="ielts-paragraph text-sm sm:text-base leading-relaxed text-neutral-900 dark:text-neutral-100 select-text"
              >
                {renderAnnotatedTranscript(activeTranscriptText)}
              </div>
            </div>

            {/* 4-Point Self-Audit Checklist */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/20 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Examiner Rubric Self-Audit (Cambridge FC, LR, GRA, PR)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.answeredDirectly}
                    onChange={(e) =>
                      setChecklist({ ...checklist, answeredDirectly: e.target.checked })
                    }
                    className="accent-neutral-900 dark:accent-neutral-100 w-3.5 h-3.5"
                  />
                  <span className="text-neutral-700 dark:text-neutral-300">
                    Answered directly without repeating prompt words verbatim
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.zeroPauses}
                    onChange={(e) =>
                      setChecklist({ ...checklist, zeroPauses: e.target.checked })
                    }
                    className="accent-neutral-900 dark:accent-neutral-100 w-3.5 h-3.5"
                  />
                  <span className="text-neutral-700 dark:text-neutral-300">
                    Spoke without noticeable pauses exceeding 2.0s
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.usedCollocations}
                    onChange={(e) =>
                      setChecklist({ ...checklist, usedCollocations: e.target.checked })
                    }
                    className="accent-neutral-900 dark:accent-neutral-100 w-3.5 h-3.5"
                  />
                  <span className="text-neutral-700 dark:text-neutral-300">
                    Integrated at least 2 target academic collocations naturally
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checklist.complexClause}
                    onChange={(e) =>
                      setChecklist({ ...checklist, complexClause: e.target.checked })
                    }
                    className="accent-neutral-900 dark:accent-neutral-100 w-3.5 h-3.5"
                  />
                  <span className="text-neutral-700 dark:text-neutral-300">
                    Included complex sentence clause (concession, condition, cleft)
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUTHENTIC MODELS (Verbatim Human Transcripts) */}
        {postTab === "authentic_models" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Band 6.0 Candidate Transcript (if exists) */}
              {selectedPrompt.transcripts.band6 && (
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-900">
                    <div>
                      <span className="px-2 py-0.5 text-xs font-mono font-medium rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40">
                        {selectedPrompt.transcripts.band6.band}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">
                      Cambridge Audio Log
                    </span>
                  </div>

                  {/* Verbatim Candidate Text */}
                  <div
                    data-paragraph="true"
                    className="ielts-paragraph text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-line select-text"
                  >
                    {selectedPrompt.transcripts.band6.text}
                  </div>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-900 text-[11px] text-neutral-500 font-sans italic">
                    Note examiner critique: Adequate message transmission, but limited by short, repetitive sentence structures, simple vocabulary, and hesitations.
                  </div>
                </div>
              )}

              {/* Band 9.0 Model Transcript */}
              <div
                className={cn(
                  "p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3",
                  !selectedPrompt.transcripts.band6 && "lg:col-span-2"
                )}
              >
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-900">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                      {selectedPrompt.transcripts.band9.band}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      {selectedPrompt.transcripts.band9.wordCount} words
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReadModel}
                      className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                      title="Listen to Model"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Listen</span>
                    </button>

                    <button
                      onClick={() =>
                        handleCopyText(selectedPrompt.transcripts.band9.text, "band9")
                      }
                      className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                      title="Copy Model Transcript"
                    >
                      {copiedKey === "band9" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span className="hidden sm:inline">Copy</span>
                    </button>
                  </div>
                </div>

                {/* Verbatim Band 9 Text with Highlighted Collocations */}
                <div
                  data-paragraph="true"
                  className="ielts-paragraph font-serif text-sm sm:text-base leading-relaxed text-neutral-900 dark:text-neutral-100 whitespace-pre-line select-text"
                >
                  {renderModelWithHighlights(selectedPrompt.transcripts.band9.text)}
                </div>

                {/* Collocation In-Context Legend */}
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-900 text-[11px] text-neutral-500 font-sans flex items-center justify-between">
                  <span>
                    Highlighted terms denote authentic C1/C2 collocations used in context.
                  </span>
                  <span className="font-mono text-neutral-400">
                    {selectedPrompt.sourceBadge}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Speaking Question Picker Modal */}
      <SpeakingQuestionPickerModal
        isOpen={isQuestionPickerOpen}
        onClose={() => setIsQuestionPickerOpen(false)}
        prompts={AUTHENTIC_SPEAKING_BANK}
        selectedPromptId={selectedPrompt.id}
        onSelectPrompt={(p) => {
          setActivePart(p.part);
          setSelectedPrompt(p);
        }}
      />
    </div>
  );
}
