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
} from "lucide-react";
import { SPEAKING_PROMPTS, SpeakingPrompt } from "@/lib/ieltsPromptBank";
import { SpeakingAnalysisResult, SpeakingPart, SpeakingMode } from "@/types/ielts";
import { RadarChart } from "../RadarChart";
import { ScorecardModal } from "../ScorecardModal";

interface SpeakingStudioProps {
  apiKey: string;
}

export function SpeakingStudio({ apiKey }: SpeakingStudioProps) {
  const [speakingMode, setSpeakingMode] = useState<SpeakingMode>("practice");
  const [selectedPart, setSelectedPart] = useState<SpeakingPart>("part2_cuecard");
  const [selectedPrompt, setSelectedPrompt] = useState<SpeakingPrompt>(SPEAKING_PROMPTS[0]);

  const [customTimerSeconds, setCustomTimerSeconds] = useState<number>(0);

  const [prepSecondsRemaining, setPrepSecondsRemaining] = useState<number>(60);
  const [isPrepping, setIsPrepping] = useState<boolean>(false);
  const [prepNotes, setPrepNotes] = useState<string>("");

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [transcriptFallback, setTranscriptFallback] = useState<string>("");
  const [useTextMode, setUseTextMode] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<SpeakingAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"criteria" | "spoken_idioms" | "speech_metrics" | "model_answer">("criteria");
  const [showScorecard, setShowScorecard] = useState<boolean>(false);

  const handlePartChange = (part: SpeakingPart) => {
    setSelectedPart(part);
    const available = SPEAKING_PROMPTS.filter((p) => p.part === part);
    if (available.length > 0) {
      setSelectedPrompt(available[0]);
    }
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
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
      setIsRecording(true);
      setRecordSeconds(0);

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
      console.warn("Microphone access denied or unsupported, enabling transcript fallback", err);
      setUseTextMode(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const resetRecording = () => {
    stopRecording();
    setAudioUrl(null);
    setAudioBase64(null);
    setRecordSeconds(0);
    setIsPrepping(false);
    setPrepSecondsRemaining(60);
  };

  const handleAnalyze = async () => {
    if (!audioBase64 && !transcriptFallback.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch("/api/grade-speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptTopic: `${selectedPrompt.topic}: ${selectedPrompt.question}`,
          audioData: audioBase64 || undefined,
          transcript: transcriptFallback || undefined,
          speakingPart: selectedPart,
          apiKey: apiKey || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Speaking grading failed");
      }

      const data: SpeakingAnalysisResult = await res.json();
      setAnalysisResult(data);
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
    setUseTextMode(true);
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Mode & Part Selector (Linear open layout with thin divider) */}
      <div className="space-y-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-black dark:text-white">
              Speaking Studio
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Select simulation mode and test part
            </p>
          </div>

          {/* Mode Switcher: Minimalist tabs */}
          <div className="inline-flex items-center p-0.5 rounded-lg border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] text-xs">
            <button
              onClick={() => {
                setSpeakingMode("practice");
                resetRecording();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                speakingMode === "practice"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>Practice (Untimed)</span>
            </button>

            <button
              onClick={() => {
                setSpeakingMode("official_exam");
                resetRecording();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                speakingMode === "official_exam"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              <Timer className="w-3 h-3" />
              <span>Official Exam (Timed)</span>
            </button>
          </div>
        </div>

        {/* Part Selection & Practice Timer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="inline-flex items-center p-0.5 rounded-lg border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] text-xs">
            <button
              onClick={() => handlePartChange("part1")}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedPart === "part1"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Part 1 (Short Q&A)
            </button>
            <button
              onClick={() => handlePartChange("part2_cuecard")}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedPart === "part2_cuecard"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Part 2 (Cue Card)
            </button>
            <button
              onClick={() => handlePartChange("part3")}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedPart === "part3"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Part 3 (Discussion)
            </button>
          </div>

          {speakingMode === "practice" && (
            <div className="flex items-center gap-2 text-xs border border-black/10 dark:border-white/15 px-2.5 py-1 rounded-lg">
              <span className="text-neutral-500 font-mono text-[11px]">Timer:</span>
              <select
                value={customTimerSeconds}
                onChange={(e) => setCustomTimerSeconds(Number(e.target.value))}
                className="bg-transparent font-medium text-black dark:text-white focus:outline-none cursor-pointer"
              >
                <option value={0} className="bg-white dark:bg-black">Unlimited</option>
                <option value={30} className="bg-white dark:bg-black">30 seconds</option>
                <option value={60} className="bg-white dark:bg-black">1 minute</option>
                <option value={120} className="bg-white dark:bg-black">2 minutes (Official)</option>
                <option value={180} className="bg-white dark:bg-black">3 minutes</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Cue Card Question Box (Thin outline rounded card) */}
      <div className="p-5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
            {selectedPrompt.topic}
          </span>
          <button
            onClick={handleLoadSampleTranscript}
            className="text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
          >
            Load sample answer
          </button>
        </div>

        <h3 className="text-base font-semibold text-black dark:text-white">
          {selectedPrompt.question}
        </h3>

        {selectedPrompt.bulletPoints && selectedPrompt.bulletPoints.length > 0 && (
          <div className="p-3.5 rounded-lg border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-xs space-y-1.5 text-neutral-700 dark:text-neutral-300">
            <span className="font-medium text-black dark:text-white block mb-1">
              You should say:
            </span>
            {selectedPrompt.bulletPoints.map((b, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-500 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        )}

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
      <div className="p-8 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black flex flex-col items-center justify-center space-y-5 text-center">
        <div className="space-y-1">
          <div className="text-4xl font-mono font-medium text-black dark:text-white">
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
                className="w-1 bg-black dark:bg-white rounded-full animate-pulse"
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
              className="flex items-center justify-center w-14 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-90 shadow-xs cursor-pointer transition-transform hover:scale-105"
              title="Record"
            >
              <Mic className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center justify-center w-14 h-14 rounded-full border border-black/20 dark:border-white/20 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 shadow-xs cursor-pointer"
              title="Stop"
            >
              <Square className="w-5 h-5" />
            </button>
          )}

          {audioUrl && !isRecording && (
            <button
              onClick={resetRecording}
              className="p-2.5 rounded-full border border-black/10 dark:border-white/15 text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
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

        {/* Transcript Fallback */}
        <div className="w-full max-w-md pt-3 border-t border-black/10 dark:border-white/10 text-center">
          <button
            onClick={() => setUseTextMode(!useTextMode)}
            className="text-xs text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
          >
            {useTextMode ? "Hide transcript" : "Or paste transcript directly"}
          </button>
          {useTextMode && (
            <div className="mt-2 text-left">
              <textarea
                value={transcriptFallback}
                onChange={(e) => setTranscriptFallback(e.target.value)}
                placeholder="Paste spoken transcript..."
                rows={3}
                className="w-full p-2.5 text-xs rounded-lg border border-black/10 dark:border-white/15 bg-white dark:bg-black text-black dark:text-white focus:outline-none"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (!audioBase64 && !transcriptFallback.trim())}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 disabled:opacity-30 cursor-pointer shadow-xs"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Evaluating speaking...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Analyze Speaking
            </>
          )}
        </button>
      </div>

      {/* Section 4: Results View */}
      {analysisResult && (
        <div className="pt-8 border-t border-black/10 dark:border-white/10 space-y-8 animate-in fade-in duration-200">
          <div className="p-6 rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                Estimated Speaking Score
              </div>
              <div className="text-5xl font-semibold tracking-tight text-black dark:text-white">
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
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-black/15 dark:border-white/20 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                Export Share Card
              </button>
              <div className="p-3 rounded-lg border border-black/10 dark:border-white/15 bg-white dark:bg-black text-[11px] text-neutral-600 dark:text-neutral-400">
                <span className="font-semibold text-black dark:text-white block mb-0.5">Primary Bottleneck:</span>
                {analysisResult.primaryBottleneck}
              </div>
            </div>
          </div>

          {/* Detailed Tabs */}
          <div className="flex flex-wrap items-center gap-1 border-b border-black/10 dark:border-white/10 pb-2">
            <button
              onClick={() => setActiveTab("criteria")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === "criteria"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Criteria Breakdown
            </button>
            <button
              onClick={() => setActiveTab("speech_metrics")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === "speech_metrics"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Pacing ({analysisResult.wordsPerMinute} WPM)
            </button>
            <button
              onClick={() => setActiveTab("spoken_idioms")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === "spoken_idioms"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Spoken Idioms
            </button>
            <button
              onClick={() => setActiveTab("model_answer")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === "model_answer"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Model Answer
            </button>
          </div>

          {activeTab === "criteria" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-black dark:text-white">Fluency & Coherence</span>
                  <span className="font-mono text-xs font-bold">Band {analysisResult.criteria.fluencyCoherence.score.toFixed(1)}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{analysisResult.criteria.fluencyCoherence.feedback}</p>
              </div>

              <div className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-black dark:text-white">Lexical Resource</span>
                  <span className="font-mono text-xs font-bold">Band {analysisResult.criteria.lexicalResource.score.toFixed(1)}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{analysisResult.criteria.lexicalResource.feedback}</p>
              </div>

              <div className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-black dark:text-white">Grammatical Range & Accuracy</span>
                  <span className="font-mono text-xs font-bold">Band {analysisResult.criteria.grammaticalRange.score.toFixed(1)}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{analysisResult.criteria.grammaticalRange.feedback}</p>
              </div>

              <div className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-black dark:text-white">Pronunciation</span>
                  <span className="font-mono text-xs font-bold">Band {analysisResult.criteria.pronunciation.score.toFixed(1)}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{analysisResult.criteria.pronunciation.feedback}</p>
              </div>
            </div>
          )}

          {activeTab === "speech_metrics" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black text-center">
                  <div className="text-[11px] font-mono text-neutral-500">WORDS PER MINUTE</div>
                  <div className="text-3xl font-semibold mt-1">{analysisResult.wordsPerMinute}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Target: 120-150 WPM</div>
                </div>

                <div className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black text-center">
                  <div className="text-[11px] font-mono text-neutral-500">FILLER WORDS</div>
                  <div className="text-3xl font-semibold mt-1">{analysisResult.fillerWords.totalCount}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">"um, uh, like"</div>
                </div>

                <div className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black text-center">
                  <div className="text-[11px] font-mono text-neutral-500">DURATION</div>
                  <div className="text-3xl font-semibold mt-1">{analysisResult.speechDurationSeconds}s</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Spoken time</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black space-y-2">
                <span className="text-xs font-mono uppercase text-neutral-500">Transcribed Answer</span>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-mono italic">
                  "{analysisResult.transcript}"
                </p>
              </div>
            </div>
          )}

          {activeTab === "spoken_idioms" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysisResult.idiomAndPhrasalVerbUpgrades.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400 line-through">{item.originalPhrase}</span>
                    <span className="font-mono text-[10px] uppercase text-neutral-500">
                      {item.type.replace("_", " ")}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-black dark:text-white">
                    {item.suggestedUpgrade}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">{item.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "model_answer" && (
            <div className="p-5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black text-xs leading-relaxed text-neutral-800 dark:text-neutral-200 font-serif italic whitespace-pre-line">
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
