"use client";

import React, { useEffect } from "react";
import { X, Trash2, ArrowUpRight, Award, FileText, Calendar, Clock } from "lucide-react";
import { SavedEssay } from "@/types/ielts";
import { BandScoreEmoji } from "../BandScoreEmoji";

interface SavedEssaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedEssays: SavedEssay[];
  onLoadEssay: (essay: SavedEssay) => void;
  onDeleteEssay: (id: string) => void;
  isDeletingId?: string | null;
}

export function SavedEssaysModal({
  isOpen,
  onClose,
  savedEssays,
  onLoadEssay,
  onDeleteEssay,
  isDeletingId,
}: SavedEssaysModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getTaskLabel = (type: string) => {
    switch (type) {
      case "task2":
        return "Task 2";
      case "task1_academic":
        return "Task 1 Academic";
      case "task1_general":
        return "Task 1 General";
      default:
        return type;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl flex flex-col w-full max-w-3xl max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Saved Essays
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              {savedEssays.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          {savedEssays.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <FileText className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-700" />
              <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                No saved essays yet
              </div>
              <p className="text-[11px] text-neutral-400 max-w-sm mx-auto leading-relaxed">
                Click the "Save" button in the editor to store your essays along with estimated band scores online on the site.
              </p>
            </div>
          ) : (
            savedEssays.map((essay) => (
              <div
                key={essay.id}
                className="py-4 border-b border-neutral-200 dark:border-neutral-800 space-y-2.5"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {getTaskLabel(essay.taskType)}
                    </span>

                    {/* Band Score or Draft badge */}
                    {typeof essay.overallBand === "number" ? (
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        • Band {essay.overallBand.toFixed(1)}
                        <BandScoreEmoji score={essay.overallBand} size={16} />
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400">
                        • Draft
                      </span>
                    )}

                    <span className="text-xs text-neutral-400">
                      • {essay.wordCount} words
                    </span>
                  </div>

                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(essay.createdAt)}
                  </span>
                </div>

                {/* Prompt preview */}
                <div className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  <span className="font-medium text-neutral-800 dark:text-neutral-200 mr-1">
                    Prompt:
                  </span>
                  {essay.prompt}
                </div>

                {/* Essay preview */}
                <p className="text-xs text-neutral-700 dark:text-neutral-300 line-clamp-3 leading-relaxed font-serif">
                  {essay.essayText}
                </p>

                {/* Criteria breakdown if available */}
                {essay.criteriaScores && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800/60 text-[11px] text-neutral-500">
                    {typeof essay.criteriaScores.taskAchievement === "number" && (
                      <span>TR: {essay.criteriaScores.taskAchievement.toFixed(1)}</span>
                    )}
                    {typeof essay.criteriaScores.coherenceCohesion === "number" && (
                      <span>• CC: {essay.criteriaScores.coherenceCohesion.toFixed(1)}</span>
                    )}
                    {typeof essay.criteriaScores.lexicalResource === "number" && (
                      <span>• LR: {essay.criteriaScores.lexicalResource.toFixed(1)}</span>
                    )}
                    {typeof essay.criteriaScores.grammaticalRange === "number" && (
                      <span>• GRA: {essay.criteriaScores.grammaticalRange.toFixed(1)}</span>
                    )}
                  </div>
                )}

                {/* Actions footer */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => onLoadEssay(essay)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Load into Studio</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  <button
                    type="button"
                    disabled={isDeletingId === essay.id}
                    onClick={() => onDeleteEssay(essay.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete saved essay"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
