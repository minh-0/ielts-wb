"use client";

import React, { useState, useEffect, useRef } from "react";
import { SentenceFeedback, VocabularySuggestion, ReplacedWordItem } from "@/types/ielts";
import {
  ChevronDown,
  ArrowRight,
  Eye,
  RotateCcw,
  Award,
  Sparkles,
  AlertTriangle,
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
  const [expandedIds, setExpandedIds] = useState<{ [key: string]: boolean }>({});
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const totalItems = errors.length + suggestions.length;
  const replacedCount = replacedItems.length;

  // Auto-expand and scroll to selected card when selectedId changes from paragraph click
  useEffect(() => {
    if (selectedId) {
      setExpandedIds((prev) => ({ ...prev, [selectedId]: true }));
      if (cardRefs.current[selectedId]) {
        cardRefs.current[selectedId]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedId]);

  const toggleCard = (id: string) => {
    setExpandedIds((prev) => {
      const willExpand = !prev[id];
      if (willExpand) {
        onSelect(id);
      } else if (selectedId === id) {
        onSelect(null);
      }
      return { ...prev, [id]: willExpand };
    });
  };

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

  // If no feedback items exist yet, show clean minimal empty state
  if (totalItems === 0) {
    return (
      <div className="h-full p-4 sm:p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
            <h3 className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Inspector
            </h3>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
              {taskType === "task2" ? "250+ words" : "150+ words"}
            </span>
          </div>

          <div className="py-14 text-center">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-[240px] mx-auto leading-relaxed">
              Submit your response to view sentence diagnostics and vocabulary upgrades.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-around text-[11px] text-neutral-400 dark:text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500/70" />
            Grammar
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500/70" />
            Vocabulary
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
            Applied
          </span>
        </div>
      </div>
    );
  }

  // Calculate items matching current filter
  const visibleErrors = (filter === "all" || filter === "errors" || filter === "replaced")
    ? errors.filter((err) => {
        if (filter !== "replaced") return true;
        return replacedItems.some(
          (r) => r.originalText === err.original || r.replacedText === err.rewritten
        );
      })
    : [];

  const visibleSuggestions = (filter === "all" || filter === "suggestions" || filter === "replaced")
    ? suggestions.filter((sug) => {
        if (filter !== "replaced") return true;
        return replacedItems.some(
          (r) => r.originalText === sug.originalPhrase || r.replacedText === sug.suggestedUpgrade
        );
      })
    : [];

  const visibleTotal = visibleErrors.length + visibleSuggestions.length;
  const allVisibleIds = [
    ...visibleErrors.map((e, idx) => e.id || `err-${idx + 1}`),
    ...visibleSuggestions.map((s, idx) => s.id || `sug-${idx + 1}`),
  ];
  const allAreExpanded = allVisibleIds.length > 0 && allVisibleIds.every((id) => Boolean(expandedIds[id]));

  const handleToggleExpandAll = () => {
    if (allAreExpanded) {
      setExpandedIds({});
      onSelect(null);
    } else {
      const next: { [key: string]: boolean } = {};
      allVisibleIds.forEach((id) => {
        next[id] = true;
      });
      setExpandedIds(next);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header and Filter Pills */}
      <div className="space-y-2 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              Inspector
              <span className="px-1.5 py-0.2 rounded-full font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {totalItems}
              </span>
            </h3>
          </div>

          {/* Filter buttons */}
          <div className="inline-flex items-center p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-[11px]">
            <button
              onClick={() => setFilter("all")}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                filter === "all"
                  ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              All ({totalItems})
            </button>
            <button
              onClick={() => setFilter("errors")}
              className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                filter === "errors"
                  ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-rose-400/80" />
              Errors ({errors.length})
            </button>
            <button
              onClick={() => setFilter("suggestions")}
              className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                filter === "suggestions"
                  ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-purple-400/80" />
              Vocab ({suggestions.length})
            </button>
            {replacedCount > 0 && (
              <button
                onClick={() => setFilter("replaced")}
                className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                  filter === "replaced"
                    ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                    : "text-emerald-600 dark:text-emerald-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Replaced ({replacedCount})
              </button>
            )}
          </div>
        </div>

        {/* Subheader: Quick expand/collapse toggle */}
        <div className="flex items-center justify-between text-[11px] pt-1">
          <span className="text-neutral-500 dark:text-neutral-400">
            {visibleTotal} items shown · compact view
          </span>
          <button
            type="button"
            onClick={handleToggleExpandAll}
            className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 underline underline-offset-2 transition-colors cursor-pointer"
          >
            {allAreExpanded ? "Collapse all ↑" : "Expand all ↓"}
          </button>
        </div>
      </div>

      {/* Cards Scroll Container */}
      <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
        {/* Render Errors */}
        {visibleErrors.map((err, idx) => {
          const id = err.id || `err-${idx + 1}`;
          const isSelected = selectedId === id;
          const isExpanded = Boolean(expandedIds[id] || isSelected);
          const isReplaced = replacedItems.some(
            (r) => r.originalText === err.original || r.replacedText === err.rewritten
          );

          const issueLabel = isReplaced
            ? "Replaced in Essay"
            : `${err.issueType.replace("_", " ")} Mistake`;

          return (
            <div
              key={id}
              ref={(el) => {
                cardRefs.current[id] = el;
              }}
              className={`rounded-xl border transition-all text-xs overflow-hidden ${
                isReplaced
                  ? "border-emerald-500/40 bg-emerald-500/[0.03]"
                  : isSelected
                  ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30 dark:border-rose-500/40 dark:bg-rose-950/20 dark:ring-rose-500/20"
                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700"
              }`}
            >
              {/* Clickable Header Row: Always visible and compact */}
              <div
                onClick={() => toggleCard(id)}
                className="p-3 flex items-center justify-between gap-2.5 cursor-pointer select-none hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isReplaced ? "bg-emerald-500" : "bg-red-500 dark:bg-rose-400/80"
                    }`}
                  />
                  <span
                    className={`font-mono text-[10px] uppercase font-semibold shrink-0 ${
                      isReplaced
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-rose-300/80"
                    }`}
                  >
                    {issueLabel}
                  </span>
                  <span className="text-[11px] text-neutral-600 dark:text-neutral-400 truncate font-mono">
                    "{err.original}"
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(id);
                      setExpandedIds((prev) => ({ ...prev, [id]: true }));
                    }}
                    className="text-[10px] text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 transition-colors"
                    title="Locate in paragraph"
                  >
                    <Eye className="w-3 h-3" />
                    <span className="hidden sm:inline">Locate</span>
                  </button>
                  <div
                    className={`p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Popped-Down Details */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-neutral-100 dark:border-neutral-800/80 animate-in fade-in-50 duration-150">
                  {/* Before / After */}
                  <div className="space-y-1.5 pt-1">
                    <div className="p-2 rounded-md bg-neutral-100/60 dark:bg-neutral-900/60 text-neutral-500 line-through">
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
                            <div
                              key={i}
                              className="text-[10px] flex items-baseline gap-1 text-neutral-600 dark:text-neutral-400"
                            >
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
                        type="button"
                        onClick={(e) => handleRevert(err.original, err.rewritten, e)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-black/10 dark:border-white/15 bg-white dark:bg-black text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Revert Word
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleApply(err, err.original, err.rewritten, e)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        Apply Higher-Rated Fix
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Render Vocabulary Suggestions */}
        {visibleSuggestions.map((sug, idx) => {
          const id = sug.id || `sug-${idx + 1}`;
          const isSelected = selectedId === id;
          const isExpanded = Boolean(expandedIds[id] || isSelected);
          const isReplaced = replacedItems.some(
            (r) => r.originalText === sug.originalPhrase || r.replacedText === sug.suggestedUpgrade
          );

          const upgradeLabel = isReplaced
            ? "Replaced in Essay"
            : `${sug.type.replace("_", " ")} Upgrade`;

          return (
            <div
              key={id}
              ref={(el) => {
                cardRefs.current[id] = el;
              }}
              className={`rounded-xl border transition-all text-xs overflow-hidden ${
                isReplaced
                  ? "border-emerald-500/40 bg-emerald-500/[0.03]"
                  : isSelected
                  ? "border-violet-500/80 bg-violet-500/5 ring-1 ring-violet-500/30 dark:border-purple-500/40 dark:bg-purple-950/20 dark:ring-purple-500/20"
                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700"
              }`}
            >
              {/* Clickable Header Row: Always visible and compact */}
              <div
                onClick={() => toggleCard(id)}
                className="p-3 flex items-center justify-between gap-2.5 cursor-pointer select-none hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isReplaced ? "bg-emerald-500" : "bg-violet-500 dark:bg-purple-400/80"
                    }`}
                  />
                  <span
                    className={`font-mono text-[10px] uppercase font-semibold shrink-0 ${
                      isReplaced
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-violet-600 dark:text-purple-300/80"
                    }`}
                  >
                    {upgradeLabel}
                  </span>
                  <span className="text-[11px] text-neutral-600 dark:text-neutral-400 truncate font-mono">
                    "{sug.originalPhrase}"
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(id);
                      setExpandedIds((prev) => ({ ...prev, [id]: true }));
                    }}
                    className="text-[10px] text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 transition-colors"
                    title="Locate in paragraph"
                  >
                    <Eye className="w-3 h-3" />
                    <span className="hidden sm:inline">Locate</span>
                  </button>
                  <div
                    className={`p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Popped-Down Details */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-neutral-100 dark:border-neutral-800/80 animate-in fade-in-50 duration-150">
                  {/* Phrase Upgrade */}
                  <div className="space-y-1.5 pt-1">
                    <div className="p-2 rounded-md bg-neutral-100/60 dark:bg-neutral-900/60 text-neutral-500 line-through">
                      "{sug.originalPhrase}"
                    </div>
                    <div className="p-2 rounded-md bg-violet-500/5 border border-violet-500/20 text-violet-950 dark:bg-purple-950/30 dark:border-purple-800/30 dark:text-purple-200/90 font-medium">
                      "{sug.suggestedUpgrade}"
                    </div>
                  </div>

                  {/* Small explanation of that higher rated word */}
                  {sug.higherRatedWordExplanation && (
                    <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-1.5">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                        <Award className="w-3 h-3" />
                        <span>Why This Word Rates Higher (Examiner Insight):</span>
                      </div>
                      <p className="text-[11px] text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {sug.higherRatedWordExplanation}
                      </p>
                      {sug.higherRatedWords && (
                        <div className="pt-1 space-y-1">
                          {sug.higherRatedWords.map((hw, i) => (
                            <div
                              key={i}
                              className="text-[10px] flex items-baseline gap-1 text-neutral-600 dark:text-neutral-400"
                            >
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
                        type="button"
                        onClick={(e) => handleRevert(sug.originalPhrase, sug.suggestedUpgrade, e)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-black/10 dark:border-white/15 bg-white dark:bg-black text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Revert Word
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleApply(sug, sug.originalPhrase, sug.suggestedUpgrade, e)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        Apply Higher-Rated Word
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
