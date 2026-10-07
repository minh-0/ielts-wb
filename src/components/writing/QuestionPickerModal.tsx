"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { WritingPrompt } from "@/lib/ieltsPromptBank";
import { Search, Shuffle, Check, X, ChevronDown } from "lucide-react";

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
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const topicDropdownRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (topicDropdownRef.current && !topicDropdownRef.current.contains(e.target as Node)) {
        setIsTopicOpen(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) {
        setIsTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut: Esc to close dropdowns or modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (isTopicOpen) {
          setIsTopicOpen(false);
          return;
        }
        if (isTypeOpen) {
          setIsTypeOpen(false);
          return;
        }
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isTopicOpen, isTypeOpen, onClose]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    prompts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [prompts]);

  const hasEssayTypes = useMemo(() => {
    return prompts.some((p) => Boolean(p.essayType));
  }, [prompts]);

  const essayTypes = [
    "All",
    "opinion",
    "discussion",
    "advantages_disadvantages",
    "problem_solution",
    "double_question",
  ];

  const formatEssayType = (type?: string) => {
    if (!type || type === "All") return "All Formats";
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

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedEssayType("All");
  };

  const hasActiveFilters =
    selectedCategory !== "All" || selectedEssayType !== "All" || searchQuery.trim().length > 0;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl flex flex-col w-full max-w-3xl h-[82vh] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Sleek Minimal Header */}
        <div className="flex items-center gap-2 p-3 sm:px-4 sm:py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 relative z-20 shrink-0">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${prompts.length} questions...`}
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Topic Selection Popout */}
          <div className="relative" ref={topicDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsTopicOpen(!isTopicOpen);
                setIsTypeOpen(false);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory !== "All"
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 shadow-2xs"
                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
              title="Filter by Topic"
            >
              <span className="max-w-[110px] sm:max-w-[140px] truncate text-[11px] sm:text-xs">
                {selectedCategory === "All" ? "Topic" : selectedCategory}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-neutral-400 transition-transform ${
                  isTopicOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Popout Dropdown Menu */}
            {isTopicOpen && (
              <div className="absolute right-0 sm:left-0 sm:right-auto top-full mt-1.5 w-60 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-72 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-100 dark:border-neutral-800/80">
                  Select Topic
                </div>
                {categories.map((cat) => {
                  const count =
                    cat === "All"
                      ? prompts.length
                      : prompts.filter((p) => p.category === cat).length;
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsTopicOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <span
                        className={`truncate ${
                          isSelected ? "font-semibold text-neutral-900 dark:text-neutral-100" : ""
                        }`}
                      >
                        {cat}
                      </span>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="font-mono text-[10px] text-neutral-400">({count})</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Essay Format Popout (only when prompts contain essayType like Task 2) */}
          {hasEssayTypes && (
            <div className="relative" ref={typeDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsTypeOpen(!isTypeOpen);
                  setIsTopicOpen(false);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  selectedEssayType !== "All"
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 shadow-2xs"
                    : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
                title="Filter by Essay Format"
              >
                <span className="max-w-[90px] sm:max-w-[120px] truncate text-[11px] sm:text-xs">
                  {selectedEssayType === "All" ? "Format" : formatEssayType(selectedEssayType)}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-neutral-400 transition-transform ${
                    isTypeOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Popout Format Dropdown Menu */}
              {isTypeOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-100 dark:border-neutral-800/80">
                    Select Format
                  </div>
                  {essayTypes.map((type) => {
                    const isSelected = selectedEssayType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setSelectedEssayType(type);
                          setIsTypeOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <span
                          className={`truncate ${
                            isSelected ? "font-semibold text-neutral-900 dark:text-neutral-100" : ""
                          }`}
                        >
                          {formatEssayType(type)}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Random Quick Picker */}
          <button
            type="button"
            onClick={handlePickRandom}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
            title="Pick a random question from list"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Minimal Active Filter Bar (shown only when filtering) */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between px-4 py-1.5 bg-neutral-50/80 dark:bg-neutral-900/40 border-b border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-500 shrink-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-mono text-neutral-400">Filtering:</span>
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[10px] font-medium">
                  {selectedCategory}
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("All")}
                    className="hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              {selectedEssayType !== "All" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[10px] font-medium">
                  {formatEssayType(selectedEssayType)}
                  <button
                    type="button"
                    onClick={() => setSelectedEssayType("All")}
                    className="hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[10px] font-medium">
                  "{searchQuery}"
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[10px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 underline cursor-pointer shrink-0 ml-2"
            >
              Reset
            </button>
          </div>
        )}

        {/* Minimal Question Scroll List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 bg-neutral-50/20 dark:bg-neutral-900/10">
          {filteredPrompts.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <p className="text-xs text-neutral-400">No questions match your criteria.</p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-neutral-800 dark:text-neutral-200 underline cursor-pointer font-medium"
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
                  className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer group select-none ${
                    isSelected
                      ? "border-neutral-900 bg-neutral-50 dark:border-neutral-100 dark:bg-neutral-900/80 shadow-2xs"
                      : "border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50/60 dark:hover:bg-neutral-900/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {p.imageUrl && (
                      <div className="w-16 h-12 sm:w-20 sm:h-14 shrink-0 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-950 p-1 flex items-center justify-center self-center sm:self-start">
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] text-neutral-400">
                          #{idx + 1}
                        </span>
                        <h4 className="text-xs sm:text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                          {p.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            {p.category}
                          </span>
                          {p.essayType && (
                            <span className="px-1.5 py-0.2 rounded font-mono text-[9px] uppercase tracking-wider bg-purple-500/10 text-purple-700 dark:text-purple-300">
                              {formatEssayType(p.essayType)}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                        {p.prompt}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 mt-0.5">
                        <Check className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
