"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Mic,
  Square,
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
  const [showScaffoldStrip, setShowScaffoldStrip] = useState(false);
  const [showModelAnswers, setShowModelAnswers] = useState(false);
  const [showRubricAudit, setShowRubricAudit] = useState(false);

  // Timer Modes
  const [timerMode, setTimerMode] = useState<TimerMode>("standard");
  const [hoveredMode, setHoveredMode] = useState<TimerMode | null>(null);
  const [drillAttempt, setDrillAttempt] = useState<1 | 2 | 3>(1);

  // Active or hovered mode for micro-copy description
  const activeExplainingMode = hoveredMode || timerMode;

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

  // Recording State & Transcript
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [manuallyCheckedCollocs, setManuallyCheckedCollocs] = useState<string[]>([]);

  // Audio Playback State (Only for user's own recorded voice)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25>(1);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Rubric checklist
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
  const isRecordingRef = useRef(false);
  const finalTranscriptRef = useRef("");
  const sessionFinalTranscriptRef = useRef("");

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
    setShowModelAnswers(false);
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

  // Active Transcript (combining both finalized and live interim words)
  const activeTranscriptText = useMemo(() => {
    return [finalTranscript, liveTranscript].filter(Boolean).join(" ").trim();
  }, [finalTranscript, liveTranscript]);

  // Target collocations used (detected or manually checked)
  const usedCollocations = useMemo(() => {
    const textLower = activeTranscriptText.toLowerCase();
    return selectedPrompt.targetCollocations.filter(
      (c) => textLower.includes(c.phrase.toLowerCase()) || manuallyCheckedCollocs.includes(c.phrase)
    );
  }, [activeTranscriptText, selectedPrompt.targetCollocations, manuallyCheckedCollocs]);

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

      // Reset State
      setIsRecording(true);
      isRecordingRef.current = true;
      setElapsedSeconds(0);
      setAudioUrl(null);
      setFinalTranscript("");
      setLiveTranscript("");
      finalTranscriptRef.current = "";
      sessionFinalTranscriptRef.current = "";

      // Web Speech API
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        speechRecognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let currentSessionFinal = "";
          let currentSessionInterim = "";

          for (let i = 0; i < event.results.length; i++) {
            const res = event.results[i];
            if (res.isFinal) {
              currentSessionFinal += res[0].transcript + " ";
            } else {
              currentSessionInterim += res[0].transcript + " ";
            }
          }

          const combinedFinal = [sessionFinalTranscriptRef.current, currentSessionFinal]
            .filter(Boolean)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();

          finalTranscriptRef.current = combinedFinal;
          setFinalTranscript(combinedFinal);
          setLiveTranscript(currentSessionInterim.trim());
        };

        recognition.onend = () => {
          // If the recording is still ongoing, auto-restart recognition seamlessly
          if (isRecordingRef.current) {
            sessionFinalTranscriptRef.current = finalTranscriptRef.current;
            try {
              recognition.start();
            } catch (e) {
              // already starting or active
            }
          }
        };

        recognition.onerror = () => {
          // silently allow onend to restart if needed
        };

        try {
          recognition.start();
        } catch (e) {
          // ignore already started error
        }
      }

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

      // Start Audio Waveform Animation Loop
      drawWaveform();
    } catch (err) {
      console.error("Microphone access error:", err);
    }
  };

  // WAVEFORM DRAWING LOOP
  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkFrame = () => {
      analyser.getByteTimeDomainData(dataArray);

      // Draw Waveform on Canvas
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
    isRecordingRef.current = false;
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
    isRecordingRef.current = false;
    finalTranscriptRef.current = "";
    sessionFinalTranscriptRef.current = "";
    setElapsedSeconds(0);
    setAudioUrl(null);
    setLiveTranscript("");
    setFinalTranscript("");
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
        <span className="text-neutral-600 dark:text-neutral-400 italic">
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
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-2 flex flex-wrap items-end justify-between gap-4">
        {/* Left: Part Switcher Minimalist Tabs */}
        <div className="flex items-center gap-6 text-xs font-medium">
          {([1, 2, 3] as const).map((part) => (
            <button
              key={part}
              onClick={() => {
                setActivePart(part);
                if (part !== 2 && timerMode === "drill_432") {
                  setTimerMode("standard");
                }
              }}
              className={cn(
                "pb-2 pt-1 -mb-[9px] transition-colors border-b-2 cursor-pointer",
                activePart === part
                  ? "border-neutral-900 dark:border-neutral-100 text-neutral-950 dark:text-neutral-50 font-semibold"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-200"
              )}
            >
              Part {part}
            </button>
          ))}
        </div>

        {/* Right: Timer Mode Selector, Micro-copy Explainer & Question Actions */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-4 text-xs">
            {/* Timer Modes */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimerMode("standard")}
                onMouseEnter={() => setHoveredMode("standard")}
                onMouseLeave={() => setHoveredMode(null)}
                className={cn(
                  "py-1 transition-colors cursor-pointer",
                  timerMode === "standard"
                    ? "text-neutral-950 dark:text-white font-semibold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-200 font-normal"
                )}
              >
                Standard
              </button>
              <span className="text-neutral-300 dark:text-neutral-700 font-light">/</span>
              <button
                onClick={() => setTimerMode("exam")}
                onMouseEnter={() => setHoveredMode("exam")}
                onMouseLeave={() => setHoveredMode(null)}
                className={cn(
                  "py-1 transition-colors cursor-pointer",
                  timerMode === "exam"
                    ? "text-neutral-950 dark:text-white font-semibold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-200 font-normal"
                )}
              >
                Exam
              </button>
              {activePart === 2 && (
                <>
                  <span className="text-neutral-300 dark:text-neutral-700 font-light">/</span>
                  <button
                    onClick={() => setTimerMode("drill_432")}
                    onMouseEnter={() => setHoveredMode("drill_432")}
                    onMouseLeave={() => setHoveredMode(null)}
                    className={cn(
                      "py-1 transition-colors cursor-pointer inline-flex items-center gap-1",
                      timerMode === "drill_432"
                        ? "text-rose-600 dark:text-rose-400 font-semibold"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-200 font-normal"
                    )}
                  >
                    <Flame className="w-3 h-3 text-rose-500" />
                    <span>4-3-2 Drill</span>
                  </button>
                </>
              )}
            </div>

            <div className="h-3.5 w-[1px] bg-neutral-200 dark:bg-neutral-800" />

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
              className="p-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsQuestionPickerOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors cursor-pointer py-1"
            >
              <Search className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
              <span>Browse Bank</span>
            </button>
          </div>

          {/* Micro-explainer right below the mode selection tab */}
          <div className="text-[11px] text-neutral-600 dark:text-neutral-400 font-normal select-none">
            {activeExplainingMode === "standard" && (
              <span>Standard • Open practice without forced cutoff</span>
            )}
            {activeExplainingMode === "exam" && (
              <span>Exam • Strict test conditions with auto-cutoff at time limit</span>
            )}
            {activeExplainingMode === "drill_432" && (
              <span>4-3-2 Drill • 3 shrinking rounds (2:00 → 1:30 → 1:00) for fluency</span>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION B: QUESTION HEADER & ACTIVE SCAFFOLDING STRIP    */}
      {/* ======================================================== */}
      <div className="space-y-4">
        {/* Question Metadata & Scaffold Toggle */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {selectedPrompt.topic}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700 font-light">•</span>
            <span className="text-neutral-600 dark:text-neutral-400 font-medium">
              {selectedPrompt.sourceBadge}
            </span>
          </div>

          <button
            onClick={() => setShowScaffoldStrip(!showScaffoldStrip)}
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer",
              showScaffoldStrip
                ? "text-purple-600 dark:text-purple-400 underline underline-offset-4"
                : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-200"
            )}
          >
            <Sparkles className="w-3 h-3 text-purple-500" />
            <span>Scaffold ({usedCollocations.length}/{selectedPrompt.targetCollocations.length})</span>
          </button>
        </div>

        {/* Prompt Text */}
        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-medium text-neutral-950 dark:text-white leading-snug">
            {selectedPrompt.question}
          </h2>

          {selectedPrompt.cueCardBullets && selectedPrompt.cueCardBullets.length > 0 && (
            <div className="border-l-2 border-neutral-300 dark:border-neutral-700 pl-4 py-1 space-y-1.5 my-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                You should say:
              </div>
              <ul className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                {selectedPrompt.cueCardBullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-baseline gap-2">
                    <span className="text-neutral-500 dark:text-neutral-400">–</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Active Scaffolding Strip (Clean Rounded Box) */}
        {showScaffoldStrip && (
          <div className="p-3.5 sm:p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/40 space-y-3">
            {/* Target Collocations Line Tags */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 shrink-0 mr-1">
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
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition-colors cursor-pointer",
                      isChecked
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold"
                        : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600"
                    )}
                  >
                    {isChecked ? (
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                        [{colloc.cefr}]
                      </span>
                    )}
                    <span>{colloc.phrase}</span>
                  </button>
                );
              })}
            </div>

            {/* Grammar Target Formula */}
            <div className="flex items-baseline gap-2 text-xs text-neutral-600 dark:text-neutral-400 pt-1">
              <span className="font-medium text-neutral-600 dark:text-neutral-400 shrink-0">
                Target Grammar:
              </span>
              <span className="text-neutral-900 dark:text-neutral-200 font-semibold">
                {selectedPrompt.grammarTarget.label}
              </span>
              <span className="hidden md:inline text-neutral-600 dark:text-neutral-400 font-sans italic truncate">
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
        {/* 4-3-2 Fluency Drill Progression Strip (Clean Card) */}
        {timerMode === "drill_432" && (
          <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                4-3-2 Fluency Drill
              </span>
              <span className="text-neutral-300 dark:text-neutral-700 font-light">•</span>
              <span className="text-neutral-600 dark:text-neutral-400 hidden sm:inline">
                Repeat the same answer across 3 rounds with decreasing time limits
              </span>
            </div>

            {/* Step rounds */}
            <div className="flex items-center gap-1">
              {([1, 2, 3] as const).map((round) => {
                const duration = round === 1 ? "2:00" : round === 2 ? "1:30" : "1:00";
                const isCurrent = drillAttempt === round;
                return (
                  <button
                    key={round}
                    onClick={() => {
                      setDrillAttempt(round);
                      resetRecording();
                    }}
                    className={cn(
                      "px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer flex items-center gap-1.5",
                      isCurrent
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 font-normal"
                    )}
                  >
                    <span>Round {round}</span>
                    <span
                      className={cn(
                        "text-[11px]",
                        isCurrent
                          ? "text-neutral-300 dark:text-neutral-600"
                          : "text-neutral-500 dark:text-neutral-400"
                      )}
                    >
                      ({duration})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Part 2 Scratchpad (Card without Inner Small Boxes) */}
        {activePart === 2 && (
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/40 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  Part 2 60s Scratchpad
                </span>
              </div>

              {/* Prep Timer & Controls */}
              <div className="flex items-center gap-2.5 text-xs">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatTime(prepSecondsRemaining)}
                </span>
                <span className="text-neutral-300 dark:text-neutral-700 font-light">•</span>
                <button
                  onClick={() => setIsPrepping(!isPrepping)}
                  className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-neutral-100 font-medium transition-colors cursor-pointer"
                >
                  {isPrepping ? "Pause" : "Start 1m Prep"}
                </button>
                <span className="text-neutral-300 dark:text-neutral-700 font-light">•</span>
                <button
                  onClick={() => {
                    setIsPrepping(false);
                    setPrepSecondsRemaining(60);
                  }}
                  className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                  title="Reset Prep Timer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* 4 Frameless Keyword Inputs (Zero Nested Small Boxes) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  1. Context
                </label>
                <input
                  type="text"
                  value={scratchpad.context}
                  onChange={(e) => setScratchpad({ ...scratchpad, context: e.target.value })}
                  placeholder="Who, where, setting..."
                  className="w-full text-xs py-1.5 bg-transparent border-b border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100 text-neutral-900 dark:text-neutral-100 outline-none placeholder:text-neutral-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  2. Core Detail
                </label>
                <input
                  type="text"
                  value={scratchpad.core}
                  onChange={(e) => setScratchpad({ ...scratchpad, core: e.target.value })}
                  placeholder="Key event, action..."
                  className="w-full text-xs py-1.5 bg-transparent border-b border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100 text-neutral-900 dark:text-neutral-100 outline-none placeholder:text-neutral-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  3. Impact
                </label>
                <input
                  type="text"
                  value={scratchpad.impact}
                  onChange={(e) => setScratchpad({ ...scratchpad, impact: e.target.value })}
                  placeholder="Why significant, feelings..."
                  className="w-full text-xs py-1.5 bg-transparent border-b border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100 text-neutral-900 dark:text-neutral-100 outline-none placeholder:text-neutral-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  4. Outcome
                </label>
                <input
                  type="text"
                  value={scratchpad.outcome}
                  onChange={(e) => setScratchpad({ ...scratchpad, outcome: e.target.value })}
                  placeholder="Reflection, legacy..."
                  className="w-full text-xs py-1.5 bg-transparent border-b border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100 text-neutral-900 dark:text-neutral-100 outline-none placeholder:text-neutral-500 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Pacing Timeline (Card without Inner Small Boxes) */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/40 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
              <span className="font-semibold uppercase tracking-wider text-[11px] text-neutral-700 dark:text-neutral-300">
                Pacing Timeline
              </span>
            </div>
            <span className="text-xs">
              Segment {activePacingIndex + 1}/{selectedPrompt.pacingSegments.length}:{" "}
              <strong className="text-neutral-900 dark:text-neutral-100 font-semibold">
                {selectedPrompt.pacingSegments[activePacingIndex]?.label}
              </strong>
            </span>
          </div>

          {/* Multi-Segment Pill Progress Bar */}
          <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full flex gap-1 overflow-hidden p-0.5">
            {selectedPrompt.pacingSegments.map((seg, idx) => {
              const segDuration = seg.endSec - seg.startSec;
              const widthPct = (segDuration / effectiveTargetDuration) * 100;
              const isActive = idx === activePacingIndex && isRecording;
              const isPast = elapsedSeconds >= seg.endSec;
              return (
                <div
                  key={idx}
                  style={{ width: `${widthPct}%` }}
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    isActive
                      ? "bg-emerald-500"
                      : isPast
                      ? "bg-neutral-500 dark:bg-neutral-600"
                      : "bg-neutral-300 dark:bg-neutral-700"
                  )}
                />
              );
            })}
          </div>

          {/* 4 Segment Labels (Clean Frameless Typography, Zero Inner Small Boxes) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            {selectedPrompt.pacingSegments.map((seg, idx) => {
              const isActive = idx === activePacingIndex && isRecording;
              const isPast = elapsedSeconds >= seg.endSec;
              return (
                <div
                  key={idx}
                  className={cn(
                    "text-left transition-colors",
                    isActive
                      ? "text-emerald-700 dark:text-emerald-400 font-semibold"
                      : isPast
                      ? "text-neutral-500 dark:text-neutral-500"
                      : "text-neutral-800 dark:text-neutral-200"
                  )}
                >
                  <div
                    className={cn(
                      "text-[10px] font-semibold leading-none mb-1",
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-neutral-500 dark:text-neutral-400"
                    )}
                  >
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

        {/* Unified Recording Console (Waveform + Controls + Audio Scrub Bar) */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-950 shadow-sm">
          {/* Live Audio Waveform Canvas */}
          <div className="relative h-20 flex items-center justify-center bg-neutral-950">
            <canvas
              ref={canvasRef}
              width={720}
              height={80}
              className="w-full h-full block"
            />

            {!isRecording && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-medium text-neutral-500">
                {audioUrl ? "Audio recorded • ready for playback" : "Microphone idle • click to record"}
              </div>
            )}

            {isRecording && (
              <div className="absolute top-2 right-3 flex items-center gap-1.5 text-rose-400 text-[10px] font-semibold tracking-wider bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-800">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>LIVE</span>
              </div>
            )}
          </div>

          {/* Recording Controls & Deterministic Telemetry Toolbar */}
          <div className="p-3 sm:p-4 bg-white dark:bg-neutral-900/80 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
            {/* Main Action: Record / Playback / Stop */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold tracking-tight transition-colors cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span>{audioUrl ? "Record Again" : "Start Speaking"}</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold tracking-tight transition-colors cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Finish Response</span>
                </button>
              )}

              {/* HIGH-VISIBILITY PLAYBACK BUTTON */}
              {audioUrl && !isRecording && (
                <button
                  onClick={togglePlayAudio}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 bg-neutral-50 dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 text-xs font-semibold tracking-tight transition-colors cursor-pointer"
                  title={isPlayingAudio ? "Pause Your Voice" : "Play Your Voice"}
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current text-emerald-600 dark:text-emerald-400" />
                      <span>Pause Voice</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Play Voice</span>
                    </>
                  )}
                </button>
              )}

              {/* Recording Timer */}
              <div className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100 pl-1">
                {formatTime(elapsedSeconds)}{" "}
                <span className="text-neutral-500 dark:text-neutral-400 text-xs font-medium">
                  / {formatTime(effectiveTargetDuration)}
                </span>
              </div>

              {audioUrl && !isRecording && (
                <button
                  onClick={resetRecording}
                  className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                  title="Reset Recording"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              {timerMode === "drill_432" && audioUrl && !isRecording && drillAttempt < 3 && (
                <button
                  onClick={() => {
                    setDrillAttempt((prev) => (prev === 1 ? 2 : 3));
                    resetRecording();
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors cursor-pointer pl-2"
                >
                  <span>Next: Round {drillAttempt + 1} ({drillAttempt === 1 ? "1:30" : "1:00"}) →</span>
                </button>
              )}
            </div>
          </div>

          {/* Dedicated Audio Playback Scrub Bar */}
          {audioUrl && !isRecording && (
            <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
              <audio
                ref={audioPlayerRef}
                src={audioUrl}
                onTimeUpdate={handleAudioTimeUpdate}
                onLoadedMetadata={handleAudioLoadedMetadata}
                onEnded={() => setIsPlayingAudio(false)}
              />

              <button
                onClick={togglePlayAudio}
                className="p-1.5 text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer shrink-0"
                title={isPlayingAudio ? "Pause Your Voice" : "Play Your Voice"}
              >
                {isPlayingAudio ? (
                  <Pause className="w-4 h-4 fill-current text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5 text-emerald-600 dark:text-emerald-400" />
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
                  className="w-full accent-neutral-900 dark:accent-neutral-100 cursor-pointer h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full"
                />
                <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 shrink-0">
                  {formatTime(Math.floor(audioCurrentTime))} / {formatTime(Math.floor(audioDuration))}
                </span>
              </div>

              <button
                onClick={handleToggleSpeed}
                className="text-[11px] font-medium text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors cursor-pointer shrink-0 px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700"
              >
                {playbackSpeed}x
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION D: TRANSCRIPT & PROGRESSIVE AUDIT / MODELS       */}
      {/* ======================================================== */}
      <div className="space-y-4 pt-1">
        {/* Candidate Transcript (Clean Card) */}
        {(activeTranscriptText || audioUrl) && (
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                Spoken Transcript (Live Acoustic Log)
              </span>
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
        )}

        {/* Examiner Rubric Self-Audit (Clean Card) */}
        {(activeTranscriptText || audioUrl) && (
          <div className="p-3.5 sm:p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/40 space-y-2">
            <button
              onClick={() => setShowRubricAudit(!showRubricAudit)}
              className="flex items-center justify-between w-full text-left py-0.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Examiner Rubric Self-Audit (Cambridge FC, LR, GRA, PR)</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-neutral-200">
                <span>{showRubricAudit ? "Hide" : "Audit"}</span>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 transition-transform duration-200",
                    showRubricAudit && "rotate-180"
                  )}
                />
              </div>
            </button>

            {showRubricAudit && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pt-2 text-xs">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
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

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
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

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
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

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
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
            )}
          </div>
        )}

        {/* Authentic Examiner Model Answers (Clean Card) */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/40 space-y-3">
          <button
            onClick={() => setShowModelAnswers(!showModelAnswers)}
            className="w-full flex items-center justify-between text-left py-0.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-neutral-100 transition-colors" />
              <span className="text-neutral-900 dark:text-neutral-100 font-semibold">
                Authentic Examiner Model Answers
              </span>
              {selectedPrompt.transcripts.band6 && (
                <span className="text-[11px] font-normal text-neutral-600 dark:text-neutral-400">
                  (Band 6.0 Candidate vs. Band 9.0 Model)
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-950 dark:group-hover:text-neutral-100 text-[11px] font-semibold">
              <span>{showModelAnswers ? "Hide Models" : "Reveal Models"}</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  showModelAnswers && "rotate-180"
                )}
              />
            </div>
          </button>

          {showModelAnswers && (
            <div
              className={cn(
                "grid grid-cols-1 gap-4 pt-2",
                selectedPrompt.transcripts.band6 ? "lg:grid-cols-2" : ""
              )}
            >
              {/* Band 6.0 Candidate Transcript */}
              {selectedPrompt.transcripts.band6 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200/80 dark:border-neutral-800/80 text-xs">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      {selectedPrompt.transcripts.band6.band}
                    </span>
                    <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                      Cambridge Audio Log
                    </span>
                  </div>

                  {/* Verbatim Candidate Text - Matching Exact Typography */}
                  <div
                    data-paragraph="true"
                    className="ielts-paragraph text-sm sm:text-base leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-line select-text"
                  >
                    {selectedPrompt.transcripts.band6.text}
                  </div>

                  <div className="pt-2 text-[11px] text-neutral-600 dark:text-neutral-400 italic border-t border-neutral-100 dark:border-neutral-900">
                    Examiner critique: Adequate message transmission, but limited by short, repetitive sentence structures, simple vocabulary, and hesitations.
                  </div>
                </div>
              )}

              {/* Band 9.0 Model Transcript */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200/80 dark:border-neutral-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-purple-700 dark:text-purple-400">
                      {selectedPrompt.transcripts.band9.band}
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700 font-light">•</span>
                    <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                      {selectedPrompt.transcripts.band9.wordCount} words
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      handleCopyText(selectedPrompt.transcripts.band9.text, "band9")
                    }
                    className="inline-flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                    title="Copy Model Transcript"
                  >
                    {copiedKey === "band9" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy</span>
                  </button>
                </div>

                {/* Verbatim Band 9 Text - Matching Exact Typography */}
                <div
                  data-paragraph="true"
                  className="ielts-paragraph text-sm sm:text-base leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-line select-text"
                >
                  {renderModelWithHighlights(selectedPrompt.transcripts.band9.text)}
                </div>

                <div className="pt-2 text-[11px] text-neutral-600 dark:text-neutral-400 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-900">
                  <span>
                    Highlighted terms denote authentic C1/C2 collocations used in context.
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                    {selectedPrompt.sourceBadge}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
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
