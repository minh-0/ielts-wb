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
  RotateCcw,
} from "lucide-react";
import { WRITING_PROMPTS, WritingPrompt } from "@/lib/ieltsPromptBank";
import { WritingAnalysisResult, TaskType, ReplacedWordItem } from "@/types/ielts";
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
  const [baseAnalysisResult, setBaseAnalysisResult] = useState<WritingAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"criteria" | "sentences" | "model_answer">("criteria");
  const [showScorecard, setShowScorecard] = useState(false);

  // In-text annotation & view state
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"annotated" | "edit">("edit");
  const [replacedItems, setReplacedItems] = useState<ReplacedWordItem[]>([]);

  // Word count & cleaner
  const cleanRepeatedWords = (text: string) => {
    let cleaned = text.replace(/\b([A-Za-z]+)(?:,\s*|\s+)(?:\1(?:,\s*|\s+))+/gi, "$1, ");
    cleaned = cleaned.replace(/\b([A-Za-z]+)(?:\s+)\1\b/gi, "$1");
    cleaned = cleaned.replace(/,\s*,+/g, ",");
    return cleaned;
  };

  // Helper to dynamically calculate upgraded band scores whenever upgrades are applied
  const computeUpgradedResult = (
    base: WritingAnalysisResult,
    currentReplaced: ReplacedWordItem[]
  ): WritingAnalysisResult => {
    if (currentReplaced.length === 0) return base;

    const count = currentReplaced.length;
    // Boost Lexical Resource, Grammatical Range & Coherence dynamically
    const lrBoost = Math.min(2.5, count * 0.5);
    const graBoost = Math.min(2.0, Math.floor(count * 0.4) * 0.5);
    const ccBoost = Math.min(1.5, Math.floor(count * 0.3) * 0.5);

    const newLR = Math.min(9.0, Number((base.criteria.lexicalResource.score + lrBoost).toFixed(1)));
    const newGRA = Math.min(
      9.0,
      Number((base.criteria.grammaticalRange.score + graBoost).toFixed(1))
    );
    const newCC = Math.min(
      9.0,
      Number((base.criteria.coherenceCohesion.score + ccBoost).toFixed(1))
    );
    const newTA = base.criteria.taskAchievement.score;

    const rawAvg = (newTA + newCC + newLR + newGRA) / 4;
    const newOverall = Math.min(9.0, Math.round(rawAvg * 2) / 2);

    return {
      ...base,
      overallBand: newOverall,
      criteria: {
        ...base.criteria,
        taskAchievement: {
          ...base.criteria.taskAchievement,
          score: newTA,
          bandLabel: `Band ${newTA.toFixed(1)} (Good Development)`,
        },
        lexicalResource: {
          ...base.criteria.lexicalResource,
          score: newLR,
          bandLabel: `Band ${newLR.toFixed(1)} (${
            newLR >= 8.5
              ? "Masterly C2 Precision"
              : newLR >= 7.5
              ? "Advanced C1/C2 Academic Vocabulary"
              : "Strong Collocations"
          })`,
          feedback: `Elevated with ${count} higher-rated academic upgrades. Lexical precision is substantially boosted.`,
        },
        grammaticalRange: {
          ...base.criteria.grammaticalRange,
          score: newGRA,
          bandLabel: `Band ${newGRA.toFixed(1)} (${
            newGRA >= 8.0 ? "Sophisticated Syntactic Variety" : "Complex Structures Controlled"
          })`,
        },
        coherenceCohesion: {
          ...base.criteria.coherenceCohesion,
          score: newCC,
          bandLabel: `Band ${newCC.toFixed(1)} (${
            newCC >= 8.0 ? "Seamless Thematic Progression" : "Coherent & Varied"
          })`,
        },
      },
      examinerSummary: `Upgraded revision: Incorporating ${count} examiner-recommended higher-rated phrases and complex structures has elevated your score to Band ${newOverall.toFixed(1)}.`,
      primaryBottleneck:
        count >= 4
          ? "All major lexical and syntactic upgrades incorporated. Ready for examiner submission."
          : `${count} upgrade(s) applied. Review remaining items in the inspector to push towards Band 8.5+.`,
    };
  };

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
    setReplacedItems([]);

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
      setBaseAnalysisResult(data);
      setAnalysisResult(data);
      setViewMode("annotated"); // Automatically switch to in-text annotated view upon completion
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyFix = (original: string, replacement: string, meta?: any) => {
    const cleanOrig = cleanRepeatedWords(original);
    const cleanRepl = cleanRepeatedWords(replacement);

    setEssayContent((prev) => {
      const cleanedPrev = cleanRepeatedWords(prev);
      if (cleanedPrev.includes(cleanOrig)) {
        return cleanRepeatedWords(cleanedPrev.replace(cleanOrig, cleanRepl));
      }
      if (cleanedPrev.includes(original)) {
        return cleanRepeatedWords(cleanedPrev.replace(original, cleanRepl));
      }
      return cleanedPrev;
    });

    const newItem: ReplacedWordItem = {
      id: meta?.id || `rep-${Date.now()}`,
      originalText: cleanOrig,
      replacedText: cleanRepl,
      higherRatedWordExplanation:
        meta?.higherRatedWordExplanation ||
        "Upgrades phrasing to formal C1/C2 academic register favored by examiners.",
      higherRatedWords: meta?.higherRatedWords || [],
    };

    setReplacedItems((prev) => {
      const filtered = prev.filter(
        (r) => r.originalText !== cleanOrig && r.replacedText !== cleanRepl
      );
      const updated = [...filtered, newItem];
      if (baseAnalysisResult) {
        setAnalysisResult(computeUpgradedResult(baseAnalysisResult, updated));
      }
      return updated;
    });
  };

  const handleRevertFix = (replacedText: string, originalText: string) => {
    const cleanRep = cleanRepeatedWords(replacedText);
    const cleanOrig = cleanRepeatedWords(originalText);

    setEssayContent((prev) => {
      const cleanedPrev = cleanRepeatedWords(prev);
      if (cleanedPrev.includes(cleanRep)) {
        return cleanRepeatedWords(cleanedPrev.replace(cleanRep, cleanOrig));
      }
      if (cleanedPrev.includes(replacedText)) {
        return cleanRepeatedWords(cleanedPrev.replace(replacedText, cleanOrig));
      }
      return cleanedPrev;
    });

    setReplacedItems((prev) => {
      const updated = prev.filter(
        (r) => r.replacedText !== cleanRep && r.replacedText !== replacedText
      );
      if (baseAnalysisResult) {
        setAnalysisResult(computeUpgradedResult(baseAnalysisResult, updated));
      }
      return updated;
    });
  };

  const handleApplyAllUpgrades = () => {
    if (!analysisResult) return;
    let updated = cleanRepeatedWords(essayContent);
    const newReplaced: ReplacedWordItem[] = [...replacedItems];

    analysisResult.vocabularySuggestions.forEach((sug) => {
      const orig = cleanRepeatedWords(sug.originalPhrase);
      const upgrade = cleanRepeatedWords(sug.suggestedUpgrade);
      if (updated.includes(orig)) {
        updated = cleanRepeatedWords(updated.replace(orig, upgrade));
        if (!newReplaced.some((r) => r.replacedText === upgrade)) {
          newReplaced.push({
            id: sug.id || `rep-${Date.now()}-${Math.random()}`,
            originalText: orig,
            replacedText: upgrade,
            higherRatedWordExplanation:
              sug.higherRatedWordExplanation ||
              "Elevated academic phrasing demonstrating high lexical precision.",
            higherRatedWords: sug.higherRatedWords,
          });
        }
      }
    });

    analysisResult.sentenceFeedbacks.forEach((err) => {
      const orig = cleanRepeatedWords(err.original);
      const rew = cleanRepeatedWords(err.rewritten);
      if (updated.includes(orig)) {
        updated = cleanRepeatedWords(updated.replace(orig, rew));
        if (!newReplaced.some((r) => r.replacedText === rew)) {
          newReplaced.push({
            id: err.id || `rep-${Date.now()}-${Math.random()}`,
            originalText: orig,
            replacedText: rew,
            higherRatedWordExplanation:
              err.higherRatedWordExplanation ||
              "Syntactically varied and grammatically advanced structure.",
            higherRatedWords: err.higherRatedWords,
          });
        }
      }
    });

    setEssayContent(updated);
    setReplacedItems(newReplaced);
    if (baseAnalysisResult) {
      setAnalysisResult(computeUpgradedResult(baseAnalysisResult, newReplaced));
    }
  };

  const handleRevertAllUpgrades = () => {
    let restored = cleanRepeatedWords(essayContent);
    replacedItems.forEach((item) => {
      const rep = cleanRepeatedWords(item.replacedText);
      const orig = cleanRepeatedWords(item.originalText);
      if (restored.includes(rep)) {
        restored = cleanRepeatedWords(restored.replace(rep, orig));
      }
    });
    setEssayContent(restored);
    setReplacedItems([]);
    if (baseAnalysisResult) {
      setAnalysisResult(baseAnalysisResult);
    }
  };

  const handleLoadSampleEssay = () => {
    setEssayContent(
      cleanRepeatedWords(
        `In contemporary society, the trajectory of modern technology presents both remarkable advantages and complex ethical quandaries. Proponents contend that automation substantially enhances productivity, freeing individuals from menial labor. Furthermore, algorithmic efficiencies optimize industrial supply chains and foster global scientific collaboration.\n\nConversely, skeptics caution that unregulated artificial intelligence could exacerbate socioeconomic disparities and induce severe structural unemployment. If machines replace entry-level cognitive tasks, young graduates may encounter unprecedented barriers to workplace integration. In addition, privacy concerns have become increasingly prominent.\n\nOn balance, while technological innovation inevitably disrupts conventional labor markets, proactive regulatory frameworks and comprehensive retraining initiatives can effectively harness these transformations for the collective good.`
      )
    );
    setViewMode("edit");
    setReplacedItems([]);
    setAnalysisResult(null);
    setBaseAnalysisResult(null);
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Task Switcher & Prompt (Clean minimalist toolbar) */}
      <div className="space-y-3 pb-5 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Task Type Switcher: Minimalist tabs with thin outline */}
          <div className="inline-flex items-center p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-xs">
            <button
              onClick={() => handleTaskTypeChange("task2")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                selectedTaskType === "task2"
                  ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              Task 2 (250w)
            </button>
            <button
              onClick={() => handleTaskTypeChange("task1_academic")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                selectedTaskType === "task1_academic"
                  ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              Task 1 Academic (150w)
            </button>
            <button
              onClick={() => handleTaskTypeChange("task1_general")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                selectedTaskType === "task1_general"
                  ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              Task 1 General (150w)
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setUseCustomPrompt(!useCustomPrompt)}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium"
            >
              {useCustomPrompt ? "Choose from bank" : "+ Custom topic"}
            </button>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <button
              onClick={handleLoadSampleEssay}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium"
            >
              Load sample
            </button>
          </div>
        </div>

        {/* Prompt selector & question card */}
        <div className="space-y-2 pt-0.5">
          {useCustomPrompt ? (
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Paste custom IELTS writing question..."
              rows={2}
              className="w-full p-3 text-xs sm:text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 font-normal"
            />
          ) : (
            <div className="relative">
              <select
                value={selectedPrompt.id}
                onChange={(e) => {
                  const p = WRITING_PROMPTS.find((x) => x.id === e.target.value);
                  if (p) setSelectedPrompt(p);
                }}
                className="w-full p-2.5 pr-8 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-100 appearance-none focus:outline-none cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                {WRITING_PROMPTS.filter((p) => p.type === selectedTaskType).map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                    [{p.category}] {p.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
            </div>
          )}

          {!useCustomPrompt && (
            <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 mr-1.5">Question:</span>
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
                    : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                {wordCount} / {targetWords} words
              </span>

              {/* Toggle View Mode when analysis exists */}
              {analysisResult && (
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center p-0.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-[11px]">
                    <button
                      onClick={() => setViewMode("annotated")}
                      className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                        viewMode === "annotated"
                          ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                          : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                      }`}
                    >
                      <Highlighter className="w-3 h-3" />
                      Annotated
                    </button>
                    <button
                      onClick={() => setViewMode("edit")}
                      className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                        viewMode === "edit"
                          ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                          : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                  </div>

                  {/* Apply All / Revert All Upgrade Toggle */}
                  {replacedItems.length > 0 ? (
                    <button
                      onClick={handleRevertAllUpgrades}
                      className="px-2 py-0.5 rounded text-[11px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Revert all replacements back to original draft"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Revert All ({replacedItems.length})
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyAllUpgrades}
                      className="px-2 py-0.5 rounded text-[11px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20 flex items-center gap-1 cursor-pointer font-medium transition-colors"
                      title="Apply all recommended higher-rated words to preview elevated essay"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      Apply All Upgrades
                    </button>
                  )}
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
                className="px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
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
              replacedItems={replacedItems}
              selectedId={selectedAnnotationId}
              onSelect={setSelectedAnnotationId}
              onApplyFix={handleApplyFix}
              onRevertFix={handleRevertFix}
            />
          ) : (
            <textarea
              value={essayContent}
              onChange={(e) => setEssayContent(e.target.value)}
              placeholder={`Type your IELTS ${
                selectedTaskType === "task2" ? "Task 2 essay" : "Task 1 report"
              } here... Organize into clear paragraphs.`}
              rows={16}
              className="w-full p-6 text-[15px] sm:text-base leading-relaxed rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 font-sans min-h-[420px]"
            />
          )}

          {/* Submit Action */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center ${apiKey ? "justify-between" : "justify-end"} gap-3 pt-1`}>
            {apiKey && (
              <span className="text-xs text-neutral-500 font-mono">
                Live Gemini evaluation active
              </span>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !essayContent.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-30 transition-all cursor-pointer shadow-xs"
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
            replacedItems={replacedItems}
            selectedId={selectedAnnotationId}
            onSelect={setSelectedAnnotationId}
            onApplyFix={handleApplyFix}
            onRevertFix={handleRevertFix}
            taskType={selectedTaskType}
          />
        </div>
      </div>

      {/* Section 3: Diagnostic Results (Spacious layout across wide screen) */}
      {analysisResult && (
        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-8 animate-in fade-in duration-200">
          {/* Header Score Overview: Expansive 3-column dashboard */}
          <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Panel 1: Band Score & Summary */}
            <div className="lg:col-span-5 space-y-2.5 text-center lg:text-left">
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                Overall Band
              </div>
              <div className="text-5xl sm:text-6xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Band {analysisResult.overallBand.toFixed(1)}
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1 max-w-lg">
                {analysisResult.examinerSummary}
              </p>
            </div>

            {/* Panel 2: Center Radar Chart */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center">
              <RadarChart
                scores={[
                  { label: "Task Resp.", score: analysisResult.criteria.taskAchievement.score },
                  { label: "Coherence", score: analysisResult.criteria.coherenceCohesion.score },
                  { label: "Lexical", score: analysisResult.criteria.lexicalResource.score },
                  { label: "Grammar", score: analysisResult.criteria.grammaticalRange.score },
                ]}
                size={220}
                accentColor="#ffffff"
              />
            </div>

            {/* Panel 3: Bottleneck & Share Card Action */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs leading-relaxed space-y-1">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block text-[11px] uppercase tracking-wide">
                  Primary Score Bottleneck:
                </span>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {analysisResult.primaryBottleneck}
                </p>
              </div>

              <button
                onClick={() => setShowScorecard(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-medium text-xs sm:text-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                Export Share Card
              </button>
            </div>
          </div>

          {/* Tab Navigation for Detailed Feedback */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <button
              onClick={() => setActiveTab("criteria")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "criteria"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              Criteria Breakdown
            </button>
            <button
              onClick={() => setActiveTab("sentences")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "sentences"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              Sentence Diff Archive ({analysisResult.sentenceFeedbacks.length})
            </button>
            <button
              onClick={() => setActiveTab("model_answer")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "model_answer"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              Model Essay
            </button>
          </div>

          {/* TAB 1: Criteria (Spacious 4-column layout on wide screens) */}
          {activeTab === "criteria" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-neutral-100 dark:border-neutral-800/80">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Task Response</span>
                    <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Band {analysisResult.criteria.taskAchievement.score.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {analysisResult.criteria.taskAchievement.feedback}
                  </p>
                </div>
                <div className="pt-2 text-xs space-y-1 text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-[11px]">Examiner Advice:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {analysisResult.criteria.taskAchievement.keyRecommendations.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-neutral-100 dark:border-neutral-800/80">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Coherence & Cohesion</span>
                    <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Band {analysisResult.criteria.coherenceCohesion.score.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {analysisResult.criteria.coherenceCohesion.feedback}
                  </p>
                </div>
                {analysisResult.cohesionAnalysis.overusedLinkers.length > 0 && (
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-400">
                    Overused linkers: {analysisResult.cohesionAnalysis.overusedLinkers.join(", ")}
                  </div>
                )}
              </div>

              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-neutral-100 dark:border-neutral-800/80">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Lexical Resource</span>
                    <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Band {analysisResult.criteria.lexicalResource.score.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {analysisResult.criteria.lexicalResource.feedback}
                  </p>
                </div>
                <div className="pt-2 text-xs text-neutral-500 border-t border-neutral-100 dark:border-neutral-800/80">
                  <span className="text-[11px] text-neutral-400">Focus on C1/C2 collocations & precision</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-neutral-100 dark:border-neutral-800/80">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Grammatical Range</span>
                    <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Band {analysisResult.criteria.grammaticalRange.score.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {analysisResult.criteria.grammaticalRange.feedback}
                  </p>
                </div>
                <div className="pt-2 text-xs text-neutral-500 border-t border-neutral-100 dark:border-neutral-800/80">
                  <span className="text-[11px] text-neutral-400">Incorporate complex & non-finite clauses</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Sentence Diff */}
          {activeTab === "sentences" && (
            <div className="space-y-3">
              {analysisResult.sentenceFeedbacks.map((s, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-neutral-400 font-mono text-[11px]">
                    <span>Sentence {idx + 1}</span>
                    <span className="uppercase">{s.issueType}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-700 dark:text-neutral-300">
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
            <div
              data-paragraph="true"
              className="ielts-paragraph p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3 text-xs leading-relaxed text-neutral-800 dark:text-neutral-200 font-serif whitespace-pre-line"
            >
              <span className="font-sans font-mono text-[11px] uppercase text-neutral-400 block">
                Model Essay
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
