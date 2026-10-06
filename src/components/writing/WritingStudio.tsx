"use client";

import React, { useState, useEffect } from "react";
import {
  PenTool,
  Clock,
  Sparkles,
  BookOpen,
  Share2,
  RefreshCw,
  Lightbulb,
  Award,
  Layers,
  ChevronDown,
  Edit3,
  Highlighter,
} from "lucide-react";
import { WRITING_PROMPTS, WritingPrompt } from "@/lib/ieltsPromptBank";
import { WritingAnalysisResult, TaskType } from "@/types/ielts";
import { RadarChart } from "../RadarChart";
import { ScorecardModal } from "../ScorecardModal";
import { AnnotatedParagraph } from "./AnnotatedParagraph";
import { DiagnosticInspector } from "./DiagnosticInspector";

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
  const [activeTab, setActiveTab] = useState<"criteria" | "sentences" | "model_answer">("criteria");
  const [showScorecard, setShowScorecard] = useState(false);

  // In-text annotation & view state
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"annotated" | "edit">("edit");

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
    setSelectedAnnotationId(null);

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
      setViewMode("annotated"); // Automatically switch to in-text annotated view upon completion
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyFix = (original: string, replacement: string) => {
    setEssayContent((prev) => {
      if (prev.includes(original)) {
        return prev.replace(original, replacement);
      }
      return prev;
    });
  };

  const handleLoadSampleEssay = () => {
    setEssayContent(
      `In contemporary society, the trajectory of modern technology presents both remarkable advantages and complex ethical quandaries. Proponents contend that automation substantially enhances productivity, freeing individuals from menial labor. Furthermore, algorithmic efficiencies optimize industrial supply chains and foster global scientific collaboration.\n\nConversely, skeptics caution that unregulated artificial intelligence could exacerbate socioeconomic disparities and induce severe structural unemployment. If machines replace entry-level cognitive tasks, young graduates may encounter unprecedented barriers to workplace integration. In addition, privacy concerns have become increasingly prominent.\n\nOn balance, while technological innovation inevitably disrupts conventional labor markets, proactive regulatory frameworks and comprehensive retraining initiatives can effectively harness these transformations for the collective good.`
    );
    setViewMode("edit");
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Task Selector & Prompt (Linear open layout with thin divider) */}
      <div className="space-y-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-black dark:text-white">
              Writing Task
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Select your task and prompt to begin practice
            </p>
          </div>

          {/* Task Type Switcher: Minimalist tabs with thin outline */}
          <div className="inline-flex items-center p-0.5 rounded-lg border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] text-xs">
            <button
              onClick={() => handleTaskTypeChange("task2")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                selectedTaskType === "task2"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Task 2 (250w)
            </button>
            <button
              onClick={() => handleTaskTypeChange("task1_academic")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                selectedTaskType === "task1_academic"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Task 1 Academic (150w)
            </button>
            <button
              onClick={() => handleTaskTypeChange("task1_general")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                selectedTaskType === "task1_general"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Task 1 General (150w)
            </button>
          </div>
        </div>

        {/* Prompt selector */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-neutral-500 dark:text-neutral-400 uppercase text-[11px]">
              Prompt Selection
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUseCustomPrompt(!useCustomPrompt)}
                className="text-neutral-700 dark:text-neutral-300 hover:underline cursor-pointer font-medium"
              >
                {useCustomPrompt ? "Choose from bank" : "+ Custom topic"}
              </button>
              <button
                onClick={handleLoadSampleEssay}
                className="text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
              >
                Load sample
              </button>
            </div>
          </div>

          {useCustomPrompt ? (
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Paste custom IELTS writing question..."
              rows={2}
              className="w-full p-3 text-sm rounded-lg border border-black/10 dark:border-white/15 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:border-black/40 dark:focus:border-white/40 font-normal"
            />
          ) : (
            <div className="relative">
              <select
                value={selectedPrompt.id}
                onChange={(e) => {
                  const p = WRITING_PROMPTS.find((x) => x.id === e.target.value);
                  if (p) setSelectedPrompt(p);
                }}
                className="w-full p-2.5 pr-8 text-xs font-medium rounded-lg border border-black/10 dark:border-white/15 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 appearance-none focus:outline-none cursor-pointer"
              >
                {WRITING_PROMPTS.filter((p) => p.type === selectedTaskType).map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-black text-black dark:text-white">
                    [{p.category}] {p.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
            </div>
          )}

          {!useCustomPrompt && (
            <div className="p-3.5 rounded-lg border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
              <span className="font-semibold text-black dark:text-white mr-1.5">Question:</span>
              {selectedPrompt.prompt}
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Split View (Paragraph Box on Left, Diagnostic Inspector on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Paragraph Box (pushed to left, col-span-7) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Editor / Review Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-1">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono px-2 py-0.5 rounded-md border text-[11px] font-medium ${
                  isWordCountMet
                    ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                    : "border-black/10 dark:border-white/15 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                {wordCount} / {targetWords} words
              </span>

              {/* Toggle View Mode when analysis exists */}
              {analysisResult && (
                <div className="inline-flex items-center p-0.5 rounded-md border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] text-[11px]">
                  <button
                    onClick={() => setViewMode("annotated")}
                    className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                      viewMode === "annotated"
                        ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    <Highlighter className="w-3 h-3" />
                    Annotated
                  </button>
                  <button
                    onClick={() => setViewMode("edit")}
                    className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                      viewMode === "edit"
                        ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-neutral-700 dark:text-neutral-300 font-medium">
                {formatTimer(secondsRemaining)}
              </span>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="px-2 py-0.5 rounded border border-black/10 dark:border-white/15 text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                {timerRunning ? "Pause" : "Timer"}
              </button>
              <button
                onClick={() => {
                  setSecondsRemaining(selectedTaskType === "task2" ? 40 * 60 : 20 * 60);
                  setTimerRunning(false);
                }}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer p-0.5"
                title="Reset timer"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Conditional View: Annotated in-text highlighting vs Textarea */}
          {analysisResult && viewMode === "annotated" ? (
            <AnnotatedParagraph
              content={essayContent}
              errors={analysisResult.sentenceFeedbacks}
              suggestions={analysisResult.vocabularySuggestions}
              selectedId={selectedAnnotationId}
              onSelect={setSelectedAnnotationId}
              onApplyFix={handleApplyFix}
            />
          ) : (
            <textarea
              value={essayContent}
              onChange={(e) => setEssayContent(e.target.value)}
              placeholder={`Type your IELTS ${
                selectedTaskType === "task2" ? "Task 2 essay" : "Task 1 report"
              } here... Organize into clear paragraphs.`}
              rows={15}
              className="w-full p-4 text-sm leading-relaxed rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-black/30 dark:focus:border-white/30 font-sans"
            />
          )}

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <span className="text-xs text-neutral-500 font-mono">
              {apiKey ? "Live Gemini evaluation active" : "Built-in examiner engine ready"}
            </span>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !essayContent.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 disabled:opacity-30 transition-all cursor-pointer shadow-xs"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Analyzing mistakes...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  {analysisResult ? "Re-analyze with IELTS Rubric" : "Analyze with IELTS Rubric"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Diagnostic Inspector (pushed to right, col-span-5) */}
        <div className="lg:col-span-5 sticky top-24">
          <DiagnosticInspector
            errors={analysisResult?.sentenceFeedbacks || []}
            suggestions={analysisResult?.vocabularySuggestions || []}
            selectedId={selectedAnnotationId}
            onSelect={setSelectedAnnotationId}
            onApplyFix={handleApplyFix}
            taskType={selectedTaskType}
          />
        </div>
      </div>

      {/* Section 3: Diagnostic Results (The rest remains at the bottom as requested) */}
      {analysisResult && (
        <div className="pt-8 border-t border-black/10 dark:border-white/10 space-y-8 animate-in fade-in duration-200">
          {/* Header Score Overview: Minimalist */}
          <div className="p-6 rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                Predicted Overall Score
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
                  { label: "Task Resp.", score: analysisResult.criteria.taskAchievement.score },
                  { label: "Coherence", score: analysisResult.criteria.coherenceCohesion.score },
                  { label: "Lexical", score: analysisResult.criteria.lexicalResource.score },
                  { label: "Grammar", score: analysisResult.criteria.grammaticalRange.score },
                ]}
                size={200}
                accentColor="#ffffff"
              />
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
              <button
                onClick={() => setShowScorecard(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-black/15 dark:border-white/20 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer"
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

          {/* Tab Navigation for Detailed Feedback */}
          <div className="flex flex-wrap items-center gap-1 border-b border-black/10 dark:border-white/10 pb-2">
            <button
              onClick={() => setActiveTab("criteria")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "criteria"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Criteria Breakdown
            </button>
            <button
              onClick={() => setActiveTab("sentences")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "sentences"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Sentence Diff Archive ({analysisResult.sentenceFeedbacks.length})
            </button>
            <button
              onClick={() => setActiveTab("model_answer")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "model_answer"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Model Essay
            </button>
          </div>

          {/* TAB 1: Criteria */}
          {activeTab === "criteria" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-black dark:text-white">Task Achievement</span>
                  <span className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Band {analysisResult.criteria.taskAchievement.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {analysisResult.criteria.taskAchievement.feedback}
                </p>
                <div className="pt-1 text-xs space-y-1 text-neutral-500 dark:text-neutral-400">
                  <div className="font-medium text-black dark:text-white">Examiner advice:</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {analysisResult.criteria.taskAchievement.keyRecommendations.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-black dark:text-white">Coherence & Cohesion</span>
                  <span className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Band {analysisResult.criteria.coherenceCohesion.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {analysisResult.criteria.coherenceCohesion.feedback}
                </p>
                {analysisResult.cohesionAnalysis.overusedLinkers.length > 0 && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400">
                    Overused linkers: {analysisResult.cohesionAnalysis.overusedLinkers.join(", ")}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-black dark:text-white">Lexical Resource</span>
                  <span className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Band {analysisResult.criteria.lexicalResource.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {analysisResult.criteria.lexicalResource.feedback}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-black dark:text-white">Grammatical Range & Accuracy</span>
                  <span className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Band {analysisResult.criteria.grammaticalRange.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {analysisResult.criteria.grammaticalRange.feedback}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Sentence Diff */}
          {activeTab === "sentences" && (
            <div className="space-y-3">
              {analysisResult.sentenceFeedbacks.map((s, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-neutral-400 font-mono text-[11px]">
                    <span>Sentence {idx + 1}</span>
                    <span className="uppercase">{s.issueType}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-neutral-700 dark:text-neutral-300">
                      <span className="font-mono text-[10px] text-neutral-400 block mb-1">ORIGINAL:</span>
                      "{s.original}"
                    </div>
                    <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-950 dark:text-emerald-200">
                      <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 block mb-1">REWRITE:</span>
                      "{s.rewritten}"
                    </div>
                  </div>
                  <p className="text-neutral-500 pt-1">{s.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Model Answer */}
          {activeTab === "model_answer" && (
            <div className="p-5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black space-y-3 text-xs leading-relaxed text-neutral-800 dark:text-neutral-200 font-serif whitespace-pre-line">
              <span className="font-sans font-mono text-[11px] uppercase text-neutral-400 block">
                Official Model Essay
              </span>
              {analysisResult.modelAnswer}
            </div>
          )}
        </div>
      )}

      {/* Share Card Modal */}
      {analysisResult && (
        <ScorecardModal
          isOpen={showScorecard}
          onClose={() => setShowScorecard(false)}
          title={`IELTS Writing ${selectedTaskType === "task2" ? "Task 2" : "Task 1"}`}
          type="Writing"
          overallBand={analysisResult.overallBand}
          scores={[
            { label: "Task Resp.", score: analysisResult.criteria.taskAchievement.score },
            { label: "Coherence", score: analysisResult.criteria.coherenceCohesion.score },
            { label: "Lexical", score: analysisResult.criteria.lexicalResource.score },
            { label: "Grammar", score: analysisResult.criteria.grammaticalRange.score },
          ]}
          primaryBottleneck={analysisResult.primaryBottleneck}
          examinerHighlight={analysisResult.criteria.lexicalResource.feedback}
        />
      )}
    </div>
  );
}
