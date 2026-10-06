"use client";

import React, { useState, useEffect } from "react";
import {
  PenTool,
  Clock,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Share2,
  RefreshCw,
  Lightbulb,
  Award,
  Layers,
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
    <div className="space-y-6">
      {/* Top Banner / Mode Controls */}
      <div className="border-2 border-gray-900 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b-2 border-gray-900 dark:border-gray-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-black uppercase bg-red-600 text-white tracking-wider mb-2">
              <PenTool className="w-3 h-3" /> OFFICIAL RUBRIC GRADER
            </div>
            <h2 className="text-2xl font-black text-gray-950 dark:text-white uppercase tracking-tight">
              IELTS Writing Studio
            </h2>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">
              Strictly evaluated on Task Response, Coherence & Cohesion, Lexical Resource, and GRA.
            </p>
          </div>

          {/* Task Type Switcher: Sharp Segmented */}
          <div className="flex items-center border-2 border-gray-900 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-xs font-bold">
            <button
              onClick={() => handleTaskTypeChange("task2")}
              className={`px-3.5 py-2 transition-all ${
                selectedTaskType === "task2"
                  ? "bg-red-600 text-white font-black"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Task 2 (Essay • 250w)
            </button>
            <button
              onClick={() => handleTaskTypeChange("task1_academic")}
              className={`px-3.5 py-2 border-l-2 border-gray-900 dark:border-gray-700 transition-all ${
                selectedTaskType === "task1_academic"
                  ? "bg-red-600 text-white font-black"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Task 1 (Academic • 150w)
            </button>
            <button
              onClick={() => handleTaskTypeChange("task1_general")}
              className={`px-3.5 py-2 border-l-2 border-gray-900 dark:border-gray-700 transition-all ${
                selectedTaskType === "task1_general"
                  ? "bg-red-600 text-white font-black"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Task 1 (General • 150w)
            </button>
          </div>
        </div>

        {/* Prompt Selection */}
        <div className="pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-gray-200">
              Exam Question / Topic
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUseCustomPrompt(!useCustomPrompt)}
                className="text-xs text-red-600 dark:text-red-400 font-bold hover:underline cursor-pointer"
              >
                {useCustomPrompt ? "← Cambridge Topic Bank" : "+ Custom Topic"}
              </button>
              <button
                onClick={handleLoadSampleEssay}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white font-bold underline cursor-pointer"
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
              className="w-full p-3 text-sm border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-0 focus:border-red-600 font-medium"
            />
          ) : (
            <div className="relative">
              <select
                value={selectedPrompt.id}
                onChange={(e) => {
                  const p = WRITING_PROMPTS.find((x) => x.id === e.target.value);
                  if (p) setSelectedPrompt(p);
                }}
                className="w-full p-3 pr-10 text-sm border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white appearance-none focus:outline-none focus:border-red-600 font-bold"
              >
                {WRITING_PROMPTS.filter((p) => p.type === selectedTaskType).map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.category}] {p.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-900 dark:text-gray-100 pointer-events-none" />
            </div>
          )}

          {!useCustomPrompt && (
            <div className="p-4 border-l-4 border-red-600 bg-gray-50 dark:bg-gray-800/80 border-t border-r border-b border-gray-200 dark:border-gray-700 text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
              <span className="font-black text-red-600 dark:text-red-400 uppercase tracking-wider block mb-1">
                Official Task:
              </span>
              {selectedPrompt.prompt}
            </div>
          )}
        </div>
      </div>

      {/* Essay Input & Live Word Counter / Timer */}
      <div className="border-2 border-gray-900 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] space-y-4">
        {/* Editor Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-gray-900 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {/* Word count meter */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 ${
                isWordCountMet
                  ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                  : "border-amber-600 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
              }`}
            >
              {isWordCountMet ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              <span>
                {wordCount} / {targetWords} WORDS
              </span>
            </div>

            {!isWordCountMet && (
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 hidden sm:inline uppercase tracking-tight">
                ⚠️ Underlength penalty applies if &lt; {targetWords} words
              </span>
            )}
          </div>

          {/* Exam Timer Controls */}
          <div className="flex items-center border-2 border-gray-900 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 font-mono font-black text-gray-900 dark:text-white">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="px-3 py-1.5 font-bold border-l-2 border-gray-900 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
            >
              {timerRunning ? "PAUSE" : "START"}
            </button>
            <button
              onClick={() => {
                setSecondsRemaining(selectedTaskType === "task2" ? 40 * 60 : 20 * 60);
                setTimerRunning(false);
              }}
              className="p-1.5 border-l-2 border-gray-900 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
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
          rows={14}
          className="w-full p-4 text-sm leading-relaxed border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-950 dark:text-gray-50 focus:outline-none focus:border-red-600 font-sans"
        />

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            {apiKey ? "Mode: Live Gemini Flash API Evaluation" : "Mode: Built-in High-Fidelity Examiner Engine"}
          </p>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !essayContent.trim()}
            className="flex items-center gap-2 px-6 py-3 font-black text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white transition-all border-2 border-red-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                EXAMINER GRADING IN PROGRESS...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                ANALYZE ESSAY WITH IELTS RUBRIC
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="border-2 border-gray-900 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] space-y-8 animate-in fade-in duration-200">
          {/* Header Score Overview */}
          <div className="border-2 border-gray-900 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-black uppercase bg-red-600 text-white tracking-wider">
                <Award className="w-3.5 h-3.5" /> ESTIMATED OVERALL BAND
              </div>
              <div className="text-6xl font-black text-gray-950 dark:text-white tracking-tight flex items-baseline justify-center lg:justify-start gap-2">
                <span className="text-red-600 dark:text-red-500">{analysisResult.overallBand.toFixed(1)}</span>
                <span className="text-lg text-gray-500 font-bold">/ 9.0</span>
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 max-w-md">
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

          {/* Results Navigation Tabs: Sharp segmented */}
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
              onClick={() => setActiveTab("vocab_studio")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-black uppercase tracking-wider border-2 transition-all ${
                activeTab === "vocab_studio"
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Word & Idiom Upgrades ({analysisResult.vocabularySuggestions.length})
            </button>

            <button
              onClick={() => setActiveTab("sentences")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-black uppercase tracking-wider border-2 transition-all ${
                activeTab === "sentences"
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-100"
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              Sentence Diff & Polish ({analysisResult.sentenceFeedbacks.length})
            </button>

            <button
              onClick={() => setActiveTab("model_answer")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-black uppercase tracking-wider border-2 transition-all ${
                activeTab === "model_answer"
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-100"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Band 8.5 Model Essay
            </button>
          </div>

          {/* TAB 1: 4 Criteria Breakdown */}
          {activeTab === "criteria" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Task Achievement */}
              <div className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b-2 border-gray-900 dark:border-gray-700">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                    1. Task Achievement / Response
                  </h4>
                  <span className="px-2 py-0.5 text-xs font-black bg-red-600 text-white">
                    BAND {analysisResult.criteria.taskAchievement.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {analysisResult.criteria.taskAchievement.feedback}
                </p>
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-wider">Strengths:</div>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-0.5 pl-1">
                    {analysisResult.criteria.taskAchievement.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                  <div className="text-amber-700 dark:text-amber-400 font-black uppercase tracking-wider pt-2">Examiner Advice:</div>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-0.5 pl-1">
                    {analysisResult.criteria.taskAchievement.keyRecommendations.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Coherence & Cohesion */}
              <div className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b-2 border-gray-900 dark:border-gray-700">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                    2. Coherence & Cohesion
                  </h4>
                  <span className="px-2 py-0.5 text-xs font-black bg-red-600 text-white">
                    BAND {analysisResult.criteria.coherenceCohesion.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {analysisResult.criteria.coherenceCohesion.feedback}
                </p>
                {analysisResult.cohesionAnalysis.overusedLinkers.length > 0 && (
                  <div className="p-2.5 border-2 border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-xs text-amber-900 dark:text-amber-200">
                    <span className="font-black uppercase">Overused Linkers: </span>
                    {analysisResult.cohesionAnalysis.overusedLinkers.join(", ")}
                  </div>
                )}
                <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                  <p><strong>Referencing & Substitution:</strong> {analysisResult.cohesionAnalysis.referencingQuality}</p>
                </div>
              </div>

              {/* Lexical Resource */}
              <div className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b-2 border-gray-900 dark:border-gray-700">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                    3. Lexical Resource
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
                  <div className="text-amber-700 dark:text-amber-400 font-black uppercase tracking-wider pt-2">Recommended Upgrades:</div>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-0.5 pl-1">
                    {analysisResult.criteria.lexicalResource.keyRecommendations.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Grammatical Range & Accuracy */}
              <div className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b-2 border-gray-900 dark:border-gray-700">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                    4. Grammatical Range & Accuracy
                  </h4>
                  <span className="px-2 py-0.5 text-xs font-black bg-red-600 text-white">
                    BAND {analysisResult.criteria.grammaticalRange.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {analysisResult.criteria.grammaticalRange.feedback}
                </p>
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-wider">Sentence Mastery:</div>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-0.5 pl-1">
                    {analysisResult.criteria.grammaticalRange.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                  <div className="text-amber-700 dark:text-amber-400 font-black uppercase tracking-wider pt-2">Target Areas:</div>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-0.5 pl-1">
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
              <div className="p-4 border-2 border-gray-900 dark:border-gray-700 bg-amber-50 dark:bg-amber-950/40 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black uppercase">Official Band 7.5+ Lexical Requirement: </span>
                  Cambridge examiners reward candidates who deploy "uncommon lexical items with some awareness of style and collocation" and contextual idiomatic phrases that convey precise meaning without sounding forced.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.vocabularySuggestions.map((item, idx) => (
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

          {/* TAB 3: Sentence Diff & Polish */}
          {activeTab === "sentences" && (
            <div className="space-y-4">
              {analysisResult.sentenceFeedbacks.map((s, idx) => (
                <div
                  key={idx}
                  className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b-2 border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-black uppercase text-gray-900 dark:text-gray-300">
                      Sentence #{idx + 1}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-gray-900 dark:bg-white text-white dark:text-gray-900">
                      {s.issueType}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 border-2 border-red-600 bg-red-50/50 dark:bg-red-950/20 text-gray-900 dark:text-gray-200">
                      <span className="font-black text-red-600 uppercase block mb-1">Original Draft:</span>
                      "{s.original}"
                    </div>
                    <div className="p-3.5 border-2 border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 text-gray-900 dark:text-gray-200">
                      <span className="font-black text-emerald-700 dark:text-emerald-400 uppercase block mb-1">
                        Band 8.5 Polished Rewrite:
                      </span>
                      "{s.rewritten}"
                    </div>
                  </div>

                  <div className="text-xs text-gray-700 dark:text-gray-300 font-medium pt-1">
                    <span className="font-bold text-gray-950 dark:text-white uppercase">Examiner Note: </span>
                    {s.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Model Answer */}
          {activeTab === "model_answer" && (
            <div className="border-2 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-950 p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white pb-2 border-b-2 border-gray-900 dark:border-gray-700">
                <Award className="w-4 h-4 text-red-600" />
                Examiner Band 8.5+ Model Response
              </div>
              <div className="p-5 border-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm leading-relaxed text-gray-900 dark:text-gray-100 font-serif whitespace-pre-line">
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
