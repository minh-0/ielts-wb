"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Clock,
  Play,
  Square,
  Sparkles,
  Award,
  Layers,
  Volume2,
  AlertCircle,
  Share2,
  RefreshCw,
  Sliders,
  Timer,
  CheckCircle,
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
      // Automatically prompt to record
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

        // Convert blob to base64 for API
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Strip out data URL prefix
          const base64Clean = base64String.split(",")[1];
          setAudioBase64(base64Clean);
        };

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordSeconds(0);

      // Start recording timer
      timerIntervalRef.current = setInterval(() => {
        setRecordSeconds((prev) => {
          // If in Official Exam Part 2 mode, cap at 120s
          if (speakingMode === "official_exam" && selectedPart === "part2_cuecard" && prev >= 120) {
            stopRecording();
            return 120;
          }
          // If custom timer is set in practice mode
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
      {/* Top Banner / Mode Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-1.5">
              <Mic className="w-3 h-3" /> OFFICIAL SPEAKING SIMULATOR
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">IELTS Speaking Studio</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Evaluated on Fluency & Coherence, Lexical Resource, Spoken Grammar, and Pronunciation.
            </p>
          </div>

          {/* Mode Selector: Practice vs Official Exam */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold">
            <button
              onClick={() => {
                setSpeakingMode("practice");
                resetRecording();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                speakingMode === "practice"
                  ? "bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Practice Mode (Untimed/Custom)
            </button>

            <button
              onClick={() => {
                setSpeakingMode("official_exam");
                resetRecording();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                speakingMode === "official_exam"
                  ? "bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Timer className="w-3.5 h-3.5 text-red-500" />
              Official Exam Mode (Real Timers)
            </button>
          </div>
        </div>

        {/* IELTS Speaking Part Selector */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-1">
              Part:
            </span>
            <button
              onClick={() => handlePartChange("part1")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPart === "part1"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              Part 1 (Short Q&A)
            </button>
            <button
              onClick={() => handlePartChange("part2_cuecard")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPart === "part2_cuecard"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              Part 2 (Cue Card • 2 Mins)
            </button>
            <button
              onClick={() => handlePartChange("part3")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPart === "part3"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              Part 3 (Discussion)
            </button>
          </div>

          {/* Practice Custom Timer Slider */}
          {speakingMode === "practice" && (
            <div className="flex items-center gap-3 text-xs bg-gray-50 dark:bg-gray-800/80 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Practice Timer:</span>
              <select
                value={customTimerSeconds}
                onChange={(e) => setCustomTimerSeconds(Number(e.target.value))}
                className="bg-transparent font-bold text-red-600 dark:text-red-400 focus:outline-none"
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

      {/* Selected Topic & Cue Card View */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
            {selectedPrompt.topic}
          </span>
          <button
            onClick={handleLoadSampleTranscript}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
          >
            Load Sample Spoken Answer
          </button>
        </div>

        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-snug">
          {selectedPrompt.question}
        </h3>

        {/* If Part 2 Cue Card: display bullet prompts */}
        {selectedPrompt.bulletPoints && selectedPrompt.bulletPoints.length > 0 && (
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 text-xs space-y-1.5 text-gray-700 dark:text-gray-300">
            <span className="font-bold text-gray-900 dark:text-white block mb-1">
              You should say:
            </span>
            {selectedPrompt.bulletPoints.map((b, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        )}

        {/* Mode 2 Cue Card 1-Minute Prep Countdown & Scratchpad */}
        {speakingMode === "official_exam" && selectedPart === "part2_cuecard" && (
          <div className="p-4 rounded-xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  Official 1-Minute Preparation Countdown:
                </span>
                <span className="font-mono text-sm font-black text-red-600 dark:text-red-400">
                  {formatTime(prepSecondsRemaining)}
                </span>
              </div>

              {!isPrepping && prepSecondsRemaining === 60 && (
                <button
                  onClick={handleStartPrep}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
                >
                  Start 1-Min Prep
                </button>
              )}
            </div>

            <textarea
              value={prepNotes}
              onChange={(e) => setPrepNotes(e.target.value)}
              placeholder="Scratchpad for quick bullet notes during your 1-minute prep (Keywords, vocabulary ideas)..."
              rows={2}
              className="w-full p-2.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        )}
      </div>

      {/* Audio Recorder & Controls */}
      <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col items-center justify-center space-y-6">
        {/* Live Audio Visualizer / Timer Display */}
        <div className="flex flex-col items-center space-y-2">
          <div className="text-4xl md:text-5xl font-mono font-black text-gray-900 dark:text-white tracking-wider">
            {formatTime(recordSeconds)}
          </div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {isRecording
              ? "Recording in progress... Speak clearly into your microphone"
              : audioUrl
              ? "Recording captured! Ready for examiner analysis"
              : "Click the red microphone to begin recording"}
          </span>
        </div>

        {/* Animated Waveform when recording */}
        {isRecording && (
          <div className="flex items-center gap-1.5 h-12">
            {[40, 65, 85, 45, 95, 70, 50, 90, 60, 80, 45, 75, 90, 60].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-red-500 animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDelay: `${(i % 5) * 0.15}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Main Mic Button */}
        <div className="flex items-center gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="relative flex items-center justify-center w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl hover:shadow-red-600/40 transition-all transform hover:scale-105 cursor-pointer"
              title="Start recording"
            >
              <Mic className="w-8 h-8" />
              <span className="absolute -inset-1 rounded-full border-2 border-red-500/40 animate-ping pointer-events-none" />
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 shadow-xl transition-all transform hover:scale-105 cursor-pointer"
              title="Stop recording"
            >
              <Square className="w-7 h-7" />
            </button>
          )}

          {audioUrl && !isRecording && (
            <button
              onClick={resetRecording}
              className="p-3 text-xs font-medium text-gray-500 hover:text-red-500 rounded-full border border-gray-200 dark:border-gray-700"
              title="Retake recording"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Audio Player playback if recorded */}
        {audioUrl && (
          <div className="w-full max-w-md pt-2">
            <audio src={audioUrl} controls className="w-full h-10 rounded-xl" />
          </div>
        )}

        {/* Text Transcript Fallback (Optional) */}
        <div className="w-full max-w-xl pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
          <button
            onClick={() => setUseTextMode(!useTextMode)}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 underline"
          >
            {useTextMode ? "Hide transcript input" : "Or type / paste spoken transcript directly"}
          </button>

          {useTextMode && (
            <div className="mt-3 text-left">
              <textarea
                value={transcriptFallback}
                onChange={(e) => setTranscriptFallback(e.target.value)}
                placeholder="Paste what was said in spoken conversational English..."
                rows={3}
                className="w-full p-3 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          )}
        </div>

        {/* Evaluate Button */}
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (!audioBase64 && !transcriptFallback.trim())}
          className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white transition-all shadow-md hover:shadow-red-600/30 cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Evaluating Speaking Response...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analyze Speaking with Official Rubric
            </>
          )}
        </button>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg space-y-8 animate-in fade-in duration-300">
          {/* Header Score Overview */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-red-500/10 via-transparent to-red-500/5 border border-red-500/20">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs">
                <Award className="w-3.5 h-3.5" /> OFFICIAL ESTIMATED SPEAKING BAND
              </div>
              <div className="text-6xl font-black text-gray-900 dark:text-white tracking-tight flex items-baseline justify-center lg:justify-start gap-2">
                <span className="text-red-600 dark:text-red-500">{analysisResult.overallBand.toFixed(1)}</span>
                <span className="text-lg text-gray-400 font-normal">/ 9.0</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md">
                {analysisResult.examinerSummary}
              </p>
            </div>

            {/* Radar Spider Chart */}
            <div className="flex flex-col items-center">
              <RadarChart
                scores={[
                  { label: "Fluency & Coh.", score: analysisResult.criteria.fluencyCoherence.score },
                  { label: "Spoken Vocab", score: analysisResult.criteria.lexicalResource.score },
                  { label: "Grammar Range", score: analysisResult.criteria.grammaticalRange.score },
                  { label: "Pronunciation", score: analysisResult.criteria.pronunciation.score },
                ]}
                size={230}
              />
            </div>

            {/* Share Card Trigger */}
            <div className="flex flex-col gap-2 w-full lg:w-auto">
              <button
                onClick={() => setShowScorecard(true)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-md cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-red-500" />
                Generate Scorecard for Facebook
              </button>
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-800/30 text-[11px] text-red-600 dark:text-red-400">
                <span className="font-bold block">Primary Bottleneck:</span>
                {analysisResult.primaryBottleneck}
              </div>
            </div>
          </div>

          {/* Results Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
            <button
              onClick={() => setActiveTab("criteria")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "criteria"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              4 Criteria Breakdown
            </button>

            <button
              onClick={() => setActiveTab("speech_metrics")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "speech_metrics"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              Pacing & Filler Words ({analysisResult.wordsPerMinute} WPM)
            </button>

            <button
              onClick={() => setActiveTab("spoken_idioms")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "spoken_idioms"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Spoken Idioms & Phrasal Verbs
            </button>

            <button
              onClick={() => setActiveTab("model_answer")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "model_answer"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
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
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    1. Fluency & Coherence
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white">
                    Band {analysisResult.criteria.fluencyCoherence.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {analysisResult.criteria.fluencyCoherence.feedback}
                </p>
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold">Strengths:</div>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-0.5 pl-1">
                    {analysisResult.criteria.fluencyCoherence.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                  <div className="text-amber-600 dark:text-amber-400 font-semibold pt-1">Examiner Advice:</div>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-0.5 pl-1">
                    {analysisResult.criteria.fluencyCoherence.keyRecommendations.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Lexical Resource */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    2. Lexical Resource (Spoken)
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white">
                    Band {analysisResult.criteria.lexicalResource.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {analysisResult.criteria.lexicalResource.feedback}
                </p>
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold">Strengths:</div>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-0.5 pl-1">
                    {analysisResult.criteria.lexicalResource.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                  <div className="text-amber-600 dark:text-amber-400 font-semibold pt-1">Examiner Advice:</div>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-0.5 pl-1">
                    {analysisResult.criteria.lexicalResource.keyRecommendations.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Grammatical Range & Accuracy */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    3. Grammatical Range & Accuracy
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white">
                    Band {analysisResult.criteria.grammaticalRange.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {analysisResult.criteria.grammaticalRange.feedback}
                </p>
                {analysisResult.spokenGrammarErrors.length > 0 && (
                  <div className="space-y-1.5 pt-1 text-xs">
                    <span className="font-semibold text-red-500">Spoken Grammar Slips Flagged:</span>
                    {analysisResult.spokenGrammarErrors.map((err, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-red-500/10 text-gray-700 dark:text-gray-300">
                        <span className="line-through text-red-500">{err.spokenSnippet}</span> →{" "}
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {err.correctedSnippet}
                        </span>
                        <p className="text-[10px] text-gray-500 mt-0.5">{err.rule}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pronunciation & Intelligibility */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    4. Pronunciation & Intelligibility
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white">
                    Band {analysisResult.criteria.pronunciation.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {analysisResult.criteria.pronunciation.feedback}
                </p>
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs space-y-1 text-sky-800 dark:text-sky-300">
                  <p><strong>Phonetic Focus:</strong> {analysisResult.pronunciationNotes.phoneticIssue}</p>
                  <p><strong>Words to check:</strong> {analysisResult.pronunciationNotes.wordsAffected.join(", ")}</p>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
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
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 text-center">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Words Per Minute</div>
                  <div className="text-4xl font-black text-gray-900 dark:text-white mt-1">
                    {analysisResult.wordsPerMinute}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 uppercase">
                    {analysisResult.pacingAssessment === "ideal" ? "Optimal Pacing (120-150)" : analysisResult.pacingAssessment}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 text-center">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Filler Words</div>
                  <div className="text-4xl font-black text-gray-900 dark:text-white mt-1">
                    {analysisResult.fillerWords.totalCount}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">"um", "uh", "like", "you know"</div>
                </div>

                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 text-center">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Speech Duration</div>
                  <div className="text-4xl font-black text-gray-900 dark:text-white mt-1">
                    {analysisResult.speechDurationSeconds}s
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Target: ~120s for Part 2</div>
                </div>
              </div>

              {/* Filler words breakdown */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Hesitation & Filler Words Breakdown
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.fillerWords.breakdown.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-800 dark:text-gray-200"
                    >
                      "{item.word}": <span className="text-red-500">{item.count} times</span>
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                  {analysisResult.fillerWords.frequencyAnalysis}
                </p>
              </div>

              {/* Transcript */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Transcribed Candidate Speech
                </h4>
                <p className="text-xs leading-relaxed text-gray-800 dark:text-gray-200 font-mono italic">
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
                    className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 line-through">
                        {item.originalPhrase}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                        {item.type.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-base font-bold text-red-600 dark:text-red-400">
                      <Sparkles className="w-4 h-4" />
                      <span>{item.suggestedUpgrade}</span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300">{item.explanation}</p>

                    <div className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/80 text-xs text-gray-700 dark:text-gray-300 italic">
                      "{item.exampleInSentence}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Band 9 Model Response */}
          {activeTab === "model_answer" && (
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <Award className="w-4 h-4 text-red-500" />
                Examiner Band 9.0 Spoken Model Transcript
              </div>
              <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/80 text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-serif whitespace-pre-line italic">
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
