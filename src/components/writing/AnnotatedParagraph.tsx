"use client";

import React, { useState, useMemo } from "react";
import { SentenceFeedback, VocabularySuggestion, ReplacedWordItem, EffectiveFeature } from "@/types/ielts";
import { AlertCircle, Sparkles, Check, ArrowRight, X, RotateCcw, Award, EyeOff, ThumbsUp } from "lucide-react";

interface AnnotatedParagraphProps {
  content: string;
  errors: SentenceFeedback[];
  suggestions: VocabularySuggestion[];
  effectiveFeatures?: EffectiveFeature[];
  replacedItems?: ReplacedWordItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onApplyFix: (original: string, replacement: string, meta?: any) => void;
  onRevertFix?: (replacedText: string, originalText: string) => void;
  ignoredIds?: string[];
  onIgnore?: (id: string) => void;
}

interface SpanMatch {
  id: string;
  kind: "error" | "suggestion" | "replaced" | "effective";
  start: number;
  end: number;
  original: string;
  replacement: string;
  label: string;
  explanation: string;
  tip?: string;
  subType?: string;
  higherRatedWordExplanation?: string;
  higherRatedWords?: {
    word: string;
    level?: string;
    explanation: string;
  }[];
}

export function AnnotatedParagraph({
  content,
  errors,
  suggestions,
  effectiveFeatures = [],
  replacedItems = [],
  selectedId,
  onSelect,
  onApplyFix,
  onRevertFix,
  ignoredIds = [],
  onIgnore,
}: AnnotatedParagraphProps) {
  const [activeTooltip, setActiveTooltip] = useState<SpanMatch | null>(null);
  const [justAppliedId, setJustAppliedId] = useState<string | null>(null);

  // Compute non-overlapping matches across Replaced Words, Errors, and Suggestions
  const { segments, allMatches } = useMemo(() => {
    const rawMatches: SpanMatch[] = [];

    // 1. First collect directly replaced words in the content
    replacedItems.forEach((rep, idx) => {
      if (!rep.replacedText || !content.includes(rep.replacedText)) return;
      let startIdx = 0;
      while ((startIdx = content.indexOf(rep.replacedText, startIdx)) !== -1) {
        rawMatches.push({
          id: rep.id || `rep-${idx + 1}`,
          kind: "replaced",
          start: startIdx,
          end: startIdx + rep.replacedText.length,
          original: rep.originalText,
          replacement: rep.replacedText,
          label: "Alternative word",
          explanation: rep.higherRatedWordExplanation || "Directly replaced with alternative academic vocabulary.",
          higherRatedWordExplanation: rep.higherRatedWordExplanation,
          higherRatedWords: rep.higherRatedWords,
          subType: "applied_upgrade",
        });
        startIdx += rep.replacedText.length;
        break;
      }
    });

    // 2. Collect error matches (only if not ignored and original is currently present)
    errors.forEach((err, idx) => {
      const errId = err.id || `err-${idx + 1}`;
      if (ignoredIds.includes(errId)) return;
      if (!err.original || !content.includes(err.original)) return;
      let startIdx = 0;
      while ((startIdx = content.indexOf(err.original, startIdx)) !== -1) {
        const cleanRew = err.rewritten.includes("/")
          ? err.rewritten.split("/")[0].trim()
          : err.rewritten;
        rawMatches.push({
          id: errId,
          kind: "error",
          start: startIdx,
          end: startIdx + err.original.length,
          original: err.original,
          replacement: cleanRew,
          label: `${err.issueType.replace("_", " ")} error`,
          explanation: err.explanation,
          tip: err.bandUpgradeTip,
          subType: err.issueType,
          higherRatedWordExplanation: err.higherRatedWordExplanation,
          higherRatedWords: err.higherRatedWords,
        });
        startIdx += err.original.length;
        break;
      }
    });

    // 3. Collect vocabulary suggestions matches (only if not ignored)
    suggestions.forEach((sug, idx) => {
      const sugId = sug.id || `sug-${idx + 1}`;
      if (ignoredIds.includes(sugId)) return;
      if (!sug.originalPhrase || !content.includes(sug.originalPhrase)) return;
      let startIdx = 0;
      while ((startIdx = content.indexOf(sug.originalPhrase, startIdx)) !== -1) {
        const cleanUpg = sug.suggestedUpgrade.includes("/")
          ? sug.suggestedUpgrade.split("/")[0].trim()
          : sug.suggestedUpgrade;
        rawMatches.push({
          id: sugId,
          kind: "suggestion",
          start: startIdx,
          end: startIdx + sug.originalPhrase.length,
          original: sug.originalPhrase,
          replacement: cleanUpg,
          label: `${sug.type.replace("_", " ")} upgrade`,
          explanation: sug.explanation,
          tip: sug.exampleInSentence,
          subType: sug.type,
          higherRatedWordExplanation: sug.higherRatedWordExplanation,
          higherRatedWords: sug.higherRatedWords,
        });
        startIdx += sug.originalPhrase.length;
        break;
      }
    });

    // 4. Collect commendable language / good choices
    effectiveFeatures.forEach((eff, idx) => {
      if (!eff.originalPhrase || !content.includes(eff.originalPhrase)) return;
      let startIdx = 0;
      while ((startIdx = content.indexOf(eff.originalPhrase, startIdx)) !== -1) {
        rawMatches.push({
          id: eff.id || `effective-${idx + 1}`,
          kind: "effective",
          start: startIdx,
          end: startIdx + eff.originalPhrase.length,
          original: eff.originalPhrase,
          replacement: eff.originalPhrase,
          label: eff.label || "Good choice",
          explanation: eff.explanation || "Effective academic language choice.",
          subType: eff.type,
        });
        startIdx += eff.originalPhrase.length;
        break;
      }
    });

    // 5. Sort matches by start position. Prioritize replaced words, errors, suggestions, then effective features
    rawMatches.sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      const rank = { replaced: 0, error: 1, suggestion: 2, effective: 3 };
      if (a.kind !== b.kind) return rank[a.kind] - rank[b.kind];
      return (b.end - b.start) - (a.end - a.start);
    });

    // 6. Eliminate overlapping intervals
    const nonOverlapping: SpanMatch[] = [];
    let lastEnd = 0;
    for (const m of rawMatches) {
      if (m.start >= lastEnd) {
        nonOverlapping.push(m);
        lastEnd = m.end;
      }
    }

    // 7. Partition content into text & span segments
    const segs: Array<{ type: "text"; text: string } | { type: "span"; match: SpanMatch }> = [];
    let cur = 0;
    for (const m of nonOverlapping) {
      if (m.start > cur) {
        segs.push({ type: "text", text: content.slice(cur, m.start) });
      }
      segs.push({ type: "span", match: m });
      cur = m.end;
    }
    if (cur < content.length) {
      segs.push({ type: "text", text: content.slice(cur) });
    }

    return { segments: segs, allMatches: nonOverlapping };
  }, [content, errors, suggestions, effectiveFeatures, replacedItems, ignoredIds]);

  const handleApply = (span: SpanMatch, e: React.MouseEvent) => {
    e.stopPropagation();
    onApplyFix(span.original, span.replacement, {
      id: span.id,
      higherRatedWordExplanation: span.higherRatedWordExplanation,
      higherRatedWords: span.higherRatedWords,
    });
    setJustAppliedId(span.id);
    setActiveTooltip(null);
    setTimeout(() => setJustAppliedId(null), 2500);
  };

  const handleRevert = (span: SpanMatch, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRevertFix) {
      onRevertFix(span.replacement, span.original);
    }
    setActiveTooltip(null);
  };

  const selectedMatch = allMatches.find((m) => m.id === selectedId) || activeTooltip;

  const replacedCount = allMatches.filter((m) => m.kind === "replaced").length;
  const errorCount = allMatches.filter((m) => m.kind === "error").length;
  const suggestionCount = allMatches.filter((m) => m.kind === "suggestion").length;
  const effectiveCount = allMatches.filter((m) => m.kind === "effective").length;

  return (
    <div className="space-y-3">
      {/* 4-Category Visual Legend: Minimal horizontal hairline divider (no box) */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 py-2 border-b border-neutral-200 dark:border-neutral-800 text-xs">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          {/* 1. Red Wavy: Mistakes */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 dark:bg-rose-400/80" />
            <span className="underline decoration-wavy decoration-red-500 dark:decoration-rose-400/50 underline-offset-4 font-medium text-neutral-800 dark:text-neutral-200">
              Grammar mistakes
            </span>
            <span className="text-[11px] text-neutral-400">({errorCount})</span>
          </div>

          {/* 2. Violet Dashed: Upgrades */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-500 dark:bg-purple-400/80" />
            <span className="underline decoration-dashed decoration-violet-500 dark:decoration-purple-400/50 underline-offset-4 font-medium text-neutral-800 dark:text-neutral-200">
              Lexical refinements
            </span>
            <span className="text-[11px] text-neutral-400">({suggestionCount})</span>
          </div>

          {/* 3. Sky Dotted: Effective Phrasing */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 ring-2 ring-sky-500/20" />
            <span className="underline decoration-dotted decoration-sky-500 underline-offset-4 font-medium text-neutral-800 dark:text-neutral-200">
              Effective phrasing
            </span>
            <span className="text-[11px] text-neutral-400">({effectiveCount})</span>
          </div>

          {/* 4. Emerald Solid: Alternative Words */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="underline decoration-solid decoration-emerald-500 underline-offset-4 font-medium text-emerald-800 dark:text-emerald-300">
              Alternative words
            </span>
            <span className="text-[11px] text-neutral-400">({replacedCount})</span>
          </div>
        </div>
      </div>

      {/* Main Annotated Text Container */}
      <div
        data-paragraph="true"
        className="ielts-paragraph ielts-essay-paragraph relative p-6 sm:p-7 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 min-h-[420px] text-[15px] sm:text-base leading-8 text-neutral-900 dark:text-neutral-100 font-sans whitespace-pre-wrap select-text"
      >
        {segments.map((seg, i) => {
          if (seg.type === "text") {
            return <span key={i}>{seg.text}</span>;
          }

          const span = seg.match;
          const isSelected = selectedId === span.id;

          let badgeStyle = "";
          if (span.kind === "replaced") {
            // Emerald solid underline & highlight for alternative words
            badgeStyle = isSelected
              ? "bg-emerald-500/25 dark:bg-emerald-950/50 text-emerald-950 dark:text-neutral-100 underline decoration-solid decoration-emerald-500 dark:decoration-emerald-400/50 underline-offset-4 ring-2 ring-emerald-500 dark:ring-emerald-500/30 border-b-2 border-emerald-500"
              : "bg-emerald-500/15 hover:bg-emerald-500/25 dark:bg-emerald-950/25 dark:hover:bg-emerald-950/40 text-emerald-900 dark:text-neutral-200 underline decoration-solid decoration-emerald-500 dark:decoration-emerald-400/40 underline-offset-4 border-b-2 border-emerald-500";
          } else if (span.kind === "error") {
            // Red wavy underline for errors - softened in dark mode to prevent glare/eye strain
            badgeStyle = isSelected
              ? "bg-red-500/25 dark:bg-rose-950/40 text-red-950 dark:text-neutral-100 underline decoration-wavy decoration-red-500 dark:decoration-rose-400/50 underline-offset-4 ring-2 ring-red-500 dark:ring-rose-500/30"
              : "bg-red-500/10 hover:bg-red-500/20 dark:bg-rose-950/20 dark:hover:bg-rose-950/35 text-red-900 dark:text-neutral-200 underline decoration-wavy decoration-red-500 dark:decoration-rose-400/40 underline-offset-4";
          } else if (span.kind === "effective") {
            // Sky dotted underline for strong choice of words/idiom/grammar
            badgeStyle = isSelected
              ? "bg-sky-500/20 dark:bg-sky-950/40 text-sky-950 dark:text-neutral-100 underline decoration-dotted decoration-sky-500 underline-offset-4 ring-2 ring-sky-500/30"
              : "bg-sky-500/10 hover:bg-sky-500/20 dark:bg-sky-950/20 dark:hover:bg-sky-950/35 text-sky-900 dark:text-neutral-200 underline decoration-dotted decoration-sky-500 underline-offset-4";
          } else {
            // Violet dashed underline for vocabulary suggestions - softened in dark mode
            badgeStyle = isSelected
              ? "bg-violet-500/25 dark:bg-purple-950/40 text-violet-950 dark:text-neutral-100 underline decoration-dashed decoration-violet-500 dark:decoration-purple-400/50 underline-offset-4 ring-2 ring-violet-500 dark:ring-purple-500/30"
              : "bg-violet-500/10 hover:bg-violet-500/20 dark:bg-purple-950/20 dark:hover:bg-purple-950/35 text-violet-900 dark:text-neutral-200 underline decoration-dashed decoration-violet-500 dark:decoration-purple-400/40 underline-offset-4";
          }

          return (
            <mark
              key={span.id}
              onClick={() => {
                onSelect(isSelected ? null : span.id);
                setActiveTooltip(isSelected ? null : span);
              }}
              className={`relative inline cursor-pointer font-medium rounded-xs px-1 py-0.5 transition-all duration-150 ${badgeStyle}`}
              title={`${span.label}: Click for examiner explanation`}
            >
              {span.kind === "replaced" ? span.replacement : span.original}
            </mark>
          );
        })}
      </div>

      {/* Quick Interactive Popover with Examiner Explanation */}
      {selectedMatch && (
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 shadow-md space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold capitalize ${
                  selectedMatch.kind === "effective"
                    ? "text-sky-700 dark:text-sky-300"
                    : selectedMatch.kind === "replaced"
                    ? "text-emerald-700 dark:text-emerald-400"
                    : selectedMatch.kind === "error"
                    ? "text-red-600 dark:text-rose-400"
                    : "text-neutral-900 dark:text-neutral-100"
                }`}
              >
                {selectedMatch.kind === "effective"
                  ? "Good choice"
                  : selectedMatch.kind === "replaced"
                  ? "Alternative word"
                  : selectedMatch.label}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="text-xs text-neutral-500 font-medium">
                {selectedMatch.kind === "effective"
                  ? `${selectedMatch.subType || "language"} strength`
                  : selectedMatch.kind === "replaced"
                  ? "Applied to essay"
                  : selectedMatch.kind === "error"
                  ? "Grammar & accuracy"
                  : "Lexical refinement"}
              </span>
            </div>

            <button
              onClick={() => {
                onSelect(null);
                setActiveTooltip(null);
              }}
              className="text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {selectedMatch.kind === "effective" ? (
            /* Good Choice / Candidate Strength Details */
            <div className="space-y-2 py-1">
              <div className="text-xs">
                <span className="text-xs text-neutral-400 block mb-0.5 font-medium">
                  Highlighted phrase:
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 bg-sky-500/10 dark:bg-sky-950/30 px-1.5 py-0.5 rounded">
                  "{selectedMatch.original}"
                </span>
              </div>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {selectedMatch.explanation}
              </p>
            </div>
          ) : (
            <>
              {/* Before & After Words Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs py-2 border-y border-neutral-200 dark:border-neutral-800">
                <div>
                  <span className="text-xs text-neutral-400 block mb-0.5 font-medium">
                    Original draft:
                  </span>
                  <span className="line-through text-neutral-500">{selectedMatch.original}</span>
                </div>
                <div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 block mb-0.5 font-medium">
                    Alternative word:
                  </span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">{selectedMatch.replacement}</span>
                </div>
              </div>

              {/* Explanation of Alternative Word */}
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Examiner rationale:</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {selectedMatch.higherRatedWordExplanation ||
                    selectedMatch.explanation ||
                    "Replaces common conversational vocabulary with formal academic phrasing favored under IELTS Band 8.0+ descriptors."}
                </p>

                {/* Micro Word-Level Breakdown if available */}
                {selectedMatch.higherRatedWords && selectedMatch.higherRatedWords.length > 0 && (
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
                    {selectedMatch.higherRatedWords.map((hw, i) => (
                      <div key={i} className="text-xs flex flex-wrap items-baseline gap-1.5">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                          {hw.word}
                        </span>
                        {hw.level && (
                          <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                            {hw.level}
                          </span>
                        )}
                        <span className="text-neutral-600 dark:text-neutral-400">
                          — {hw.explanation}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            {selectedMatch.tip ? (
              <span className="text-[11px] text-neutral-500 italic max-w-sm truncate hidden sm:inline">
                💡 {selectedMatch.tip}
              </span>
            ) : <span />}

            {selectedMatch.kind === "effective" ? (
              <button
                type="button"
                onClick={() => {
                  onSelect(null);
                  setActiveTooltip(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            ) : selectedMatch.kind === "replaced" ? (
              <button
                onClick={(e) => handleRevert(selectedMatch, e)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-black/15 dark:border-white/20 bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Revert to Original Draft
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {onIgnore && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onIgnore(selectedMatch.id);
                      setActiveTooltip(null);
                      onSelect(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                    title="Ignore this suggestion"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Ignore</span>
                  </button>
                )}
                <button
                  onClick={(e) => handleApply(selectedMatch, e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  {justAppliedId === selectedMatch.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Applied!
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-3.5 h-3.5" />
                      Apply
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
