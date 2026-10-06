"use client";

import React, { useState, useMemo } from "react";
import { SentenceFeedback, VocabularySuggestion } from "@/types/ielts";
import { AlertCircle, Sparkles, Check, ArrowRight, X } from "lucide-react";

interface AnnotatedParagraphProps {
  content: string;
  errors: SentenceFeedback[];
  suggestions: VocabularySuggestion[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onApplyFix: (original: string, replacement: string) => void;
}

interface SpanMatch {
  id: string;
  kind: "error" | "suggestion";
  start: number;
  end: number;
  original: string;
  replacement: string;
  label: string;
  explanation: string;
  tip?: string;
  subType?: string;
}

export function AnnotatedParagraph({
  content,
  errors,
  suggestions,
  selectedId,
  onSelect,
  onApplyFix,
}: AnnotatedParagraphProps) {
  const [activeTooltip, setActiveTooltip] = useState<SpanMatch | null>(null);
  const [justAppliedId, setJustAppliedId] = useState<string | null>(null);

  // Compute non-overlapping matches
  const { segments, allMatches } = useMemo(() => {
    const rawMatches: SpanMatch[] = [];

    // 1. Collect error matches
    errors.forEach((err, idx) => {
      if (!err.original || !content.includes(err.original)) return;
      let startIdx = 0;
      while ((startIdx = content.indexOf(err.original, startIdx)) !== -1) {
        rawMatches.push({
          id: err.id || `err-${idx + 1}`,
          kind: "error",
          start: startIdx,
          end: startIdx + err.original.length,
          original: err.original,
          replacement: err.rewritten,
          label: `${err.issueType.replace("_", " ").toUpperCase()} ERROR`,
          explanation: err.explanation,
          tip: err.bandUpgradeTip,
          subType: err.issueType,
        });
        startIdx += err.original.length;
        break; // target first occurrence for stability
      }
    });

    // 2. Collect vocabulary suggestions matches
    suggestions.forEach((sug, idx) => {
      if (!sug.originalPhrase || !content.includes(sug.originalPhrase)) return;
      let startIdx = 0;
      while ((startIdx = content.indexOf(sug.originalPhrase, startIdx)) !== -1) {
        rawMatches.push({
          id: sug.id || `sug-${idx + 1}`,
          kind: "suggestion",
          start: startIdx,
          end: startIdx + sug.originalPhrase.length,
          original: sug.originalPhrase,
          replacement: sug.suggestedUpgrade,
          label: `${sug.type.replace("_", " ").toUpperCase()} UPGRADE`,
          explanation: sug.explanation,
          tip: sug.exampleInSentence,
          subType: sug.type,
        });
        startIdx += sug.originalPhrase.length;
        break;
      }
    });

    // 3. Sort matches by start position. Prioritize longer intervals or errors if starting at same point
    rawMatches.sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      if (a.kind !== b.kind) return a.kind === "error" ? -1 : 1;
      return (b.end - b.start) - (a.end - a.start);
    });

    // 4. Eliminate overlapping intervals
    const nonOverlapping: SpanMatch[] = [];
    let lastEnd = 0;
    for (const m of rawMatches) {
      if (m.start >= lastEnd) {
        nonOverlapping.push(m);
        lastEnd = m.end;
      }
    }

    // 5. Partition content into text & span segments
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
  }, [content, errors, suggestions]);

  const handleApply = (span: SpanMatch, e: React.MouseEvent) => {
    e.stopPropagation();
    onApplyFix(span.original, span.replacement);
    setJustAppliedId(span.id);
    setActiveTooltip(null);
    setTimeout(() => setJustAppliedId(null), 2500);
  };

  const selectedMatch = allMatches.find((m) => m.id === selectedId) || activeTooltip;

  return (
    <div className="space-y-3">
      {/* Visual Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-500/20" />
            <span className="underline decoration-wavy decoration-red-500 underline-offset-4 font-medium text-neutral-800 dark:text-neutral-200">
              Mistakes & Grammar
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">({errors.length})</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 ring-2 ring-violet-500/20" />
            <span className="underline decoration-dashed decoration-violet-500 underline-offset-4 font-medium text-neutral-800 dark:text-neutral-200">
              Vocabulary & Idioms
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">({suggestions.length})</span>
          </div>
        </div>

        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 hidden sm:inline">
          Click any underlined phrase to inspect
        </span>
      </div>

      {/* Main Annotated Text Container */}
      <div className="relative p-5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-black min-h-[340px] text-sm leading-relaxed text-neutral-900 dark:text-neutral-100 font-sans whitespace-pre-wrap select-text">
        {segments.map((seg, i) => {
          if (seg.type === "text") {
            return <span key={i}>{seg.text}</span>;
          }

          const span = seg.match;
          const isSelected = selectedId === span.id;
          const isError = span.kind === "error";

          return (
            <mark
              key={span.id}
              onClick={() => {
                onSelect(isSelected ? null : span.id);
                setActiveTooltip(isSelected ? null : span);
              }}
              className={`relative inline cursor-pointer font-medium rounded-xs px-0.5 py-0.5 transition-all duration-150 ${
                isError
                  ? isSelected
                    ? "bg-red-500/25 text-red-950 dark:text-red-100 underline decoration-wavy decoration-red-500 underline-offset-4 ring-2 ring-red-500"
                    : "bg-red-500/10 hover:bg-red-500/20 text-red-900 dark:text-red-200 underline decoration-wavy decoration-red-500 underline-offset-4"
                  : isSelected
                  ? "bg-violet-500/25 text-violet-950 dark:text-violet-100 underline decoration-dashed decoration-violet-500 underline-offset-4 ring-2 ring-violet-500"
                  : "bg-violet-500/10 hover:bg-violet-500/20 text-violet-900 dark:text-violet-200 underline decoration-dashed decoration-violet-500 underline-offset-4"
              }`}
              title={`${span.label}: Click to inspect`}
            >
              {seg.match.original}
            </mark>
          );
        })}
      </div>

      {/* Quick Interactive Popover when a span is active */}
      {selectedMatch && (
        <div className="p-4 rounded-xl border border-black/10 dark:border-white/20 bg-neutral-50 dark:bg-neutral-950 shadow-md space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                  selectedMatch.kind === "error"
                    ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30"
                    : "bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/30"
                }`}
              >
                {selectedMatch.label}
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                {selectedMatch.kind === "error" ? "Direct Mistake" : "Band 8+ Upgrade"}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
              <span className="font-mono text-[10px] text-neutral-400 block mb-0.5">ORIGINAL:</span>
              <span className="line-through text-neutral-500">{selectedMatch.original}</span>
            </div>
            <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200">
              <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 block mb-0.5">
                EXAMINER RECOMMENDATION:
              </span>
              <span className="font-semibold">{selectedMatch.replacement}</span>
            </div>
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {selectedMatch.explanation}
          </p>

          <div className="flex items-center justify-between pt-1">
            {selectedMatch.tip ? (
              <span className="text-[11px] text-neutral-500 italic max-w-sm truncate">
                💡 {selectedMatch.tip}
              </span>
            ) : <span />}

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
                  Apply Fix to Essay
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
