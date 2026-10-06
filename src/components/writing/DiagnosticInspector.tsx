"use client";

import React, { useState, useEffect, useRef } from "react";
import { SentenceFeedback, VocabularySuggestion, ReplacedWordItem } from "@/types/ielts";
import {
  AlertTriangle,
  Sparkles,
  Check,
  ArrowRight,
  Eye,
  BookOpen,
  CheckCircle2,
  Filter,
  RotateCcw,
  Award,
} from "lucide-react";

interface DiagnosticInspectorProps {
  errors: SentenceFeedback[];
  suggestions: VocabularySuggestion[];
  replacedItems?: ReplacedWordItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onApplyFix: (original: string, replacement: string, meta?: any) => void;
  onRevertFix?: (replacedText: string, originalText: string) => void;
  taskType: string;
}

export function DiagnosticInspector({
  errors,
  suggestions,
  replacedItems = [],
  selectedId,
  onSelect,
  onApplyFix,
  onRevertFix,
  taskType,
}: DiagnosticInspectorProps) {
  const [filter, setFilter] = useState<"all" | "errors" | "suggestions" | "replaced">("all");
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const totalItems = errors.length + suggestions.length;
  const replacedCount = replacedItems.length;

  // Auto-scroll to selected card when selectedId changes from paragraph click
  useEffect(() => {
    if (selectedId && cardRefs.current[selectedId]) {
      cardRefs.current[selectedId]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedId]);

  const handleApply = (item: any, original: string, replacement: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onApplyFix(original, replacement, {
      id: item.id,
      higherRatedWordExplanation: item.higherRatedWordExplanation,
      higherRatedWords: item.higherRatedWords,
    });
  };

  const handleRevert = (original: string, replacement: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRevertFix) {
      onRevertFix(replacement, original);
    }
  };

  // If no feedback items exist yet, show examiner guidelines
  if (totalItems === 0) {
    return (
      <div className="h-full p-5 rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.01] dark:bg-white/[0.01] flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 pb-3 border-b border-black/10 dark:border-white/10">
            <BookOpen className="w-4 h-4 text-neutral-500" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-black dark:text-white">
              Examiner Rubric Criteria
            </h3>
          </div>

          <div className="pt-4 space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
            <p className="leading-relaxed">
              When you submit your response, this inspector highlights mistakes directly in the
              paragraph, explains higher-rated words, and lets you swap replacements with one click.
            </p>

            <div className="p-3 rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-black space-y-1">
              <span className="font-semibold text-red-600 dark:text-red-400 block text-[11px]">
                🔴 In-Text Mistakes (Red Wavy)
              </span>
              <p className="text-[11px] leading-relaxed text-neutral-500">
                Punctuation errors, comma splices, mechanical linkers, and subject-verb slips.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-black/5 dark:border-white/10 bg-white dark:bg-black space-y-1">
              <span className="font-semibold text-violet-600 dark:text-violet-400 block text-[11px]">
                🟣 Vocabulary Upgrades (Violet Dashed)
              </span>
              <p className="text-[11px] leading-relaxed text-neutral-500">
                Natural C1/C2 collocations, academic idioms, and high-register reporting verbs.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-1">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300 block text-[11px]">
                🟢 Replaced Words (Emerald Solid)
              </span>
              <p className="text-[11px] leading-relaxed text-emerald-900/80 dark:text-emerald-300/80">
                Directly replaced in your essay with full examiner rationale on why that word rates higher.
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-[11px] text-neutral-500">
          <span className="font-semibold text-black dark:text-white block mb-0.5">
            Target Length:
          </span>
          {taskType === "task2" ? "250+ words (Task 2)" : "150+ words (Task 1)"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Header and Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-black/10 dark:border-white/10">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5">
            Examiner Inspector
            <span className="px-1.5 py-0.2 rounded-full font-mono text-[10px] bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-300">
              {totalItems}
            </span>
          </h3>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Click any card to highlight in paragraph
          </p>
        </div>

        {/* Filter buttons */}
        <div className="inline-flex items-center p-0.5 rounded-lg border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] text-[11px]">
          <button
            onClick={() => setFilter("all")}
            className={`px-2 py-1 rounded-md transition-colors ${
              filter === "all"
                ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          >
            All ({totalItems})
          </button>
          <button
            onClick={() => setFilter("errors")}
            className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
              filter === "errors"
                ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Errors ({errors.length})
          </button>
          <button
            onClick={() => setFilter("suggestions")}
            className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
              filter === "suggestions"
                ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Vocab ({suggestions.length})
          </button>
          {replacedCount > 0 && (
            <button
              onClick={() => setFilter("replaced")}
              className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                filter === "replaced"
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                  : "text-emerald-600 dark:text-emerald-400 hover:text-black dark:hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Replaced ({replacedCount})
            </button>
          )}
        </div>
      </div>

      {/* Cards Scroll Container */}
      <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
        {/* Render Errors */}
        {(filter === "all" || filter === "errors" || filter === "replaced") &&
          errors.map((err, idx) => {
            const id = err.id || `err-${idx + 1}`;
            const isSelected = selectedId === id;
            const isReplaced = replacedItems.some(
              (r) => r.originalText === err.original || r.replacedText === err.rewritten
            );

            if (filter === "replaced" && !isReplaced) return null;

            return (
              <div
                key={id}
                ref={(el) => {
                  cardRefs.current[id] = el;
                }}
                onClick={() => onSelect(isSelected ? null : id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 text-xs ${
                  isReplaced
                    ? "border-emerald-500/40 bg-emerald-500/[0.03]"
                    : isSelected
                    ? "border-red-500/80 bg-red-500/5 ring-2 ring-red-500/30"
                    : "border-black/10 dark:border-white/15 bg-white dark:bg-black hover:border-black/25 dark:hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isReplaced ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`font-mono text-[10px] uppercase font-semibold ${
                        isReplaced
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {isReplaced ? "Replaced in Essay" : `${err.issueType.replace("_", " ")} Mistake`}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(id);
                    }}
                    className="text-[10px] text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    Locate
                  </button>
                </div>

                {/* Before / After */}
                <div className="space-y-1.5">
                  <div className="p-2 rounded-md bg-black/[0.03] dark:bg-white/[0.03] text-neutral-500 line-through">
                    "{err.original}"
                  </div>
                  <div className="p-2 rounded-md bg-emerald-500/5 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200 font-medium">
                    "{err.rewritten}"
                  </div>
                </div>

                {/* Small explanation of that higher rated word */}
                {err.higherRatedWordExplanation && (
                  <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                      <Award className="w-3 h-3" />
                      <span>Why This Rates Higher:</span>
                    </div>
                    <p className="text-[11px] text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {err.higherRatedWordExplanation}
                    </p>
                    {err.higherRatedWords && (
                      <div className="pt-1 space-y-1">
                        {err.higherRatedWords.map((hw, i) => (
                          <div key={i} className="text-[10px] flex items-baseline gap-1 text-neutral-600 dark:text-neutral-400">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-300 font-mono">
                              {hw.word}
                            </span>
                            {hw.level && (
                              <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                                {hw.level}
                              </span>
                            )}
                            <span>— {hw.explanation}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
                  {err.explanation}
                </p>

                {err.bandUpgradeTip && (
                  <div className="text-[11px] text-neutral-500 italic">
                    💡 {err.bandUpgradeTip}
                  </div>
                )}

                <div className="pt-1 flex items-center justify-end">
                  {isReplaced ? (
                    <button
                      onClick={(e) => handleRevert(err.original, err.rewritten, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-black/10 dark:border-white/15 bg-white dark:bg-black text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Revert Word
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleApply(err, err.original, err.rewritten, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      Apply Higher-Rated Fix
                    </button>
                  )}
                </div>
              </div>
            );
          })}

        {/* Render Vocabulary Suggestions */}
        {(filter === "all" || filter === "suggestions" || filter === "replaced") &&
          suggestions.map((sug, idx) => {
            const id = sug.id || `sug-${idx + 1}`;
            const isSelected = selectedId === id;
            const isReplaced = replacedItems.some(
              (r) => r.originalText === sug.originalPhrase || r.replacedText === sug.suggestedUpgrade
            );

            if (filter === "replaced" && !isReplaced) return null;

            return (
              <div
                key={id}
                ref={(el) => {
                  cardRefs.current[id] = el;
                }}
                onClick={() => onSelect(isSelected ? null : id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 text-xs ${
                  isReplaced
                    ? "border-emerald-500/40 bg-emerald-500/[0.03]"
                    : isSelected
                    ? "border-violet-500/80 bg-violet-500/5 ring-2 ring-violet-500/30"
                    : "border-black/10 dark:border-white/15 bg-white dark:bg-black hover:border-black/25 dark:hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isReplaced ? "bg-emerald-500" : "bg-violet-500"
                      }`}
                    />
                    <span
                      className={`font-mono text-[10px] uppercase font-semibold ${
                        isReplaced
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-violet-600 dark:text-violet-400"
                      }`}
                    >
                      {isReplaced ? "Replaced in Essay" : `${sug.type.replace("_", " ")} Upgrade`}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(id);
                    }}
                    className="text-[10px] text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    Locate
                  </button>
                </div>

                {/* Phrase Upgrade */}
                <div className="space-y-1.5">
                  <div className="p-2 rounded-md bg-black/[0.03] dark:bg-white/[0.03] text-neutral-500 line-through">
                    "{sug.originalPhrase}"
                  </div>
                  <div className="p-2 rounded-md bg-violet-500/5 border border-violet-500/20 text-violet-950 dark:text-violet-200 font-medium">
                    "{sug.suggestedUpgrade}"
                  </div>
                </div>

                {/* Small explanation of that higher rated word */}
                {sug.higherRatedWordExplanation && (
                  <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                      <Award className="w-3 h-3" />
                      <span>Why This Word Rates Higher (Band 8+):</span>
                    </div>
                    <p className="text-[11px] text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {sug.higherRatedWordExplanation}
                    </p>
                    {sug.higherRatedWords && (
                      <div className="pt-1 space-y-1">
                        {sug.higherRatedWords.map((hw, i) => (
                          <div key={i} className="text-[10px] flex items-baseline gap-1 text-neutral-600 dark:text-neutral-400">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-300 font-mono">
                              {hw.word}
                            </span>
                            {hw.level && (
                              <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                                {hw.level}
                              </span>
                            )}
                            <span>— {hw.explanation}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
                  {sug.explanation}
                </p>

                {sug.exampleInSentence && (
                  <div className="p-2 rounded-md bg-black/[0.02] dark:bg-white/[0.02] text-[11px] text-neutral-600 dark:text-neutral-400 italic">
                    Example: "{sug.exampleInSentence}"
                  </div>
                )}

                <div className="pt-1 flex items-center justify-end">
                  {isReplaced ? (
                    <button
                      onClick={(e) => handleRevert(sug.originalPhrase, sug.suggestedUpgrade, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-black/10 dark:border-white/15 bg-white dark:bg-black text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Revert Word
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleApply(sug, sug.originalPhrase, sug.suggestedUpgrade, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      Apply Higher-Rated Word
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
