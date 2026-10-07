"use client";

import React, { useState, useMemo, useEffect } from "react";
import { WritingPrompt } from "@/lib/ieltsPromptBank";
import { Search, Shuffle, Check, X, Sparkles, BookOpen } from "lucide-react";

interface QuestionPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: WritingPrompt[];
  selectedPromptId: string;
  onSelectPrompt: (prompt: WritingPrompt) => void;
}

export function QuestionPickerModal({
  isOpen,
  onClose,
  prompts,
  selectedPromptId,
  onSelectPrompt,
}: QuestionPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedEssayType, setSelectedEssayType] = useState<string>("All");

  // Keyboard shortcut: Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    prompts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [prompts]);

  const essayTypes = ["All", "opinion", "discussion", "advantages_disadvantages", "problem_solution", "double_question"];

  const formatEssayType = (type?: string) => {
    if (!type || type === "All") return "All Types";
    if (type === "opinion") return "Agree / Disagree";
    if (type === "discussion") return "Discuss Both Views";
    if (type === "advantages_disadvantages") return "Advantages & Disadv.";
    if (type === "problem_solution") return "Problem & Solution";
    if (type === "double_question") return "Two-Part Question";
    return type;
  };

  // Filtered prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
      if (selectedEssayType !== "All" && p.essayType !== selectedEssayType) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesPrompt = p.prompt.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesPrompt && !matchesCategory) return false;
      }
      return true;
    });
  }, [prompts, selectedCategory, selectedEssayType, searchQuery]);

  const handlePickRandom = () => {
    if (filteredPrompts.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredPrompts.length);
    const randomPrompt = filteredPrompts[randomIndex];
    onSelectPrompt(randomPrompt);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl flex flex-col w-full h-[90vh] max-w-4xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-neutral-500" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                IELTS Essay Question Bank
              </h3>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium">
                {prompts.length} Verified Topics
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Select any essay topic. Every prompt includes an official Band 9.0 model essay.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePickRandom}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer shadow-xs transition-colors"
              title="Pick a random question"
            >
              <Shuffle className="w-3.5 h-3.5 text-neutral-500" />
              <span>Random</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3 shrink-0">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword, or prompt text..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
            />
          </div>

          {/* Category Filter Pills (Scrollable horizontally) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-thin">
            <span className="text-neutral-400 text-[10px] uppercase font-mono shrink-0 mr-1">
              Topic:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer font-medium ${
                  selectedCategory === cat
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs"
                    : "bg-neutral-100/70 dark:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 border border-neutral-200/60 dark:border-neutral-800/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Essay Type Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] scrollbar-thin">
            <span className="text-neutral-400 text-[10px] uppercase font-mono shrink-0 mr-1">
              Format:
            </span>
            {essayTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedEssayType(type)}
                className={`px-2.5 py-0.5 rounded-md shrink-0 transition-colors cursor-pointer text-[10px] ${
                  selectedEssayType === type
                    ? "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900 font-medium"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`}
              >
                {formatEssayType(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Scroll List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-neutral-50/30 dark:bg-neutral-900/10">
          <div className="text-[11px] font-mono text-neutral-400 pb-1">
            Showing {filteredPrompts.length} of {prompts.length} questions
          </div>

          {filteredPrompts.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="text-xs text-neutral-400">No questions found matching your filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedEssayType("All");
                }}
                className="text-xs text-neutral-700 dark:text-neutral-300 underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredPrompts.map((p, idx) => {
              const isSelected = p.id === selectedPromptId;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectPrompt(p);
                    onClose();
                  }}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer group select-none ${
                    isSelected
                      ? "border-neutral-900 bg-white dark:border-neutral-100 dark:bg-neutral-900/90 ring-1 ring-neutral-900/20 dark:ring-neutral-100/20 shadow-xs"
                      : "border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium">
                          #{idx + 1}
                        </span>
                        <span className="px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium">
                          {p.category}
                        </span>
                        {p.essayType && (
                          <span className="px-1.5 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider bg-violet-500/10 text-violet-700 dark:text-purple-300 border border-violet-500/20 font-medium">
                            {formatEssayType(p.essayType)}
                          </span>
                        )}
                        {p.modelEssay && (
                          <span className="px-1.5 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            Band 9.0 Model
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                        {p.title}
                      </h4>

                      {/* Prompt */}
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                        {p.prompt}
                      </p>
                    </div>

                    {/* Action badge */}
                    <div className="shrink-0 pt-1">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-800 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 group-hover:border-neutral-300 dark:group-hover:border-neutral-700 transition-colors">
                          Select
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 flex items-center justify-between text-xs shrink-0">
          <span className="text-neutral-400 text-[11px]">
            Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-[10px]">Esc</kbd> to exit
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
