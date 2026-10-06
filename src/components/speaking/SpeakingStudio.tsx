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
  // Mode selection
  const [speakingMode, setSpeakingMode] = useState<SpeakingMode>("practice");
  const [selectedPart, setSelectedPart] = useState<SpeakingPart>("part2_cuecard");
  const [selectedPrompt, setSelectedPrompt] = useState<SpeakingPrompt>(SPEAKING_PROMPTS[0]);

  // Practice mode custom timer options (0 = no timer)
  const [customTimerSeconds, setCustomTimerSeconds] = useState<number>(0);

  // Official exam timing states
  const [prepSecondsRemaining, setPrepSecondsRemaining] = useState<number>(60);
  const [isPrepping, setIsPrepping] = useState<boolean>(false);
  const [prepNotes, setPrepNotes] = useState<string>("");

  // Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [transcriptFallback, setTranscriptFallback] = useState<string>("");
  const [useTextMode, setUseTextMode] = useState<boolean>(false);

  // MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<SpeakingAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"criteria" | "spoken_idioms" | "speech_metrics" | "model_answer">("criteria");
  const [showScorecard, setShowScorecard] = useState<boolean>(false);

  // Handle Part switch
  const handlePartChange = (part: SpeakingPart) => {
    setSelectedPart(part);
    const available = SPEAKING_PROMPTS.filter((p) => p.part === part);
    if (available.length > 0) {
      setSelectedPrompt(available[0]);
    }
    resetRecording();
  };

  // Timer formatted string
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Start 1-minute prep for Part 2 cue cards in Official Exam mode
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

  // Audio Recording handlers
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
    <div className="space-y-6">
      {/* Top Banner / Mode Controls */}
      <div className="border-2 border-gray-900 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b-2 border-gray-900 dark:border-gray-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-black uppercase bg-red-600 text-white tracking-wider mb-2">
              <Mic className="w-3 h-3" /> OFFICIAL SPEAKING SIMULATOR
            </div>
            <h2 className="text-2xl font-black text-gray-950 dark:text-white uppercase tracking-tight">
              IELTS Speaking Studio
            </h2>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">
              Evaluated strictly on Fluency & Coherence, Lexical Resource, Spoken Grammar, and Pronunciation.
            </p>
          </div>

          {/* Mode Selector: Sharp Segments */}
          <div className="flex items-center border-2 border-gray-900 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-xs font-bold">
            <button
              onClick={() => {
                setSpeakingMode("practice");
                resetRecording();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 transition-all ${
                speakingMode === "practice"
                  ? "bg-red-600 text-white font-black"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              PRACTICE (UNTIMED / CUSTOM)
            </button>

            <button
              onClick={() => {
                setSpeakingMode("official_exam");
                resetRecording();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 border-l-2 border-gray-900 dark:border-gray-700 transition-all ${
                speakingMode === "official_exam"
                  ? "bg-red-600 text-white font-black"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              OFFICIAL EXAM (REAL TIMERS)
            </button>
          </div>
        </div>

        {/* IELTS Speaking Part Selector */}
        <div className="pt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center border-2 border-gray-900 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-xs font-bold">
            <button
              onClick={() => handlePartChange("part1")}
              className={`px-3 py-1.5 transition-all ${
                selectedPart === "part1"
                  ? "bg-red-600 text-white font-black"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              Part 1 (Short Q&A)
            </button>
            <button
              onClick={() => handlePartChange("part2_cuecard")}
              className={`px-3 py-1.5 border-l-2 border-gray-900 dark:border-gray-700 transition-all ${
                selectedPart === "part2_cuecard"
                  ? "bg-red-600 text-white font-black"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              Part 2 (Cue Card • 2 Mins)
            </button>
            <button
              onClick={() => handlePartChange("part3")}
              className={`px-3 py-1.5 border-l-2 border-gray-900 dark:border-gray-700 transition-all ${
                selectedPart === "part3"
                  ? "bg-red-600 text-white font-black"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              Part 3 (Discussion)
            </button>
          </div>

          {/* Practice Custom Timer */}
          {speakingMode === "practice" && (
            <div className="flex items-center gap-2 text-xs border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 font-bold">
              <span className="text-gray-700 dark:text-gray-300 uppercase">Timer:</span>
              <select
                value={customTimerSeconds}
                onChange={(e) => setCustomTimerSeconds(Number(e.target.value))}
                className="bg-transparent font-black text-red-600 dark:text-red-400 focus:outline-none"
              >
                <option value={0}>No Timer (Unlimited)</option>
                <option value={30}>30 Seconds</option>
                <option value={60}>1 Minute</option>
                <option value={120}>2 Minutes (Official Cue Card)</option>
                <option value={180}>3 Minutes</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Selected Topic & Authentic Cue Card View */}
      <div className="border-2 border-gray-900 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-gray-900 dark:border-gray-800">
          <span className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest">
            {selectedPrompt.topic}
          </span>
          <button
            onClick={handleLoadSampleTranscript}
            className="text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white font-bold underline cursor-pointer"
          >
            Load Sample Spoken Answer
          </button>
        </div>

        <h3 className="text-lg font-black text-gray-950 dark:text-white leading-snug">
          {selectedPrompt.question}
        </h3>

        {/* If Part 2 Cue Card: display bullet prompts */}
        {selectedPrompt.bulletPoints && selectedPrompt.bulletPoints.length > 0 && (
          <div className="p-4 border-l-4 border-red-600 bg-gray-50 dark:bg-gray-800/80 border-t border-r border-b border-gray-200 dark:border-gray-700 text-xs space-y-2 text-gray-800 dark:text-gray-200">
            <span className="font-black text-gray-950 dark:text-white uppercase tracking-wider block">
              Candidate Instructions — You should say:
            </span>
            {selectedPrompt.bulletPoints.map((b, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 shrink-0" />
                <span className="font-medium">{b}</span>
              </div>
            ))}
          </div>
        )}

        {/* Mode 2 Cue Card 1-Minute Prep Countdown & Scratchpad */}
        {speakingMode === "official_exam" && selectedPart === "part2_cuecard" && (
          <div className="p-4 border-2 border-red-600 bg-red-50/50 dark:bg-red-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="text-xs font-black uppercase tracking-wider text-gray-950 dark:text-white">
                  Official 1-Minute Prep Countdown:
                </span>
                <span className="font-mono text-sm font-black text-red-600 dark:text-red-400">
                  {formatTime(prepSecondsRemaining)}
                </span>
              </div>

              {!isPrepping && prepSecondsRemaining === 60 && (
                <button
                  onClick={handleStartPrep}
                  className="px-3 py-1 text-xs font-black uppercase bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                >
                  Start 1-Min Prep
                </button>
              )}
            </div>

            <textarea
              value={prepNotes}
              onChange={(e) => setPrepNotes(e.target.value)}
              placeholder="Candidate Scratchpad: Jot down keywords and collocations during your 1-minute preparation..."
              rows={2}
              className="w-full p-2.5 text-xs border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:border-red-600 font-medium"
            />
          </div>
        )}
      </div>

      {/* Audio Recorder & Controls */}
      <div className="border-2 border-gray-900 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] flex flex-col items-center justify-center space-y-6 text-center">
        {/* Live Audio Visualizer / Timer Display */}
        <div className="space-y-1">
          <div className="text-5xl font-mono font-black text-gray-950 dark:text-white tracking-widest">
            {formatTime(recordSeconds)}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {isRecording
              ? "Recording active... Speak clearly into your microphone"
              : audioUrl
              ? "Audio captured! Ready for evaluation"
              : "Click the red microphone to record"}
          </span>
        </div>

        {/* Animated Waveform when recording */}
        {isRecording && (
          <div className="flex items-center gap-1.5 h-10">
            {[40, 70, 95, 45, 100, 75, 50, 90, 60, 85, 45, 80, 95, 60].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-red-600 animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDelay: `${(i % 5) * 0.12}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Main Mic Button: Sharp style */}
        <div className="flex items-center gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center justify-center w-20 h-20 border-3 border-gray-900 dark:border-white bg-red-600 hover:bg-red-700 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] transition-all cursor-pointer"
              title="Start recording"
            >
              <Mic className="w-8 h-8" />
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center justify-center w-20 h-20 border-3 border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
              title="Stop recording"
            >
              <Square className="w-8 h-8" />
            </button>
          )}

          {audioUrl && !isRecording && (
            <button
              onClick={resetRecording}
              className="p-3 border-2 border-gray-900 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-red-600 cursor-pointer"
              title="Retake recording"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Audio Player playback if recorded */}
        {audioUrl && (
          <div className="w-full max-w-md pt-2">
            <audio src={audioUrl} controls className="w-full h-10 border border-gray-300 dark:border-gray-700" />
          </div>
        )}

        {/* Text Transcript Fallback */}
        <div className="w-full max-w-xl pt-4 border-t-2 border-gray-100 dark:border-gray-800 text-center">
          <button
            onClick={() => setUseTextMode(!useTextMode)}
            className="text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-red-600 underline cursor-pointer"
          >
            {useTextMode ? "Hide transcript input" : "Or type / paste spoken transcript directly"}
          </button>

          {useTextMode && (
            <div className="mt-3 text-left">
              <textarea
                value={transcriptFallback}
                onChange={(e) => setTranscriptFallback(e.target.value)}
                placeholder="Paste what was spoken here..."
                rows={3}
                className="w-full p-3 text-xs border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:border-red-600"
              />
            </div>
          )}
        </div>

        {/* Evaluate Button */}
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (!audioBase64 && !transcriptFallback.trim())}
          className="flex items-center gap-2 px-7 py-3.5 font-black text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white transition-all border-2 border-red-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              EVALUATING SPEAKING RESPONSE...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              ANALYZE SPEAKING WITH OFFICIAL RUBRIC
            </>
          )}
        </button>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="border-2 border-gray-900 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] space-y-8 animate-in fade-in duration-200">
          {/* Header Score Overview */}
          <div className="border-2 border-gray-900 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-black uppercase bg-red-600 text-white tracking-wider">
                <Award className="w-3.5 h-3.5" /> ESTIMATED SPEAKING BAND
              </div>
              <div className="text-6xl font-black text-gray-950 dark:text-white tracking-tight flex items-baseline justify-center lg:justify-start gap-2">
                <span className="text-red-600 dark:text-red-500">{analysisResult.overallBand.toFixed(1)}</span>
                <span className="text-lg text-gray-500 font-bold">/ 9.0</span>
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 max-w-md">
                {analysisResult.examinerSummary}
              </p>
            </div>

            {/* Radar Spider Chart */}
            <div className="flex flex-col items-center">
              <RadarChart
                scores={[
                  { label: "Fluency/Coh.", score: analysisResult.criteria.fluencyCoherence.score },
                  { label: "Spoken Vocab", score: analysisResult.criteria.lexicalResource.score },
                  { label: "Grammar Range", score: analysisResult.criteria.grammaticalRange.score },
                  { label: "Pronunciation", score: analysisResult.criteria.pronunciation.score },
                ]}
                size={220}
              />
            </div>

            {/* Share Card Trigger */}
            <div className="flex flex-col gap-2.5 w-full lg:w-auto">
              <button
                onClick={() => setShowScorecard(true)}
                className="flex items-center justify-center gap-2 px-5 py-3 font-black text-xs uppercase tracking-wider border-2 border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-950 hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white hover:border-red-600 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                GENERATE FACEBOOK SCORECARD
              </button>
              <div className="p-3 border-2 border-red-600 bg-red-50 dark:bg-red-950/40 text-xs text-red-900 dark:text-red-300">
                <span className="font-black uppercase block mb-0.5">Primary Bottleneck:</span>
                {analysisResult.primaryBottleneck}
              </div>
            </div>
          </div>

          {/* Results Navigation Tabs */}
          <div className="flex flex-wrap items-center border-b-2 border-gray-900 dark:border-gray-800 pb-px gap-1">
            <button
              onClick={() => setActiveTab("criteria")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-black uppercase tracking-wider border-2 transition-all ${
                activeTab === "criteria"
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-100"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              4 Criteria Breakdown
            </button>

            <button
              onClick={() => setActiveTab("speech_metrics")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-black uppercase tracking-wider border-2 transition-all ${
                activeTab === "speech_metrics"
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-100"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              Pacing & Filler Words ({analysisResult.wordsPerMinute} WPM)
            </button>

            <button
              onClick={() => setActiveTab("spoken_idioms")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-black uppercase tracking-wider border-2 transition-all ${
                activeTab === "spoken_idioms"
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Spoken Idioms & Phrasal Verbs
            </button>

            <button
              onClick={() => setActiveTab("model_answer")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-black uppercase tracking-wider border-2 transition-all ${
                activeTab === "model_answer"
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-100"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Band 9 Model Transcript
            </button>
          </div>

          {/* TAB 1: 4 Criteria Breakdown */}
          {activeTab === "criteria" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Fluency & Coherence */}
              <div className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b-2 border-gray-900 dark:border-gray-700">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                    1. Fluency & Coherence
                  </h4>
                  <span className="px-2 py-0.5 text-xs font-black bg-red-600 text-white">
                    BAND {analysisResult.criteria.fluencyCoherence.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {analysisResult.criteria.fluencyCoherence.feedback}
                </p>
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-wider">Strengths:</div>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-0.5 pl-1">
                    {analysisResult.criteria.fluencyCoherence.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                  <div className="text-amber-700 dark:text-amber-400 font-black uppercase tracking-wider pt-2">Examiner Advice:</div>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-0.5 pl-1">
                    {analysisResult.criteria.fluencyCoherence.keyRecommendations.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Lexical Resource */}
              <div className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b-2 border-gray-900 dark:border-gray-700">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                    2. Lexical Resource (Spoken)
                  </h4>
                  <span className="px-2 py-0.5 text-xs font-black bg-red-600 text-white">
                    BAND {analysisResult.criteria.lexicalResource.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {analysisResult.criteria.lexicalResource.feedback}
                </p>
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-wider">Strengths:</div>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-0.5 pl-1">
                    {analysisResult.criteria.lexicalResource.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                  <div className="text-amber-700 dark:text-amber-400 font-black uppercase tracking-wider pt-2">Examiner Advice:</div>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-0.5 pl-1">
                    {analysisResult.criteria.lexicalResource.keyRecommendations.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Grammatical Range */}
              <div className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b-2 border-gray-900 dark:border-gray-700">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                    3. Grammatical Range & Accuracy
                  </h4>
                  <span className="px-2 py-0.5 text-xs font-black bg-red-600 text-white">
                    BAND {analysisResult.criteria.grammaticalRange.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {analysisResult.criteria.grammaticalRange.feedback}
                </p>
                {analysisResult.spokenGrammarErrors.length > 0 && (
                  <div className="space-y-2 pt-1 text-xs">
                    <span className="font-black text-red-600 uppercase">Spoken Grammar Slips Flagged:</span>
                    {analysisResult.spokenGrammarErrors.map((err, idx) => (
                      <div key={idx} className="p-2.5 border-2 border-red-600 bg-red-50 dark:bg-red-950/40 text-gray-900 dark:text-gray-100">
                        <span className="line-through text-red-600">{err.spokenSnippet}</span> →{" "}
                        <span className="font-black text-emerald-700 dark:text-emerald-400">
                          {err.correctedSnippet}
                        </span>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5 font-medium">{err.rule}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pronunciation */}
              <div className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b-2 border-gray-900 dark:border-gray-700">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                    4. Pronunciation & Intelligibility
                  </h4>
                  <span className="px-2 py-0.5 text-xs font-black bg-red-600 text-white">
                    BAND {analysisResult.criteria.pronunciation.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {analysisResult.criteria.pronunciation.feedback}
                </p>
                <div className="p-3 border-2 border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-xs space-y-1 text-sky-950 dark:text-sky-200">
                  <p><strong>Phonetic Focus:</strong> {analysisResult.pronunciationNotes.phoneticIssue}</p>
                  <p><strong>Words to check:</strong> {analysisResult.pronunciationNotes.wordsAffected.join(", ")}</p>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 font-medium">
                    {analysisResult.pronunciationNotes.intonationFeedback}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Pacing & Filler Word Metrics */}
          {activeTab === "speech_metrics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 text-center">
                  <div className="text-xs font-black uppercase text-gray-500">Words Per Minute</div>
                  <div className="text-4xl font-black text-gray-950 dark:text-white mt-1">
                    {analysisResult.wordsPerMinute}
                  </div>
                  <div className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 mt-1 uppercase">
                    {analysisResult.pacingAssessment === "ideal" ? "Optimal Pacing (120-150)" : analysisResult.pacingAssessment}
                  </div>
                </div>

                <div className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 text-center">
                  <div className="text-xs font-black uppercase text-gray-500">Total Filler Words</div>
                  <div className="text-4xl font-black text-gray-950 dark:text-white mt-1">
                    {analysisResult.fillerWords.totalCount}
                  </div>
                  <div className="text-[11px] font-medium text-gray-500 mt-1">"um", "uh", "like", "you know"</div>
                </div>

                <div className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 text-center">
                  <div className="text-xs font-black uppercase text-gray-500">Speech Duration</div>
                  <div className="text-4xl font-black text-gray-950 dark:text-white mt-1">
                    {analysisResult.speechDurationSeconds}s
                  </div>
                  <div className="text-[11px] font-medium text-gray-500 mt-1">Target: ~120s for Part 2</div>
                </div>
              </div>

              {/* Filler words breakdown */}
              <div className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white pb-2 border-b-2 border-gray-900 dark:border-gray-700">
                  Hesitation & Filler Words Breakdown
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.fillerWords.breakdown.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 border-2 border-gray-900 dark:border-gray-700 text-xs font-black text-gray-900 dark:text-gray-100"
                    >
                      "{item.word}": <span className="text-red-600">{item.count} times</span>
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 pt-1 font-medium">
                  {analysisResult.fillerWords.frequencyAnalysis}
                </p>
              </div>

              {/* Transcript */}
              <div className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white pb-2 border-b-2 border-gray-900 dark:border-gray-700">
                  Transcribed Candidate Speech
                </h4>
                <p className="text-xs leading-relaxed text-gray-900 dark:text-gray-100 font-mono italic">
                  "{analysisResult.transcript}"
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Spoken Idioms & Phrasal Verbs */}
          {activeTab === "spoken_idioms" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.idiomAndPhrasalVerbUpgrades.map((item, idx) => (
                  <div
                    key={idx}
                    className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 line-through">
                        {item.originalPhrase}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-red-600 text-white">
                        {item.type.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-base font-black text-red-600 dark:text-red-400">
                      <Sparkles className="w-4 h-4" />
                      <span>{item.suggestedUpgrade}</span>
                    </div>

                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.explanation}</p>

                    <div className="p-3 border-l-4 border-gray-900 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-gray-100 font-medium italic">
                      "{item.exampleInSentence}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Band 9 Model Response */}
          {activeTab === "model_answer" && (
            <div className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white pb-2 border-b-2 border-gray-900 dark:border-gray-700">
                <Award className="w-4 h-4 text-red-600" />
                Examiner Band 9.0 Spoken Model Transcript
              </div>
              <div className="p-5 border-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm leading-relaxed text-gray-900 dark:text-gray-100 font-serif whitespace-pre-line italic">
                "{analysisResult.sampleBand9Response}"
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sharecard Modal */}
      {analysisResult && (
        <ScorecardModal
          isOpen={showScorecard}
          onClose={() => setShowScorecard(false)}
          title={`IELTS Speaking ${selectedPart === "part2_cuecard" ? "Part 2" : selectedPart === "part1" ? "Part 1" : "Part 3"}`}
          type="Speaking"
          overallBand={analysisResult.overallBand}
          scores={[
            { label: "Fluency/Coh.", score: analysisResult.criteria.fluencyCoherence.score },
            { label: "Spoken Vocab", score: analysisResult.criteria.lexicalResource.score },
            { label: "Spoken Gram.", score: analysisResult.criteria.grammaticalRange.score },
            { label: "Pronunciation", score: analysisResult.criteria.pronunciation.score },
          ]}
          primaryBottleneck={analysisResult.primaryBottleneck}
          examinerHighlight={analysisResult.criteria.fluencyCoherence.feedback}
        />
      )}
    </div>
  );
}
