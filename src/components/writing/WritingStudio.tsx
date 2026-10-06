"use client";

import React, { useState, useEffect } from "react";
import {
  PenTool,
  Clock,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Share2,
  RefreshCw,
  Lightbulb,
  Award,
  Layers,
  Check,
  ChevronDown,
} from "lucide-react";
import { WRITING_PROMPTS, WritingPrompt } from "@/lib/ieltsPromptBank";
import { WritingAnalysisResult, TaskType } from "@/types/ielts";
import { RadarChart } from "../RadarChart";
import { ScorecardModal } from "../ScorecardModal";

interface WritingStudioProps {
  apiKey: string;
}

export function WritingStudio({ apiKey }: WritingStudioProps) {
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType>("task2");
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt>(WRITING_PROMPTS[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  const [essayContent, setEssayContent] = useState("");
  
  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(40 * 60);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WritingAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"criteria" | "sentences" | "vocab_studio" | "model_answer">("criteria");
  const [showScorecard, setShowScorecard] = useState(false);

  // Word count
  const words = essayContent.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const targetWords = selectedTaskType === "task2" ? 250 : 150;
  const isWordCountMet = wordCount >= targetWords;

  // Handle Timer
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsRemaining]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTaskTypeChange = (type: TaskType) => {
    setSelectedTaskType(type);
    const available = WRITING_PROMPTS.filter((p) => p.type === type);
    if (available.length > 0) {
      setSelectedPrompt(available[0]);
    }
    setSecondsRemaining(type === "task2" ? 40 * 60 : 20 * 60);
    setTimerRunning(false);
  };

  const handleAnalyze = async () => {
    if (!essayContent.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    const activePromptText = useCustomPrompt
      ? customPrompt
      : `${selectedPrompt.title}: ${selectedPrompt.prompt}`;

    try {
      const res = await fetch("/api/grade-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptText: activePromptText,
          essayText: essayContent,
          taskType: selectedTaskType,
          apiKey: apiKey || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Grading request failed");
      }

      const data: WritingAnalysisResult = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSampleEssay = () => {
    setEssayContent(
      `In contemporary society, the trajectory of modern technology presents both remarkable advantages and complex ethical quandaries. Proponents contend that automation substantially enhances productivity, freeing individuals from menial labor. Furthermore, algorithmic efficiencies optimize industrial supply chains and foster global scientific collaboration.\n\nConversely, skeptics caution that unregulated artificial intelligence could exacerbate socioeconomic disparities and induce severe structural unemployment. If machines replace entry-level cognitive tasks, young graduates may encounter unprecedented barriers to workplace integration. In addition, privacy concerns have become increasingly prominent.\n\nOn balance, while technological innovation inevitably disrupts conventional labor markets, proactive regulatory frameworks and comprehensive retraining initiatives can effectively harness these transformations for the collective good.`
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Mode Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-1.5">
              <PenTool className="w-3 h-3" /> OFFICIAL RUBRIC GRADER
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">IELTS Writing Studio</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Evaluated strictly on Task Response, Coherence & Cohesion, Lexical Resource, and GRA.
            </p>
          </div>

          {/* Task Type Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-semibold">
            <button
              onClick={() => handleTaskTypeChange("task2")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTaskType === "task2"
                  ? "bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Task 2 (Essay - 250w)
            </button>
            <button
              onClick={() => handleTaskTypeChange("task1_academic")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTaskType === "task1_academic"
                  ? "bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Task 1 (Academic - 150w)
            </button>
            <button
              onClick={() => handleTaskTypeChange("task1_general")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTaskType === "task1_general"
                  ? "bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Task 1 (General - 150w)
            </button>
          </div>
        </div>

        {/* Prompt Selection */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Exam Question / Prompt
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUseCustomPrompt(!useCustomPrompt)}
                className="text-xs text-red-600 dark:text-red-400 font-medium hover:underline"
              >
                {useCustomPrompt ? "Use Cambridge Prompt Bank" : "+ Paste Custom Topic"}
              </button>
              <button
                onClick={handleLoadSampleEssay}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
              >
                Load Sample Draft
              </button>
            </div>
          </div>

          {useCustomPrompt ? (
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Paste your IELTS essay prompt here..."
              rows={2}
              className="w-full p-3 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          ) : (
            <div className="relative">
              <select
                value={selectedPrompt.id}
                onChange={(e) => {
                  const p = WRITING_PROMPTS.find((x) => x.id === e.target.value);
                  if (p) setSelectedPrompt(p);
                }}
                className="w-full p-3 pr-10 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
              >
                {WRITING_PROMPTS.filter((p) => p.type === selectedTaskType).map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.category}] {p.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          )}

          {!useCustomPrompt && (
            <div className="p-3.5 rounded-xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 text-xs text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-red-600 dark:text-red-400">Prompt: </span>
              {selectedPrompt.prompt}
            </div>
          )}
        </div>
      </div>

      {/* Essay Input & Live Word Counter / Timer */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
        {/* Editor Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {/* Word count meter */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                isWordCountMet
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              }`}
            >
              {isWordCountMet ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              <span>
                {wordCount} / {targetWords} words
              </span>
            </div>

            {!isWordCountMet && (
              <span className="text-[11px] text-amber-600 dark:text-amber-400 hidden sm:inline">
                ⚠️ Underlength penalty applies if &lt; {targetWords} words
              </span>
            )}
          </div>

          {/* Exam Timer Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-mono font-bold text-gray-700 dark:text-gray-300">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {timerRunning ? "Pause" : "Start Timer"}
            </button>
            <button
              onClick={() => {
                setSecondsRemaining(selectedTaskType === "task2" ? 40 * 60 : 20 * 60);
                setTimerRunning(false);
              }}
              className="p-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              title="Reset timer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={essayContent}
          onChange={(e) => setEssayContent(e.target.value)}
          placeholder={`Begin typing your IELTS ${selectedTaskType === "task2" ? "Task 2 essay" : "Task 1 report"} here... Aim for distinct paragraphing (Introduction, Body Paragraphs, Conclusion).`}
          rows={12}
          className="w-full p-4 text-sm leading-relaxed rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 font-sans"
        />

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {apiKey ? "Live evaluation via Gemini Flash" : "Demo Examiner Mode (Free instant analysis)"}
          </p>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !essayContent.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white transition-all shadow-md hover:shadow-red-600/30 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Examiner Grading in Progress...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze Essay with IELTS Rubric
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg space-y-8 animate-in fade-in duration-300">
          {/* Header Score Overview */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-red-500/10 via-transparent to-red-500/5 border border-red-500/20">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs">
                <Award className="w-3.5 h-3.5" /> OFFICIAL ESTIMATED BAND
              </div>
              <div className="text-6xl font-black text-gray-900 dark:text-white tracking-tight flex items-baseline justify-center lg:justify-start gap-2">
                <span className="text-red-600 dark:text-red-500">{analysisResult.overallBand.toFixed(1)}</span>
                <span className="text-lg text-gray-400 font-normal">/ 9.0</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md">
                {analysisResult.examinerSummary}
              </p>
            </div>

            {/* Visual Radar Spider Chart */}
            <div className="flex flex-col items-center">
              <RadarChart
                scores={[
                  { label: "Task Response", score: analysisResult.criteria.taskAchievement.score },
                  { label: "Coherence", score: analysisResult.criteria.coherenceCohesion.score },
                  { label: "Lexical Res.", score: analysisResult.criteria.lexicalResource.score },
                  { label: "Grammar", score: analysisResult.criteria.grammaticalRange.score },
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
              onClick={() => setActiveTab("vocab_studio")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "vocab_studio"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Word & Idiom Upgrades ({analysisResult.vocabularySuggestions.length})
            </button>

            <button
              onClick={() => setActiveTab("sentences")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "sentences"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              Sentence Diff & Polish ({analysisResult.sentenceFeedbacks.length})
            </button>

            <button
              onClick={() => setActiveTab("model_answer")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "model_answer"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Examiner Model Answer
            </button>
          </div>

          {/* TAB 1: 4 Criteria Breakdown */}
          {activeTab === "criteria" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Task Achievement / Response */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    1. Task Achievement / Response
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white">
                    Band {analysisResult.criteria.taskAchievement.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {analysisResult.criteria.taskAchievement.feedback}
                </p>
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold">Strengths:</div>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-0.5 pl-1">
                    {analysisResult.criteria.taskAchievement.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                  <div className="text-amber-600 dark:text-amber-400 font-semibold pt-1">Examiner Advice:</div>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-0.5 pl-1">
                    {analysisResult.criteria.taskAchievement.keyRecommendations.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Coherence & Cohesion */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    2. Coherence & Cohesion
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white">
                    Band {analysisResult.criteria.coherenceCohesion.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {analysisResult.criteria.coherenceCohesion.feedback}
                </p>
                {analysisResult.cohesionAnalysis.overusedLinkers.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300">
                    <span className="font-bold">Overused Mechanical Linkers: </span>
                    {analysisResult.cohesionAnalysis.overusedLinkers.join(", ")}
                  </div>
                )}
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                  <p><strong>Referencing:</strong> {analysisResult.cohesionAnalysis.referencingQuality}</p>
                </div>
              </div>

              {/* Lexical Resource */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    3. Lexical Resource
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
                  <div className="text-amber-600 dark:text-amber-400 font-semibold pt-1">Recommended Upgrades:</div>
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
                    4. Grammatical Range & Accuracy
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white">
                    Band {analysisResult.criteria.grammaticalRange.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {analysisResult.criteria.grammaticalRange.feedback}
                </p>
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold">Sentence Strengths:</div>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-0.5 pl-1">
                    {analysisResult.criteria.grammaticalRange.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                  <div className="text-amber-600 dark:text-amber-400 font-semibold pt-1">Target Areas:</div>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-0.5 pl-1">
                    {analysisResult.criteria.grammaticalRange.keyRecommendations.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Word Suggestions & Idiom Studio */}
          {activeTab === "vocab_studio" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Band 7.5+ Lexical Strategy: </span>
                  IELTS examiners look for "uncommon lexical items with some awareness of style and collocation" and natural idiomatic structures that convey precise meanings without sounding artificial.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.vocabularySuggestions.map((item, idx) => (
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

          {/* TAB 3: Sentence Diff & Polish */}
          {activeTab === "sentences" && (
            <div className="space-y-4">
              {analysisResult.sentenceFeedbacks.map((s, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                      Sentence #{idx + 1}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        s.issueType === "grammar"
                          ? "bg-red-500/10 text-red-600 border border-red-500/20"
                          : s.issueType === "vocabulary"
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                      }`}
                    >
                      {s.issueType}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-white dark:bg-gray-900 border border-red-500/20 text-gray-700 dark:text-gray-300">
                      <span className="font-bold text-red-500 block mb-1">Original Draft:</span>
                      "{s.original}"
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/30 text-gray-800 dark:text-gray-200">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                        Band 8.5 Polished Rewrite:
                      </span>
                      "{s.rewritten}"
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 dark:text-gray-300 pt-1">
                    <span className="font-semibold text-gray-900 dark:text-white">Examiner Note: </span>
                    {s.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Model Answer */}
          {activeTab === "model_answer" && (
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <Award className="w-4 h-4 text-red-500" />
                Examiner Band 8.5+ Model Response
              </div>
              <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/80 text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-serif whitespace-pre-line">
                {analysisResult.modelAnswer}
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
          title={`IELTS Writing ${selectedTaskType === "task2" ? "Task 2" : "Task 1"}`}
          type="Writing"
          overallBand={analysisResult.overallBand}
          scores={[
            { label: "Task Response", score: analysisResult.criteria.taskAchievement.score },
            { label: "Coherence", score: analysisResult.criteria.coherenceCohesion.score },
            { label: "Lexical Res.", score: analysisResult.criteria.lexicalResource.score },
            { label: "Grammar", score: analysisResult.criteria.grammaticalRange.score },
          ]}
          primaryBottleneck={analysisResult.primaryBottleneck}
          examinerHighlight={analysisResult.criteria.lexicalResource.feedback}
        />
      )}
    </div>
  );
}
