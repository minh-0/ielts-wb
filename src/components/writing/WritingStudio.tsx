"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Upload,
  ClipboardPaste,
  Maximize2,
  Bookmark,
  Check,
  Shuffle,
  X as XIcon,
} from "lucide-react";
import { WRITING_PROMPTS, WritingPrompt } from "@/lib/ieltsPromptBank";
import { WritingAnalysisResult, TaskType, ReplacedWordItem, SavedEssay } from "@/types/ielts";
import { RadarChart } from "../RadarChart";
import { ScorecardModal } from "../ScorecardModal";
import { BandScoreEmoji } from "../BandScoreEmoji";
import { AnnotatedParagraph } from "./AnnotatedParagraph";
import { DiagnosticInspector } from "./DiagnosticInspector";
import { SavedEssaysModal } from "./SavedEssaysModal";
import { QuestionPickerModal } from "./QuestionPickerModal";
import { NumberTicker } from "../magicui/number-ticker";

interface WritingStudioProps {
  apiKey: string;
  initialTaskType?: TaskType;
}

export function WritingStudio({ apiKey, initialTaskType }: WritingStudioProps) {
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType>(initialTaskType || "task2");
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt>(WRITING_PROMPTS[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customImageName, setCustomImageName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [essayContent, setEssayContent] = useState("");

  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(40 * 60);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WritingAnalysisResult | null>(null);
  const [baseAnalysisResult, setBaseAnalysisResult] = useState<WritingAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"criteria" | "model_answer">("criteria");
  const [hasViewedModelEssay, setHasViewedModelEssay] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);
  const [isQuestionPickerOpen, setIsQuestionPickerOpen] = useState(false);

  // In-text annotation & view state
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"annotated" | "edit">("edit");
  const [replacedItems, setReplacedItems] = useState<ReplacedWordItem[]>([]);
  const [ignoredIds, setIgnoredIds] = useState<string[]>([]);

  // Focus/Enlarged Writing Popup State
  const [isWritingModalOpen, setIsWritingModalOpen] = useState(false);

  // Saved Essays State
  const [savedEssays, setSavedEssays] = useState<SavedEssay[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Sync task type if passed from hero quick action
  useEffect(() => {
    if (initialTaskType && initialTaskType !== selectedTaskType) {
      handleTaskTypeChange(initialTaskType);
    }
  }, [initialTaskType]);

  // Fetch saved essays on mount from online API with localStorage cache
  useEffect(() => {
    const fetchSavedEssays = async () => {
      try {
        const res = await fetch("/api/saved-essays");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.essays)) {
            setSavedEssays(data.essays);
            if (typeof window !== "undefined") {
              localStorage.setItem("ielts_saved_essays", JSON.stringify(data.essays));
            }
            return;
          }
        }
      } catch (err) {
        console.warn("Server fetch for saved essays failed:", err);
      }
      if (typeof window !== "undefined") {
        const local = localStorage.getItem("ielts_saved_essays");
        if (local) {
          try {
            setSavedEssays(JSON.parse(local));
          } catch {}
        }
      }
    };
    fetchSavedEssays();
  }, []);

  const handleSaveEssay = async () => {
    if (!essayContent.trim()) return;
    setIsSaving(true);
    const activePromptText = useCustomPrompt
      ? customPrompt || "Custom Question"
      : selectedPrompt.prompt;
    const activeTitle = useCustomPrompt
      ? "Custom Question"
      : selectedPrompt.title;

    const payload = {
      title: activeTitle,
      taskType: selectedTaskType,
      prompt: activePromptText,
      essayText: essayContent,
      wordCount: wordCount,
      overallBand: analysisResult?.overallBand ?? null,
      criteriaScores: analysisResult
        ? {
            taskAchievement: analysisResult.criteria.taskAchievement.score,
            coherenceCohesion: analysisResult.criteria.coherenceCohesion.score,
            lexicalResource: analysisResult.criteria.lexicalResource.score,
            grammaticalRange: analysisResult.criteria.grammaticalRange.score,
          }
        : undefined,
      examinerSummary: analysisResult?.examinerSummary,
    };

    try {
      const res = await fetch("/api/saved-essays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.essays)) {
          setSavedEssays(data.essays);
          if (typeof window !== "undefined") {
            localStorage.setItem("ielts_saved_essays", JSON.stringify(data.essays));
          }
        }
      } else {
        const newRecord: SavedEssay = {
          id: `essay-${Date.now()}`,
          ...payload,
          createdAt: new Date().toISOString(),
        };
        setSavedEssays((prev) => [newRecord, ...prev]);
      }
      setIsSaveSuccess(true);
      setTimeout(() => setIsSaveSuccess(false), 2200);
    } catch (err) {
      console.error("Save error:", err);
      const newRecord: SavedEssay = {
        id: `essay-${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
      };
      setSavedEssays((prev) => [newRecord, ...prev]);
      setIsSaveSuccess(true);
      setTimeout(() => setIsSaveSuccess(false), 2200);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSavedEssay = async (id: string) => {
    setIsDeletingId(id);
    try {
      const res = await fetch(`/api/saved-essays?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.essays)) {
          setSavedEssays(data.essays);
          if (typeof window !== "undefined") {
            localStorage.setItem("ielts_saved_essays", JSON.stringify(data.essays));
          }
          return;
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeletingId(null);
    }
    setSavedEssays((prev) => prev.filter((e) => e.id !== id));
  };

  const handleLoadSavedEssay = (saved: SavedEssay) => {
    setSelectedTaskType(saved.taskType);
    setUseCustomPrompt(true);
    setCustomPrompt(saved.prompt);
    setEssayContent(saved.essayText);
    setShowSavedModal(false);
    setIsWritingModalOpen(false);
    setAnalysisResult(null);
    setBaseAnalysisResult(null);
    setReplacedItems([]);
    setIgnoredIds([]);
    setViewMode("edit");
  };

  // Keyboard shortcut: Esc to minimize writing modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isWritingModalOpen) {
        setIsWritingModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isWritingModalOpen]);

  // Visible Paste handler
  const handlePasteFromClipboard = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator?.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setEssayContent((prev) => (prev.trim() ? prev + "\n\n" + text : text));
          return;
        }
      }
    } catch (err) {
      console.warn("Clipboard access denied or unsupported:", err);
    }
    const fallbackText = window.prompt("Paste your essay paragraph here:");
    if (fallbackText) {
      setEssayContent((prev) => (prev.trim() ? prev + "\n\n" + fallbackText : fallbackText));
    }
  };

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

    // Off-topic submissions cannot be elevated by lexical replacements alone
    const isOffTopic = base.criteria.taskAchievement.score <= 3.0;
    if (isOffTopic) {
      return base;
    }

    const count = currentReplaced.length;
    // Meaningful, progressive elevation across criteria
    const lrBoost = Math.min(2.0, count >= 1 ? 0.5 + (count - 1) * 0.25 : 0);
    const graBoost = Math.min(1.5, count >= 1 ? 0.5 + Math.floor((count - 1) / 2) * 0.5 : 0);
    const ccBoost = Math.min(1.5, count >= 2 ? 0.5 + Math.floor((count - 2) / 2) * 0.5 : 0);

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

    const recentWords = currentReplaced.map((r) => r.replacedText).slice(-2).join(", ");
    const isHigher = newOverall > base.overallBand;

    const updatedSummary = isHigher
      ? `Upgraded to Band ${newOverall.toFixed(1)}! Applying advanced C1/C2 upgrades (${recentWords}) elevated lexical precision and syntactic range beyond Band ${base.overallBand.toFixed(1)}.`
      : `Incorporated ${count} advanced upgrade(s) (${recentWords}). Lexical precision is elevated to Band ${newLR.toFixed(1)} (+${lrBoost.toFixed(1)}). Adopt remaining inspector suggestions to push toward Band ${(base.overallBand + 0.5).toFixed(1)}.`;

    const updatedBottleneck =
      count >= 3
        ? "All key upgrades incorporated! Essay demonstrates Band 8.0+ fluency. Maintain this level on test day."
        : `${count} upgrade(s) applied. Check remaining inspector cards to solidify Band 8.0+ across all criteria.`;

    return {
      ...base,
      overallBand: newOverall,
      criteria: {
        ...base.criteria,
        taskAchievement: {
          ...base.criteria.taskAchievement,
          score: newTA,
          bandLabel: `Band ${newTA.toFixed(1)} (${newTA >= 8.0 ? "Thorough Topic Exploration" : "Well-Developed Response"})`,
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
          feedback: `Incorporated ${count} advanced academic collocation(s): ${recentWords}. Lexical precision and stylistic register are heightened.`,
          keyRecommendations: count >= 2
            ? [
                "Lexical Resource is operating at Band 8.0+ standard.",
                "Ensure precision in complex academic collocations under timed exam conditions."
              ]
            : base.criteria.lexicalResource.keyRecommendations,
        },
        grammaticalRange: {
          ...base.criteria.grammaticalRange,
          score: newGRA,
          bandLabel: `Band ${newGRA.toFixed(1)} (${
            newGRA >= 8.0 ? "Sophisticated Syntactic Variety" : "Complex Structures Controlled"
          })`,
          feedback: count >= 1
            ? `Syntactic control is reinforced with elevated clause structures. Error frequency remains minimal.`
            : base.criteria.grammaticalRange.feedback,
        },
        coherenceCohesion: {
          ...base.criteria.coherenceCohesion,
          score: newCC,
          bandLabel: `Band ${newCC.toFixed(1)} (${
            newCC >= 8.0 ? "Fluent Organic Progression" : "Coherent & Varied"
          })`,
          feedback: count >= 2
            ? `Paragraph cohesion benefits from organic thematic referencing rather than repetitive mechanical connectors.`
            : base.criteria.coherenceCohesion.feedback,
        },
      },
      examinerSummary: updatedSummary,
      primaryBottleneck: updatedBottleneck,
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

  const formatEssayType = (type?: string) => {
    if (!type || type === "All") return "";
    if (type === "opinion") return "Agree / Disagree";
    if (type === "discussion") return "Discuss Both Views";
    if (type === "advantages_disadvantages") return "Advantages & Disadv.";
    if (type === "problem_solution") return "Problem & Solution";
    if (type === "double_question") return "Two-Part Question";
    return type;
  };

  const handleRandomQuestion = () => {
    const available = WRITING_PROMPTS.filter((p) => p.type === selectedTaskType);
    if (available.length <= 1) return;
    let nextPrompt = selectedPrompt;
    let attempts = 0;
    while (nextPrompt.id === selectedPrompt.id && attempts < 20) {
      const randomIndex = Math.floor(Math.random() * available.length);
      nextPrompt = available[randomIndex];
      attempts++;
    }
    setSelectedPrompt(nextPrompt);
    setUseCustomPrompt(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCustomImage(reader.result as string);
      setCustomImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setCustomImage(null);
    setCustomImageName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!essayContent.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setSelectedAnnotationId(null);
    setReplacedItems([]);
    setIgnoredIds([]);
    setHasViewedModelEssay(false);

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
          imageBase64: customImage || undefined,
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

  // Pick only one option when an upgrade string contains slash-separated alternatives (e.g. "pivotal / paramount")
  const pickSingleOption = (replacement: string, original?: string): string => {
    const firstChoice = replacement.includes("/")
      ? replacement.split("/")[0].trim()
      : replacement.trim();
    const cleaned = cleanRepeatedWords(firstChoice);
    if (
      original &&
      original.length > 0 &&
      original[0] === original[0].toUpperCase() &&
      original[0] !== original[0].toLowerCase() &&
      cleaned.length > 0
    ) {
      return cleaned[0].toUpperCase() + cleaned.slice(1);
    }
    return cleaned;
  };

  const handleApplyFix = (original: string, replacement: string, meta?: any) => {
    const cleanOrig = cleanRepeatedWords(original);
    const cleanRepl = pickSingleOption(replacement, cleanOrig);

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
    const cleanOrig = cleanRepeatedWords(originalText);
    const matchedItem = replacedItems.find(
      (r) => r.originalText === cleanOrig || r.replacedText === replacedText
    );
    const actualReplaced = matchedItem ? matchedItem.replacedText : pickSingleOption(replacedText, cleanOrig);
    const cleanRep = cleanRepeatedWords(actualReplaced);

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
        (r) =>
          r.originalText !== cleanOrig &&
          r.replacedText !== cleanRep &&
          r.replacedText !== replacedText
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

    analysisResult.vocabularySuggestions.forEach((sug, idx) => {
      const sugId = sug.id || `sug-${idx + 1}`;
      if (ignoredIds.includes(sugId)) return;
      const orig = cleanRepeatedWords(sug.originalPhrase);
      const upgrade = pickSingleOption(sug.suggestedUpgrade, orig);
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

    analysisResult.sentenceFeedbacks.forEach((err, idx) => {
      const errId = err.id || `err-${idx + 1}`;
      if (ignoredIds.includes(errId)) return;
      const orig = cleanRepeatedWords(err.original);
      const rew = pickSingleOption(err.rewritten, orig);
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

  const handleIgnore = (id: string) => {
    setIgnoredIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    if (selectedAnnotationId === id) {
      setSelectedAnnotationId(null);
    }
  };

  const handleUnignore = (id: string) => {
    setIgnoredIds((prev) => prev.filter((i) => i !== id));
  };

  const handleLoadSampleEssay = () => {
    if (selectedPrompt.modelEssay) {
      setEssayContent(cleanRepeatedWords(selectedPrompt.modelEssay));
    } else {
      setEssayContent(
        `In contemporary society, addressing the challenges surrounding this topic requires a balanced, multifaceted approach.\n\nOn one hand, proactive institutional frameworks ensure that structural obstacles are systematically mitigated. By dedicating resources toward targeted initiatives, communities and organizations can foster sustainable progress.\n\nOn the other hand, individual responsibility and informed decision-making remain equally paramount. Empowering citizens through educational opportunities and transparent policies allows them to contribute constructively to lasting solutions.\n\nIn conclusion, achieving long-term success necessitates thoughtful collaboration between governmental authorities and civil society.`
      );
    }
    setViewMode("edit");
    setReplacedItems([]);
    setIgnoredIds([]);
    setAnalysisResult(null);
    setBaseAnalysisResult(null);
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Task Switcher & Prompt (Clean minimalist toolbar) */}
      <div className="space-y-3 pb-5 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Task Type Switcher: Minimalist horizontal tabs (no box) */}
          <div className="flex items-center gap-5 text-xs">
            <button
              onClick={() => handleTaskTypeChange("task2")}
              className={`py-1 transition-colors cursor-pointer ${
                selectedTaskType === "task2"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
              }`}
            >
              Task 2
            </button>
            <button
              onClick={() => handleTaskTypeChange("task1_academic")}
              className={`py-1 transition-colors cursor-pointer ${
                selectedTaskType === "task1_academic"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
              }`}
            >
              Task 1 Academic
            </button>
            <button
              onClick={() => handleTaskTypeChange("task1_general")}
              className={`py-1 transition-colors cursor-pointer ${
                selectedTaskType === "task1_general"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
              }`}
            >
              Task 1 General
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => setShowSavedModal(true)}
              className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer font-medium transition-colors"
              title="View your saved essays"
            >
              <Bookmark className="w-3.5 h-3.5 text-neutral-500" />
              <span>Saved ({savedEssays.length})</span>
            </button>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
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
            <div className="space-y-2">
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={
                  selectedTaskType.startsWith("task1")
                    ? "Paste custom Task 1 question (e.g. The graph below displays...)"
                    : "Paste custom IELTS writing question..."
                }
                rows={2}
                className="w-full p-3 text-xs sm:text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 font-normal"
              />

              {/* Upload image / graph button & preview */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                />

                {!customImage ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload graph / image</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 text-xs">
                    <img
                      src={customImage}
                      alt="Uploaded graph"
                      className="w-8 h-8 object-cover rounded border border-neutral-200 dark:border-neutral-800"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 max-w-[200px] truncate">
                        {customImageName || "graph.png"}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Attached
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer ml-1"
                      title="Remove image"
                    >
                      <XIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Graph preview when image uploaded */}
              {customImage && (
                <div className="pt-1">
                  <img
                    src={customImage}
                    alt="Uploaded graph reference"
                    className="max-h-52 w-auto max-w-full rounded-lg border border-neutral-200 dark:border-neutral-800 object-contain bg-neutral-50/30 dark:bg-neutral-900/30 p-1"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-3">
              {/* Question Header: Text metadata with dot separators & Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {selectedPrompt.category}
                  </span>
                  {selectedPrompt.essayType && (
                    <>
                      <span className="text-neutral-300 dark:text-neutral-700">•</span>
                      <span>{formatEssayType(selectedPrompt.essayType)}</span>
                    </>
                  )}
                </div>

                {/* Question Selection Actions: Random + Browse Question Bank */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRandomQuestion}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                    title="Pick a random question"
                    aria-label="Pick a random question"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsQuestionPickerOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 text-xs font-semibold transition-all cursor-pointer shadow-xs"
                    title="Browse question bank"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Browse</span>
                  </button>
                </div>
              </div>

              {/* Title & Prompt Text: Pure typography, no nested card boxes */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-serif font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                  {selectedPrompt.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                  {selectedPrompt.prompt}
                </p>
                {selectedPrompt.imageUrl && (
                  <div className="pt-2">
                    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-950 p-2 shadow-xs flex justify-center max-w-2xl">
                      <img
                        src={selectedPrompt.imageUrl}
                        alt={selectedPrompt.title}
                        className="w-full h-auto max-h-[380px] object-contain rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Split View (Paragraph Box on Left, Diagnostic Inspector on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Paragraph Box (pushed to left, col-span-7) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Editor / Review Toolbar: Minimalist row with horizontal divider (no chunky boxes) */}
          <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs pb-2.5 border-b border-neutral-200 dark:border-neutral-800">
            {/* Left side: Word count, View tabs, Alternative words action, and Text actions */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Word count */}
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                <span className={isWordCountMet ? "font-semibold text-emerald-600 dark:text-emerald-400" : "font-semibold text-neutral-900 dark:text-neutral-100"}>
                  {wordCount}
                </span>
                <span className="text-neutral-400 dark:text-neutral-600"> / {targetWords} words</span>
              </div>

              {/* View Mode when analysis exists: Minimal text underline tabs */}
              {analysisResult && (
                <>
                  <span className="text-neutral-200 dark:text-neutral-800 hidden sm:inline">|</span>
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setViewMode("annotated")}
                      className={`py-0.5 transition-colors cursor-pointer flex items-center gap-1 ${
                        viewMode === "annotated"
                          ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                          : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
                      }`}
                    >
                      <Highlighter className="w-3.5 h-3.5" />
                      <span>Annotated</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("edit")}
                      className={`py-0.5 transition-colors cursor-pointer flex items-center gap-1 ${
                        viewMode === "edit"
                          ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                          : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </>
              )}

              {/* Alternative words action */}
              {analysisResult && (
                <>
                  <span className="text-neutral-200 dark:text-neutral-800 hidden sm:inline">|</span>
                  {replacedItems.length > 0 ? (
                    <button
                      type="button"
                      onClick={handleRevertAllUpgrades}
                      className="inline-flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer underline underline-offset-2"
                      title="Revert all alternative words back to original draft"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Revert alternative words ({replacedItems.length})</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyAllUpgrades}
                      className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-medium transition-colors cursor-pointer underline underline-offset-2"
                      title="Apply recommended alternative words"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Apply alternative words</span>
                    </button>
                  )}
                </>
              )}

              {analysisResult && (
                <span className="text-neutral-200 dark:text-neutral-800 hidden sm:inline">|</span>
              )}

              {/* Quick Text Actions: Minimal text buttons */}
              <div className="flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer"
                  title="Paste paragraph from clipboard"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Paste</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveEssay}
                  disabled={isSaving || !essayContent.trim()}
                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                  title="Save essay"
                >
                  {isSaveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Saved</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{isSaving ? "Saving..." : "Save"}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsWritingModalOpen(true)}
                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer"
                  title="Enlarge writing view"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge</span>
                </button>
              </div>
            </div>

            {/* Right side: Timer */}
            <div className="flex items-center gap-2.5 text-xs">
              <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                {formatTimer(secondsRemaining)}
              </span>
              <button
                type="button"
                onClick={() => setTimerRunning(!timerRunning)}
                className="text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer underline underline-offset-2"
              >
                {timerRunning ? "Pause" : "Start timer"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSecondsRemaining(selectedTaskType === "task2" ? 40 * 60 : 20 * 60);
                  setTimerRunning(false);
                }}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer p-0.5 transition-colors"
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
              effectiveFeatures={analysisResult.effectiveFeatures}
              replacedItems={replacedItems}
              selectedId={selectedAnnotationId}
              onSelect={setSelectedAnnotationId}
              onApplyFix={handleApplyFix}
              onRevertFix={handleRevertFix}
              ignoredIds={ignoredIds}
              onIgnore={handleIgnore}
            />
          ) : (
            <textarea
              value={essayContent}
              onChange={(e) => setEssayContent(e.target.value)}
              placeholder="Start writing..."
              rows={16}
              className="w-full p-6 text-[15px] sm:text-base leading-relaxed rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 font-sans min-h-[420px]"
            />
          )}

          {/* Submit Action */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center ${apiKey ? "justify-between" : "justify-end"} gap-3 pt-1`}>
            {apiKey && (
              <span className="text-xs text-neutral-500">
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
                  {analysisResult ? "Re-analyze" : "Analyze"}
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
            effectiveFeatures={analysisResult?.effectiveFeatures || []}
            replacedItems={replacedItems}
            selectedId={selectedAnnotationId}
            onSelect={setSelectedAnnotationId}
            onApplyFix={handleApplyFix}
            onRevertFix={handleRevertFix}
            ignoredIds={ignoredIds}
            onIgnore={handleIgnore}
            onUnignore={handleUnignore}
            taskType={selectedTaskType}
          />
        </div>
      </div>

      {/* Section 3: Diagnostic Results (Spacious layout across wide screen) */}
      {analysisResult && (
        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-8 animate-in fade-in duration-200">
          {/* Header Score Overview: Expansive 3-column dashboard */}
          <div className="py-6 border-b border-neutral-200 dark:border-neutral-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Panel 1: Band Score & Summary */}
            <div className="lg:col-span-5 space-y-2 text-center lg:text-left">
              <div className="text-xs text-neutral-500 font-medium">
                Overall Band Score
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-3.5">
                <span className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-baseline">
                  <span>Band&nbsp;</span>
                  <NumberTicker
                    value={analysisResult.overallBand}
                    decimalPlaces={1}
                    className="font-serif font-bold text-neutral-900 dark:text-neutral-100"
                  />
                </span>
                <BandScoreEmoji score={analysisResult.overallBand} size={54} />
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
              <div
                className={`p-4 border-l-2 text-xs leading-relaxed space-y-1 ${
                  analysisResult.criteria.taskAchievement.score <= 3.0
                    ? "border-red-500 bg-red-500/5 dark:bg-rose-950/20"
                    : "border-neutral-900 dark:border-neutral-100 bg-neutral-50/60 dark:bg-neutral-900/30"
                }`}
              >
                <span
                  className={`font-semibold block text-xs ${
                    analysisResult.criteria.taskAchievement.score <= 3.0
                      ? "text-red-600 dark:text-rose-400"
                      : "text-neutral-900 dark:text-neutral-100"
                  }`}
                >
                  {analysisResult.criteria.taskAchievement.score <= 3.0
                    ? "Off-Topic Penalty Alert:"
                    : "Primary Score Bottleneck:"}
                </span>
                <p
                  className={
                    analysisResult.criteria.taskAchievement.score <= 3.0
                      ? "text-red-700 dark:text-rose-300 font-medium"
                      : "text-neutral-600 dark:text-neutral-400"
                  }
                >
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

          {/* Tab Navigation for Detailed Feedback: Minimal horizontal underline tabs (no box) */}
          <div className="flex items-center gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <button
              onClick={() => setActiveTab("criteria")}
              className={`py-1 text-xs transition-colors cursor-pointer ${
                activeTab === "criteria"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
              }`}
            >
              Criteria Breakdown
            </button>
            <button
              onClick={() => {
                setActiveTab("model_answer");
                setHasViewedModelEssay(true);
              }}
              className={`py-1 text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                activeTab === "model_answer"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
              }`}
            >
              <span>Model Essay</span>
              {!hasViewedModelEssay && activeTab !== "model_answer" && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 dark:bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 dark:bg-emerald-500" />
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: Criteria (Clean column layout with hairline borders) */}
          {activeTab === "criteria" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-2">
                <div className="space-y-3 pb-4 border-b xl:border-b-0 xl:border-r border-neutral-200 dark:border-neutral-800 xl:pr-6 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200 dark:border-neutral-800">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Task Response</span>
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center">
                        Band&nbsp;
                        <NumberTicker
                          value={analysisResult.criteria.taskAchievement.score}
                          decimalPlaces={1}
                          className="text-neutral-900 dark:text-neutral-100 text-xs font-semibold"
                        />
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {analysisResult.criteria.taskAchievement.feedback}
                    </p>
                  </div>
                  <div className="pt-2 text-xs space-y-1 text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-[11px]">Recommendations</div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {analysisResult.criteria.taskAchievement.keyRecommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3 pb-4 border-b xl:border-b-0 xl:border-r border-neutral-200 dark:border-neutral-800 xl:pr-6 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200 dark:border-neutral-800">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Coherence & Cohesion</span>
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center">
                        Band&nbsp;
                        <NumberTicker
                          value={analysisResult.criteria.coherenceCohesion.score}
                          decimalPlaces={1}
                          className="text-neutral-900 dark:text-neutral-100 text-xs font-semibold"
                        />
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {analysisResult.criteria.coherenceCohesion.feedback}
                    </p>
                  </div>
                  <div className="pt-2 text-xs space-y-1 text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-[11px]">Recommendations</div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {analysisResult.criteria.coherenceCohesion.keyRecommendations?.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                    {analysisResult.cohesionAnalysis.overusedLinkers.length > 0 && (
                      <div className="text-[11px] text-amber-700 dark:text-amber-400 border-l-2 border-amber-500 pl-2 mt-1">
                        Overused linkers: {analysisResult.cohesionAnalysis.overusedLinkers.join(", ")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pb-4 border-b xl:border-b-0 xl:border-r border-neutral-200 dark:border-neutral-800 xl:pr-6 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200 dark:border-neutral-800">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Lexical Resource</span>
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center">
                        Band&nbsp;
                        <NumberTicker
                          value={analysisResult.criteria.lexicalResource.score}
                          decimalPlaces={1}
                          className="text-neutral-900 dark:text-neutral-100 text-xs font-semibold"
                        />
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {analysisResult.criteria.lexicalResource.feedback}
                    </p>
                  </div>
                  <div className="pt-2 text-xs space-y-1 text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-[11px]">Recommendations</div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {analysisResult.criteria.lexicalResource.keyRecommendations?.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3 pb-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200 dark:border-neutral-800">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Grammatical Range</span>
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center">
                        Band&nbsp;
                        <NumberTicker
                          value={analysisResult.criteria.grammaticalRange.score}
                          decimalPlaces={1}
                          className="text-neutral-900 dark:text-neutral-100 text-xs font-semibold"
                        />
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {analysisResult.criteria.grammaticalRange.feedback}
                    </p>
                  </div>
                  <div className="pt-2 text-xs space-y-1 text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-[11px]">Recommendations</div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {analysisResult.criteria.grammaticalRange.keyRecommendations?.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Band 8–9 Assessment Standards */}
              <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800 space-y-0.5">
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                    Band 8–9 Assessment Standards
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Linguistic distinctions between Band 7 and Band 9 scripts.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-2">
                  {/* Pillar 1: Academic Hedging (TR) */}
                  <div className="space-y-3 pb-4 border-b xl:border-b-0 xl:border-r border-neutral-200 dark:border-neutral-800 xl:pr-6 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="pb-1.5 border-b border-neutral-200 dark:border-neutral-800">
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          1. Academic Hedging (TR)
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Band 7 scripts often rely on categorical absolutes (e.g., <em>&ldquo;will always lead to&rdquo;</em>). Band 9 responses maintain cautious, qualified claims.
                      </p>
                    </div>
                    <div className="pt-2 text-xs space-y-2 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="border-l-2 border-rose-400/80 dark:border-rose-500/80 pl-2.5 py-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                        <span className="text-[10px] font-mono font-semibold uppercase text-rose-500 mr-1.5 block sm:inline">Band 7.0:</span>
                        &ldquo;AI will inevitably replace all human labor in the foreseeable future.&rdquo;
                      </div>
                      <div className="border-l-2 border-emerald-500 dark:border-emerald-400 pl-2.5 py-0.5 text-xs text-neutral-900 dark:text-neutral-100 font-medium">
                        <span className="text-[10px] font-mono font-semibold uppercase text-emerald-600 dark:text-emerald-400 mr-1.5 block sm:inline">Band 8.5+:</span>
                        &ldquo;While AI is arguably poised to displace routine clerical roles, it tends to complement high-order analytical occupations.&rdquo;
                      </div>
                    </div>
                  </div>

                  {/* Pillar 2: Thematic Referencing (CC) */}
                  <div className="space-y-3 pb-4 border-b xl:border-b-0 xl:border-r border-neutral-200 dark:border-neutral-800 xl:pr-6 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="pb-1.5 border-b border-neutral-200 dark:border-neutral-800">
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          2. Thematic Referencing (CC)
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Band 8+ cohesion attracts no attention. Replace mechanical linkers (<em>&ldquo;Furthermore&rdquo;, &ldquo;In addition&rdquo;</em>) with demonstrative noun-phrase bridging.
                      </p>
                    </div>
                    <div className="pt-2 text-xs space-y-2 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="border-l-2 border-rose-400/80 dark:border-rose-500/80 pl-2.5 py-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                        <span className="text-[10px] font-mono font-semibold uppercase text-rose-500 mr-1.5 block sm:inline">Band 7.0:</span>
                        &ldquo;Furthermore, the environment is being damaged. In addition, governments must act.&rdquo;
                      </div>
                      <div className="border-l-2 border-emerald-500 dark:border-emerald-400 pl-2.5 py-0.5 text-xs text-neutral-900 dark:text-neutral-100 font-medium">
                        <span className="text-[10px] font-mono font-semibold uppercase text-emerald-600 dark:text-emerald-400 mr-1.5 block sm:inline">Band 8.5+:</span>
                        &ldquo;This escalating ecological strain in turn necessitates decisive, synchronized state intervention.&rdquo;
                      </div>
                    </div>
                  </div>

                  {/* Pillar 3: Syntactic Inversion & Clefting (GRA) */}
                  <div className="space-y-3 pb-4 border-b xl:border-b-0 xl:border-r border-neutral-200 dark:border-neutral-800 xl:pr-6 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="pb-1.5 border-b border-neutral-200 dark:border-neutral-800">
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          3. Inversion & Clefting (GRA)
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Incorporate advanced clause structures naturally, such as inverted conditionals (<em>&ldquo;Were [subject] to [verb]&rdquo;</em>) and cleft constructions.
                      </p>
                    </div>
                    <div className="pt-2 text-xs space-y-2 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="border-l-2 border-rose-400/80 dark:border-rose-500/80 pl-2.5 py-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                        <span className="text-[10px] font-mono font-semibold uppercase text-rose-500 mr-1.5 block sm:inline">Band 7.0:</span>
                        &ldquo;If authorities subsidize public transport, commuters will stop driving cars.&rdquo;
                      </div>
                      <div className="border-l-2 border-emerald-500 dark:border-emerald-400 pl-2.5 py-0.5 text-xs text-neutral-900 dark:text-neutral-100 font-medium">
                        <span className="text-[10px] font-mono font-semibold uppercase text-emerald-600 dark:text-emerald-400 mr-1.5 block sm:inline">Band 8.5+:</span>
                        &ldquo;Were authorities to heavily subsidize municipal transit, commuters would be markedly more inclined to forgo private transport.&rdquo;
                      </div>
                    </div>
                  </div>

                  {/* Pillar 4: Connotative Precision (LR) */}
                  <div className="space-y-3 pb-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="pb-1.5 border-b border-neutral-200 dark:border-neutral-800">
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          4. Lexical Precision (LR)
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Band 8.5+ relies on precise collocation rather than generic synonyms. Pair analytical verbs with specific abstract nouns.
                      </p>
                    </div>
                    <div className="pt-2 text-xs space-y-2 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="border-l-2 border-rose-400/80 dark:border-rose-500/80 pl-2.5 py-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                        <span className="text-[10px] font-mono font-semibold uppercase text-rose-500 mr-1.5 block sm:inline">Band 7.0:</span>
                        &ldquo;This will solve the problem and have a positive impact on the economy.&rdquo;
                      </div>
                      <div className="border-l-2 border-emerald-500 dark:border-emerald-400 pl-2.5 py-0.5 text-xs text-neutral-900 dark:text-neutral-100 font-medium">
                        <span className="text-[10px] font-mono font-semibold uppercase text-emerald-600 dark:text-emerald-400 mr-1.5 block sm:inline">Band 8.5+:</span>
                        &ldquo;This systematically alleviates underlying structural friction, thereby yielding palpable macroeconomic dividends.&rdquo;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Model Answer */}
          {activeTab === "model_answer" && (() => {
            const modelEssayText = selectedPrompt.modelEssay || analysisResult.modelAnswer;
            const modelWordCount = (modelEssayText.trim().match(/\S+/g) || []).length;
            const paragraphs = modelEssayText.split(/\n\s*\n/).filter((p) => p.trim());

            return (
              <div className="pt-3 space-y-5">
                {/* Header info: Minimal typography with horizontal hairline divider (non-selectable) */}
                <div className="flex flex-wrap items-baseline justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800 select-none">
                  <div className="space-y-0.5">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Topic: <span className="text-neutral-800 dark:text-neutral-200 font-medium">{selectedPrompt.title}</span>
                      <span className="text-neutral-300 dark:text-neutral-700 mx-1.5">•</span>
                      <span>{modelWordCount} words</span>
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(modelEssayText);
                      }}
                      className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Copy model essay
                    </button>
                  </div>
                </div>

                {/* Reference Graph / Image (for Task 1) */}
                {selectedPrompt.imageUrl && (
                  <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-950 p-2 shadow-xs flex justify-center max-w-xl mx-auto select-none">
                    <img
                      src={selectedPrompt.imageUrl}
                      alt={selectedPrompt.title}
                      className="w-full h-auto max-h-[340px] object-contain rounded-lg"
                    />
                  </div>
                )}

                {/* Essay Paragraphs - only the essay body itself is highlightable */}
                <div
                  data-paragraph="true"
                  className="ielts-paragraph space-y-4 text-xs sm:text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 font-serif"
                >
                  {paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {p.trim()}
                    </p>
                  ))}
                </div>
              </div>
            );
          })()}
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

      {/* Focused Enlarged Writing Popup Modal */}
      {isWritingModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsWritingModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl flex flex-col w-full h-[94vh] max-w-7xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {selectedTaskType === "task2"
                    ? "Task 2 • Essay"
                    : selectedTaskType === "task1_academic"
                    ? "Task 1 • Academic Report"
                    : "Task 1 • General Letter"}
                </span>
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
                <span
                  className={`text-xs font-medium ${
                    isWordCountMet
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {wordCount} / {targetWords} words
                </span>
              </div>

              {/* Timer in Modal Header */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                  {formatTimer(secondsRemaining)}
                </span>
                <button
                  type="button"
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                >
                  {timerRunning ? "Pause" : "Start Timer"}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Visible Paste Button */}
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer shadow-xs transition-colors"
                  title="Paste paragraph from clipboard"
                >
                  <ClipboardPaste className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Paste</span>
                </button>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSaveEssay}
                  disabled={isSaving || !essayContent.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer shadow-xs transition-colors disabled:opacity-40"
                  title="Save essay and estimated score"
                >
                  {isSaveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Saved</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{isSaving ? "Saving..." : "Save"}</span>
                    </>
                  )}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsWritingModalOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer transition-colors"
                  title="Close popup (Esc)"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Task 1 side layout vs Task 2 top layout */}
            {selectedTaskType.startsWith("task1") ? (
              /* TASK 1: Question and Image on the Side (Left Column) */
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
                {/* Left Side: Question Prompt & Image/Graph */}
                <div className="w-full md:w-[420px] lg:w-[460px] xl:w-[500px] shrink-0 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 overflow-y-auto space-y-4 bg-neutral-50/50 dark:bg-neutral-900/20">
                  {/* Prompt Card */}
                  <div className="space-y-1.5">
                    <span className="text-xs text-neutral-500 font-medium">
                      Task 1 Prompt
                    </span>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {useCustomPrompt ? "Custom Question" : selectedPrompt.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-line font-normal">
                      {useCustomPrompt
                        ? customPrompt || "No custom question text provided."
                        : selectedPrompt.prompt}
                    </p>
                  </div>

                  {/* Reference Image / Graph */}
                  <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500 font-medium">
                        Reference Graph / Image
                      </span>
                      {customImage ? (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="text-[11px] text-red-500 hover:text-red-600 font-medium cursor-pointer"
                        >
                          Remove Custom
                        </button>
                      ) : !useCustomPrompt && selectedPrompt.imageUrl ? (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[11px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium cursor-pointer"
                        >
                          Upload Custom
                        </button>
                      ) : null}
                    </div>

                    {customImage || (!useCustomPrompt && selectedPrompt.imageUrl) ? (
                      <div className="space-y-1.5">
                        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-950 p-2 shadow-xs flex justify-center">
                          <img
                            src={customImage || selectedPrompt.imageUrl}
                            alt="Task 1 reference chart"
                            className="w-full h-auto max-h-[380px] object-contain rounded-lg"
                          />
                        </div>
                        {customImageName ? (
                          <div className="text-[10px] text-neutral-400 truncate">
                            {customImageName}
                          </div>
                        ) : !useCustomPrompt ? (
                          <div className="text-[10px] text-neutral-400 truncate">
                            {selectedPrompt.title}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-5 text-center space-y-2 bg-white/60 dark:bg-neutral-950/60">
                        <Upload className="w-5 h-5 mx-auto text-neutral-400" />
                        <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                          Upload graph or diagram
                        </div>
                        <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                          Attach a chart, table, or diagram to view directly alongside your writing.
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer shadow-xs transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose image</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Paragraph Writing Textarea */}
                <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden bg-white dark:bg-neutral-950">
                  <textarea
                    autoFocus
                    value={essayContent}
                    onChange={(e) => setEssayContent(e.target.value)}
                    placeholder="Start writing..."
                    className="w-full flex-1 p-3 sm:p-4 text-[15px] sm:text-base leading-relaxed bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none resize-none font-sans"
                  />
                </div>
              </div>
            ) : (
              /* TASK 2: Question on Top, Textarea Below */
              <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                {/* Top Section: Question Prompt */}
                <div className="shrink-0 border-b border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 bg-neutral-50/50 dark:bg-neutral-900/20 space-y-1.5 max-h-[30vh] overflow-y-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 font-medium">
                      Task 2 Essay Question
                    </span>
                    {!useCustomPrompt && (
                      <span className="text-xs text-neutral-400">• {selectedPrompt.category}</span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {useCustomPrompt ? "Custom Question" : selectedPrompt.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-700 dark:text-neutral-300 font-normal">
                    {useCustomPrompt
                      ? customPrompt || "No custom question text provided."
                      : selectedPrompt.prompt}
                  </p>
                </div>

                {/* Bottom Section: Writing Textarea */}
                <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden bg-white dark:bg-neutral-950">
                  <textarea
                    autoFocus
                    value={essayContent}
                    onChange={(e) => setEssayContent(e.target.value)}
                    placeholder="Start writing..."
                    className="w-full flex-1 p-3 sm:p-4 text-[15px] sm:text-base leading-relaxed bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none resize-none font-sans"
                  />
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-4 sm:px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsWritingModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Done Writing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsWritingModalOpen(false);
                    handleAnalyze();
                  }}
                  disabled={isAnalyzing || !essayContent.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-30 transition-all cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Essays Modal */}
      <SavedEssaysModal
        isOpen={showSavedModal}
        onClose={() => setShowSavedModal(false)}
        savedEssays={savedEssays}
        onLoadEssay={handleLoadSavedEssay}
        onDeleteEssay={handleDeleteSavedEssay}
        isDeletingId={isDeletingId}
      />

      {/* Question Picker Modal */}
      <QuestionPickerModal
        isOpen={isQuestionPickerOpen}
        onClose={() => setIsQuestionPickerOpen(false)}
        prompts={WRITING_PROMPTS.filter((p) => p.type === selectedTaskType)}
        selectedPromptId={selectedPrompt.id}
        onSelectPrompt={(prompt) => {
          setSelectedPrompt(prompt);
          setUseCustomPrompt(false);
        }}
      />
    </div>
  );
}
