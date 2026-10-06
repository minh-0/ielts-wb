"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Clock,
  Square,
  Sparkles,
  Award,
  Layers,
  Volume2,
  Share2,
  RefreshCw,
  Sliders,
  Timer,
  ChevronDown,
  AlertCircle,
  Key,
  Shuffle,
  ChevronRight,
} from "lucide-react";
import { SPEAKING_PROMPTS, SpeakingPrompt } from "@/lib/ieltsPromptBank";
import { SpeakingAnalysisResult, SpeakingPart, SpeakingMode } from "@/types/ielts";
import { RadarChart } from "../RadarChart";
import { ScorecardModal } from "../ScorecardModal";

interface SpeakingStudioProps {
  apiKey: string;
  onOpenApiKeyModal?: () => void;
}

export function SpeakingStudio({ apiKey, onOpenApiKeyModal }: SpeakingStudioProps) {
  const [speakingMode, setSpeakingMode] = useState<SpeakingMode>("practice");
  const [selectedPart, setSelectedPart] = useState<SpeakingPart>("part2_cuecard");
  const [selectedPrompt, setSelectedPrompt] = useState<SpeakingPrompt>(
    SPEAKING_PROMPTS.find((p) => p.part === "part2_cuecard") || SPEAKING_PROMPTS[0]
  );
  const [useCustomPrompt, setUseCustomPrompt] = useState<boolean>(false);
  const [customQuestion, setCustomQuestion] = useState<string>("");

  const [customTimerSeconds, setCustomTimerSeconds] = useState<number>(0);

  const [prepSecondsRemaining, setPrepSecondsRemaining] = useState<number>(60);
  const [isPrepping, setIsPrepping] = useState<boolean>(false);
  const [prepNotes, setPrepNotes] = useState<string>("");

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [transcriptFallback, setTranscriptFallback] = useState<string>("");
  const [isListeningSpeech, setIsListeningSpeech] = useState<boolean>(false);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Robust recording & recognition lifecycle refs
  const isRecordingRef = useRef<boolean>(false);
  const recordedMimeRef = useRef<string>("audio/webm");
  const transcriptRef = useRef<string>("");
  const persistedTranscriptRef = useRef<string>("");

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<SpeakingAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"criteria" | "spoken_grammar" | "spoken_idioms" | "speech_metrics" | "model_answer">("criteria");
  const [showScorecard, setShowScorecard] = useState<boolean>(false);

  const currentPartPrompts = SPEAKING_PROMPTS.filter((p) => p.part === selectedPart);
  const currentPromptIndex = currentPartPrompts.findIndex((p) => p.id === selectedPrompt.id);

  const handlePartChange = (part: SpeakingPart) => {
    setSelectedPart(part);
    const available = SPEAKING_PROMPTS.filter((p) => p.part === part);
    if (available.length > 0) {
      setSelectedPrompt(available[0]);
    }
    setUseCustomPrompt(false);
    resetRecording();
  };

  const handleNextPrompt = () => {
    if (currentPartPrompts.length === 0) return;
    const nextIdx = (currentPromptIndex + 1) % currentPartPrompts.length;
    setSelectedPrompt(currentPartPrompts[nextIdx]);
    setUseCustomPrompt(false);
    resetRecording();
  };

  const handleShufflePrompt = () => {
    if (currentPartPrompts.length <= 1) return;
    let randIdx = Math.floor(Math.random() * currentPartPrompts.length);
    if (randIdx === currentPromptIndex) {
      randIdx = (randIdx + 1) % currentPartPrompts.length;
    }
    setSelectedPrompt(currentPartPrompts[randIdx]);
    setUseCustomPrompt(false);
    resetRecording();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleStartPrep = () => {
    setIsPrepping(true);
    setPrepSecondsRemaining(60);
  };

  useEffect(() => {
    let interval: any = null;
    if (isPrepping && prepSecondsRemaining > 0) {
      interval = setInterval(() => {
        setPrepSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isPrepping && prepSecondsRemaining === 0) {
      setIsPrepping(false);
    }
    return () => clearInterval(interval);
  }, [isPrepping, prepSecondsRemaining]);

  const startRecording = async () => {
    try {
      // Clear previous evaluations, audio and notices for clean fresh attempt
      setAnalysisResult(null);
      setSpeechNotice(null);
      setTranscriptFallback("");
      setAudioUrl(null);
      setAudioBase64(null);
      transcriptRef.current = "";
      persistedTranscriptRef.current = "";

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Determine supported audio MIME type across browsers (Chrome, Edge, Firefox, Safari)
      let chosenMime = "audio/webm";
      let recorderOptions: MediaRecorderOptions = {};
      if (typeof MediaRecorder !== "undefined") {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          chosenMime = "audio/webm";
          recorderOptions = { mimeType: "audio/webm;codecs=opus" };
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
          chosenMime = "audio/webm";
          recorderOptions = { mimeType: "audio/webm" };
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          chosenMime = "audio/mp4";
          recorderOptions = { mimeType: "audio/mp4" };
        } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
          chosenMime = "audio/ogg";
          recorderOptions = { mimeType: "audio/ogg" };
        }
      }
      recordedMimeRef.current = chosenMime;

      const mediaRecorder = new MediaRecorder(stream, recorderOptions);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || chosenMime,
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Clean = base64String.split(",")[1];
          setAudioBase64(base64Clean);
        };

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(250);
      isRecordingRef.current = true;
      setIsRecording(true);
      setRecordSeconds(0);

      // Clean up any stale speech recognition instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
        recognitionRef.current = null;
      }

      // Initialize real-time Web Speech Recognition in browser with continuous restart
      const SpeechRecognition =
        typeof window !== "undefined"
          ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
          : null;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = "en-US";
          recognition.maxAlternatives = 1;

          recognition.onstart = () => {
            setIsListeningSpeech(true);
            setSpeechNotice(null);
          };

          recognition.onresult = (event: any) => {
            let sessionFinal = "";
            let sessionInterim = "";
            for (let i = 0; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                sessionFinal += event.results[i][0].transcript + " ";
              } else {
                sessionInterim += event.results[i][0].transcript;
              }
            }
            const fullTranscript = (
              (persistedTranscriptRef.current ? persistedTranscriptRef.current + " " : "") +
              sessionFinal +
              sessionInterim
            ).trim();

            if (fullTranscript) {
              setTranscriptFallback(fullTranscript);
              transcriptRef.current = fullTranscript;
            }
          };

          recognition.onerror = (e: any) => {
            console.warn("Browser speech recognition event:", e.error);
            if (e.error === "network") {
              setSpeechNotice(
                "Browser speech-to-text encountered a network limit. Don't worry — your voice is being recorded in high definition! Gemini 3.8 Flash can listen directly to your audio."
              );
            } else if (e.error !== "no-speech") {
              setSpeechNotice(`Speech notice (${e.error}): Your voice recording is active.`);
            }
          };

          recognition.onend = () => {
            // If the user is still recording, automatically restart recognition across pauses
            if (isRecordingRef.current) {
              persistedTranscriptRef.current = transcriptRef.current;
              try {
                recognition.start();
                return;
              } catch (e) {
                // Ignore if already active
              }
            }
            setIsListeningSpeech(false);
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (recognitionErr) {
          console.warn("SpeechRecognition start failed:", recognitionErr);
          setSpeechNotice(
            "Live browser speech-to-text unavailable in this environment. Your audio recording will be sent directly to Gemini 3.8 Flash."
          );
        }
      }

      timerIntervalRef.current = setInterval(() => {
        setRecordSeconds((prev) => {
          if (speakingMode === "official_exam" && selectedPart === "part2_cuecard" && prev >= 120) {
            stopRecording();
            return 120;
          }
          if (speakingMode === "practice" && customTimerSeconds > 0 && prev >= customTimerSeconds) {
            stopRecording();
            return customTimerSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.warn("Microphone access denied or unsupported", err);
      setSpeechNotice(
        "Microphone access denied or unsupported. Please allow microphone permissions in your browser."
      );
    }
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListeningSpeech(false);
    setIsRecording(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const resetRecording = () => {
    stopRecording();
    isRecordingRef.current = false;
    persistedTranscriptRef.current = "";
    transcriptRef.current = "";
    setAudioUrl(null);
    setAudioBase64(null);
    setRecordSeconds(0);
    setIsPrepping(false);
    setPrepSecondsRemaining(60);
    setTranscriptFallback("");
    setAnalysisResult(null);
    setSpeechNotice(null);
  };

  const handleAnalyze = async () => {
    const cleanTranscript = transcriptFallback.trim();
    if (!audioBase64 && !cleanTranscript) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch("/api/grade-speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptTopic: useCustomPrompt
            ? (customQuestion.trim() || "Custom Speaking Topic")
            : `${selectedPrompt.topic}: ${selectedPrompt.question}`,
          audioData: audioBase64 || undefined,
          transcript: cleanTranscript || undefined,
          durationSeconds: recordSeconds || 0,
          speakingPart: selectedPart,
          mimeType: recordedMimeRef.current || "audio/webm",
          apiKey: apiKey || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Speaking grading failed");
      }

      const data: SpeakingAnalysisResult = await res.json();
      setAnalysisResult(data);

      // If Gemini transcribed the speech directly from the audio, sync it to the transcript box!
      if (data.transcript && !data.transcript.startsWith("[")) {
        setTranscriptFallback(data.transcript);
        transcriptRef.current = data.transcript;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSampleTranscript = () => {
    setTranscriptFallback(
      "Well, to be totally candid, I would like to talk about my high school literature teacher, Mr. David. He was truly an inspirational mentor who changed how I view critical thinking. What set him apart was his unorthodox teaching style. Instead of lecturing for hours, he encouraged debate and challenged us to look at poetry from multiple angles. Even now, whenever I face complex decisions, I recall his advice to always look past surface-level assumptions."
    );
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Mode & Part Controls (Unified minimalist toolbar) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-neutral-200 dark:border-neutral-800">
        {/* Part Selection */}
        <div className="inline-flex items-center p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-xs">
          <button
            onClick={() => handlePartChange("part1")}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              selectedPart === "part1"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            Part 1 (Short Q&A)
          </button>
          <button
            onClick={() => handlePartChange("part2_cuecard")}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              selectedPart === "part2_cuecard"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            Part 2 (Cue Card)
          </button>
          <button
            onClick={() => handlePartChange("part3")}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              selectedPart === "part3"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            Part 3 (Discussion)
          </button>
        </div>

        {/* Mode Switcher & Practice Timer */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-xs">
            <button
              onClick={() => {
                setSpeakingMode("practice");
                resetRecording();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                speakingMode === "practice"
                  ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>Practice</span>
            </button>

            <button
              onClick={() => {
                setSpeakingMode("official_exam");
                resetRecording();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                speakingMode === "official_exam"
                  ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              <Timer className="w-3 h-3" />
              <span>Exam</span>
            </button>
          </div>

          {speakingMode === "official_exam" ? null : (
            <div className="flex items-center gap-1.5 text-xs border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 px-2.5 py-1.5 rounded-lg">
              <span className="text-neutral-400 font-mono text-[11px]">Timer:</span>
              <select
                value={customTimerSeconds}
                onChange={(e) => setCustomTimerSeconds(Number(e.target.value))}
                className="bg-transparent font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-pointer"
              >
                <option value={0} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">Unlimited</option>
                <option value={30} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">30 seconds</option>
                <option value={60} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">1 minute</option>
                <option value={120} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">2 minutes</option>
                <option value={180} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">3 minutes</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Cue Card & Question Box with Question Bank Selector */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4">
        {/* Top Controls: Bank Selector Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-neutral-100 dark:border-neutral-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
              IOT Question Bank
            </span>
            <span className="px-1.5 py-0.2 rounded-full font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              {currentPromptIndex >= 0
                ? `${currentPromptIndex + 1} of ${currentPartPrompts.length}`
                : `${currentPartPrompts.length} questions`}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setUseCustomPrompt(!useCustomPrompt)}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium"
            >
              {useCustomPrompt ? "Choose from bank" : "+ Custom question"}
            </button>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <button
              onClick={handleShufflePrompt}
              className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium"
              title="Pick a random question"
            >
              <Shuffle className="w-3 h-3" />
              <span>Random</span>
            </button>
            <button
              onClick={handleNextPrompt}
              className="flex items-center gap-1 px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 cursor-pointer font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
              title="Next question"
            >
              <span>Next</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <button
              onClick={handleLoadSampleTranscript}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium"
            >
              Sample answer
            </button>
          </div>
        </div>

        {/* Dropdown Question Selector */}
        {!useCustomPrompt && (
          <div className="relative">
            <select
              value={selectedPrompt.id}
              onChange={(e) => {
                const found = SPEAKING_PROMPTS.find((p) => p.id === e.target.value);
                if (found) {
                  setSelectedPrompt(found);
                  resetRecording();
                }
              }}
              className="w-full p-2.5 pr-8 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-100 appearance-none cursor-pointer focus:outline-none hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors font-medium"
            >
              {currentPartPrompts.map((p, idx) => (
                <option key={p.id} value={p.id} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 py-1">
                  #{idx + 1}: [{p.topic}] {p.question.length > 95 ? p.question.substring(0, 95) + "..." : p.question}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          </div>
        )}

        {/* Custom Question Input */}
        {useCustomPrompt && (
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-neutral-500 uppercase">
              Custom Speaking Question or Topic:
            </label>
            <textarea
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Paste or type your own IELTS speaking prompt or cue card here..."
              rows={2}
              className="w-full p-2.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
            />
          </div>
        )}

        {/* Question Topic & Text Display */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              {useCustomPrompt ? "Custom Topic" : selectedPrompt.topic}
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">
              Suggested: {selectedPart === "part2_cuecard" ? "2 mins" : selectedPart === "part1" ? "30 secs" : "1 min"}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
            {useCustomPrompt
              ? customQuestion.trim() || "Your Custom Speaking Topic"
              : selectedPrompt.question}
          </h3>

          {!useCustomPrompt && selectedPrompt.bulletPoints && selectedPrompt.bulletPoints.length > 0 && (
            <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-xs space-y-1.5 text-neutral-700 dark:text-neutral-300 mt-2">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 block mb-1">
                You should say:
              </span>
              {selectedPrompt.bulletPoints.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 1-Minute Prep Countdown & Scratchpad */}
        {speakingMode === "official_exam" && selectedPart === "part2_cuecard" && (
          <div className="p-3.5 rounded-lg border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-medium text-black dark:text-white">1-Minute Preparation:</span>
                <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                  {formatTime(prepSecondsRemaining)}
                </span>
              </div>
              {!isPrepping && prepSecondsRemaining === 60 && (
                <button
                  onClick={handleStartPrep}
                  className="px-2.5 py-1 text-xs rounded border border-black/15 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer font-medium"
                >
                  Start prep
                </button>
              )}
            </div>
            <textarea
              value={prepNotes}
              onChange={(e) => setPrepNotes(e.target.value)}
              placeholder="Jot down quick keywords and structure notes..."
              rows={2}
              className="w-full p-2 text-xs rounded border border-black/10 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Section 3: Audio Recorder (Clean minimalist controls) */}
      <div className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col items-center justify-center space-y-5 text-center">
        <div className="space-y-1">
          <div className="text-4xl font-mono font-medium text-neutral-900 dark:text-neutral-100">
            {formatTime(recordSeconds)}
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            {isRecording ? "Recording active..." : audioUrl ? "Recording captured" : "Click mic to record"}
          </span>
        </div>

        {/* Minimal wave pulse */}
        {isRecording && (
          <div className="flex items-center gap-1 h-8">
            {[30, 60, 90, 45, 95, 70, 45, 80, 55, 75].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-neutral-900 dark:bg-neutral-100 rounded-full animate-pulse"
                style={{ height: `${h}%`, animationDelay: `${(i % 4) * 0.15}s` }}
              />
            ))}
          </div>
        )}

        {/* Main Recording Button */}
        <div className="flex items-center gap-3">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 shadow-xs cursor-pointer transition-transform hover:scale-105"
              title="Record"
            >
              <Mic className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center justify-center w-14 h-14 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 shadow-xs cursor-pointer"
              title="Stop"
            >
              <Square className="w-5 h-5" />
            </button>
          )}

          {audioUrl && !isRecording && (
            <button
              onClick={resetRecording}
              className="p-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer transition-colors"
              title="Retake"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {audioUrl && (
          <div className="w-full max-w-sm pt-1">
            <audio src={audioUrl} controls className="w-full h-8" />
          </div>
        )}

        {/* Real-time Spoken Transcript Box */}
        <div className="w-full max-w-xl text-left space-y-2 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-semibold flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-neutral-400" />
              Candidate Spoken Transcript
            </span>
            {isRecording && (
              <span className="flex items-center gap-1.5 text-red-500 dark:text-rose-400/80 text-[11px] font-mono animate-pulse font-medium">
                <span className="w-2 h-2 rounded-full bg-red-500 dark:bg-rose-400/80" />
                {isListeningSpeech ? "Listening & transcribing..." : "Recording active..."}
              </span>
            )}
          </div>
          <textarea
            value={transcriptFallback}
            onChange={(e) => setTranscriptFallback(e.target.value)}
            placeholder={
              isRecording
                ? "Speak into your mic — your words will be transcribed here in real time..."
                : "Spoken transcript will appear here. You can also edit or paste directly before analyzing..."
            }
            rows={3}
            className="w-full p-3 text-xs font-mono rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
          />
          <div className="flex items-center justify-between text-[11px] text-neutral-500">
            <span>
              {transcriptFallback.trim()
                ? `${transcriptFallback.trim().split(/\s+/).filter(Boolean).length} words captured`
                : "Ready to record speech"}
            </span>
            {transcriptFallback.trim() && (
              <button
                onClick={() => setTranscriptFallback("")}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium"
              >
                Clear text
              </button>
            )}
          </div>

          {speechNotice && (
            <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>{speechNotice}</div>
            </div>
          )}

          {audioUrl && !isRecording && (
            apiKey ? (
              <div className="p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-semibold text-emerald-900 dark:text-emerald-300">
                    Gemini 3.8 Flash Direct Audio Listening Ready ({formatTime(recordSeconds)})
                  </div>
                  <div className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                    Gemini will listen directly to your audio waveform. It will transcribe your spoken words and score pronunciation, word stress, intonation, and fluency directly from your voice.
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-xs text-neutral-800 dark:text-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-neutral-600 dark:text-neutral-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                      Voice Recording Captured ({formatTime(recordSeconds)})
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      Want Gemini to listen directly to your voice instead of relying on browser speech-to-text? Connect a free Gemini key.
                    </div>
                  </div>
                </div>
                {onOpenApiKeyModal && (
                  <button
                    onClick={onOpenApiKeyModal}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-600 cursor-pointer shrink-0 transition-colors shadow-xs"
                  >
                    <Key className="w-3.5 h-3.5" />
                    Connect Free Key
                  </button>
                )}
              </div>
            )
          )}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (!audioBase64 && !transcriptFallback.trim())}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-30 cursor-pointer shadow-xs"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Listening & Evaluating Audio...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              {audioBase64 ? "Analyze Speaking (Listen to Voice)" : "Analyze Speaking"}
            </>
          )}
        </button>
      </div>

      {/* Section 4: Results View */}
      {analysisResult && (
        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-6 animate-in fade-in duration-200">
          <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                Estimated Speaking Score
              </div>
              <div className="text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Band {analysisResult.overallBand.toFixed(1)}
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md">
                {analysisResult.examinerSummary}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <RadarChart
                scores={[
                  { label: "Fluency", score: analysisResult.criteria.fluencyCoherence.score },
                  { label: "Vocab", score: analysisResult.criteria.lexicalResource.score },
                  { label: "Grammar", score: analysisResult.criteria.grammaticalRange.score },
                  { label: "Pronun.", score: analysisResult.criteria.pronunciation.score },
                ]}
                size={200}
                accentColor="#ffffff"
              />
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
              <button
                onClick={() => setShowScorecard(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-medium text-xs hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                Export Share Card
              </button>
              <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-[11px] text-neutral-600 dark:text-neutral-400">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block mb-0.5">Primary Bottleneck:</span>
                {analysisResult.primaryBottleneck}
              </div>
            </div>
          </div>

          {/* Prominent Transcribed Candidate Speech Card */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-neutral-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                  Transcribed Candidate Speech
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-500">
                  {analysisResult.speechDurationSeconds}s spoken • {analysisResult.wordsPerMinute} WPM
                </span>
                {analysisResult.overallBand <= 3.0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-500/10 text-red-600 dark:text-rose-300/80 dark:bg-rose-950/40 border border-red-500/20 dark:border-rose-900/30">
                    Insufficient Language Sample (Band {analysisResult.overallBand.toFixed(1)})
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm font-mono text-neutral-800 dark:text-neutral-200 bg-neutral-50/70 dark:bg-neutral-900/40 p-3.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 italic">
              "{analysisResult.transcript}"
            </p>
          </div>

          {/* Detailed Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <button
              onClick={() => setActiveTab("criteria")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "criteria"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              Criteria Breakdown
            </button>
            <button
              onClick={() => setActiveTab("spoken_grammar")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "spoken_grammar"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              Spoken Grammar ({analysisResult.spokenGrammarErrors?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("spoken_idioms")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "spoken_idioms"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              Spoken Idioms ({analysisResult.idiomAndPhrasalVerbUpgrades?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("speech_metrics")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "speech_metrics"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              Pacing ({analysisResult.wordsPerMinute} WPM)
            </button>
            <button
              onClick={() => setActiveTab("model_answer")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "model_answer"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              Model Answer
            </button>
          </div>

          {activeTab === "criteria" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Fluency & Coherence</span>
                  <span className="font-mono text-xs font-semibold">Band {analysisResult.criteria.fluencyCoherence.score.toFixed(1)}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{analysisResult.criteria.fluencyCoherence.feedback}</p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Lexical Resource</span>
                  <span className="font-mono text-xs font-semibold">Band {analysisResult.criteria.lexicalResource.score.toFixed(1)}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{analysisResult.criteria.lexicalResource.feedback}</p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Grammatical Range & Accuracy</span>
                  <span className="font-mono text-xs font-semibold">Band {analysisResult.criteria.grammaticalRange.score.toFixed(1)}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{analysisResult.criteria.grammaticalRange.feedback}</p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Pronunciation</span>
                  <span className="font-mono text-xs font-semibold">Band {analysisResult.criteria.pronunciation.score.toFixed(1)}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{analysisResult.criteria.pronunciation.feedback}</p>
              </div>
            </div>
          )}

          {activeTab === "spoken_grammar" && (
            <div className="space-y-3">
              {analysisResult.spokenGrammarErrors && analysisResult.spokenGrammarErrors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysisResult.spokenGrammarErrors.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-2"
                    >
                      <div className="text-xs text-neutral-400 line-through font-mono">
                        "{item.spokenSnippet}"
                      </div>
                      <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                        "{item.correctedSnippet}"
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">{item.rule}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-center space-y-1">
                  <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    No Spoken Grammar Slips Detected
                  </div>
                  <p className="text-xs text-neutral-500">
                    {analysisResult.overallBand <= 3.0
                      ? "Sample too brief to evaluate grammatical clause structures or tense inflections."
                      : "Candidate demonstrated clear spoken grammatical control without slips."}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "spoken_idioms" && (
            <div className="space-y-3">
              {analysisResult.idiomAndPhrasalVerbUpgrades && analysisResult.idiomAndPhrasalVerbUpgrades.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysisResult.idiomAndPhrasalVerbUpgrades.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-400 line-through">{item.originalPhrase}</span>
                        <span className="font-mono text-[10px] uppercase text-neutral-500">
                          {item.type.replace("_", " ")}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {item.suggestedUpgrade}
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-center space-y-1">
                  <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    No Spoken Idiom Upgrades
                  </div>
                  <p className="text-xs text-neutral-500">
                    {analysisResult.overallBand <= 3.0
                      ? "Produce sustained continuous speech (60–120 seconds) to receive tailored conversational idiom suggestions."
                      : "No specific phrase upgrades needed for this speech snippet."}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "speech_metrics" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-center">
                  <div className="text-[11px] font-mono text-neutral-500">WORDS PER MINUTE</div>
                  <div className="text-3xl font-semibold mt-1">{analysisResult.wordsPerMinute}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Target: 120-150 WPM</div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-center">
                  <div className="text-[11px] font-mono text-neutral-500">FILLER WORDS</div>
                  <div className="text-3xl font-semibold mt-1">{analysisResult.fillerWords.totalCount}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">"um, uh, like"</div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-center">
                  <div className="text-[11px] font-mono text-neutral-500">DURATION</div>
                  <div className="text-3xl font-semibold mt-1">{analysisResult.speechDurationSeconds}s</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Spoken time</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-2">
                <span className="text-xs font-mono uppercase text-neutral-500">Transcribed Answer</span>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-mono italic">
                  "{analysisResult.transcript}"
                </p>
              </div>
            </div>
          )}

          {activeTab === "model_answer" && (
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs leading-relaxed text-neutral-800 dark:text-neutral-200 font-serif italic whitespace-pre-line">
              <span className="font-sans font-mono text-[11px] uppercase text-neutral-400 not-italic block mb-2">
                Band 9 Model Transcript
              </span>
              "{analysisResult.sampleBand9Response}"
            </div>
          )}
        </div>
      )}

      {analysisResult && (
        <ScorecardModal
          isOpen={showScorecard}
          onClose={() => setShowScorecard(false)}
          title={`IELTS Speaking ${selectedPart === "part2_cuecard" ? "Part 2" : selectedPart === "part1" ? "Part 1" : "Part 3"}`}
          type="Speaking"
          overallBand={analysisResult.overallBand}
          scores={[
            { label: "Fluency", score: analysisResult.criteria.fluencyCoherence.score },
            { label: "Vocab", score: analysisResult.criteria.lexicalResource.score },
            { label: "Grammar", score: analysisResult.criteria.grammaticalRange.score },
            { label: "Pronun.", score: analysisResult.criteria.pronunciation.score },
          ]}
          primaryBottleneck={analysisResult.primaryBottleneck}
          examinerHighlight={analysisResult.criteria.fluencyCoherence.feedback}
        />
      )}
    </div>
  );
}
