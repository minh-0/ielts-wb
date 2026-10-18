"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  COLLOCATIONS_DATASET,
  COLLOCATIONS_QUIZ_QUESTIONS,
  CollocationItem,
  CollocationLevel,
  CollocationTopic,
  CollocationType,
  COLLOCATION_TOPIC_LABELS,
  COLLOCATION_TYPE_LABELS,
} from "@/lib/collocationsData";
import {
  Search,
  Volume2,
  Star,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Shuffle,
  RotateCw,
  BookOpen,
  Award,
  AlertCircle,
  Sparkles,
  ExternalLink,
  HelpCircle,
} from "lucide-react";
import { FlipCard3D, ParticleButton } from "@/components/kokonutui";
import { cn } from "@/lib/utils";

export function CollocationsStudio() {
  // Navigation modes: Explorer | Cards | Practice
  const [activeMode, setActiveMode] = useState<"explorer" | "flashcards" | "quiz">("explorer");

  // Filters
  const [selectedLevel, setSelectedLevel] = useState<CollocationLevel | "ALL">("ALL");
  const [selectedTopic, setSelectedTopic] = useState<CollocationTopic | "ALL">("ALL");
  const [selectedType, setSelectedType] = useState<CollocationType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "starred" | "mastered">("all");

  // Topic Popout State
  const [isTopicPopoutOpen, setIsTopicPopoutOpen] = useState<boolean>(false);
  const topicDropdownRef = useRef<HTMLDivElement>(null);

  // Local storage state
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  // Flashcards state
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);

  // Inspector / Detail Modal
  const [inspectedItem, setInspectedItem] = useState<CollocationItem | null>(null);

  // Quiz state
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [completedQuiz, setCompletedQuiz] = useState<boolean>(false);

  // Pagination for Explorer
  const [explorerPage, setExplorerPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 15;

  // Load persistence
  useEffect(() => {
    try {
      const savedStarred = localStorage.getItem("cambridge_collocations_starred");
      if (savedStarred) setStarredIds(new Set(JSON.parse(savedStarred)));

      const savedMastered = localStorage.getItem("cambridge_collocations_mastered");
      if (savedMastered) setMasteredIds(new Set(JSON.parse(savedMastered)));
    } catch {}
  }, []);

  // Click outside to close topic popout
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (topicDropdownRef.current && !topicDropdownRef.current.contains(event.target as Node)) {
        setIsTopicPopoutOpen(false);
      }
    }
    if (isTopicPopoutOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTopicPopoutOpen]);

  // Topic item counts dynamically filtered by selected level
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: 0 };
    for (const item of COLLOCATIONS_DATASET) {
      if (selectedLevel === "ALL" || item.level === selectedLevel) {
        counts.ALL = (counts.ALL || 0) + 1;
        counts[item.topic] = (counts[item.topic] || 0) + 1;
      }
    }
    return counts;
  }, [selectedLevel]);

  const toggleStar = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem("cambridge_collocations_starred", JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }, []);

  const toggleMaster = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem("cambridge_collocations_mastered", JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }, []);

  const playAudio = useCallback((phrase: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = "en-GB";
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Filtered dataset
  const filteredCollocations = useMemo(() => {
    return COLLOCATIONS_DATASET.filter((item) => {
      if (selectedLevel !== "ALL" && item.level !== selectedLevel) return false;
      if (selectedTopic !== "ALL" && item.topic !== selectedTopic) return false;
      if (selectedType !== "ALL" && item.type !== selectedType) return false;
      if (statusFilter === "starred" && !starredIds.has(item.id)) return false;
      if (statusFilter === "mastered" && !masteredIds.has(item.id)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesPhrase = item.collocation.toLowerCase().includes(q);
        const matchesDef = item.definition.toLowerCase().includes(q);
        const matchesUnit = item.unit.toLowerCase().includes(q);
        const matchesExample = item.example.toLowerCase().includes(q);
        if (!matchesPhrase && !matchesDef && !matchesUnit && !matchesExample) return false;
      }

      return true;
    });
  }, [selectedLevel, selectedTopic, selectedType, statusFilter, searchQuery, starredIds, masteredIds]);

  // Flashcards active pool
  const flashcardPool = useMemo(() => {
    if (!isShuffled) return filteredCollocations;
    const arr = [...filteredCollocations];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [filteredCollocations, isShuffled]);

  // Reset pagination & card index on filter changes
  useEffect(() => {
    setExplorerPage(1);
    setCardIndex(0);
    setIsFlipped(false);
  }, [selectedLevel, selectedTopic, selectedType, statusFilter, searchQuery]);

  const currentCard = flashcardPool[cardIndex] || null;

  const handleNextCard = () => {
    if (flashcardPool.length === 0) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % flashcardPool.length);
  };

  const handlePrevCard = () => {
    if (flashcardPool.length === 0) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + flashcardPool.length) % flashcardPool.length);
  };

  const paginatedItems = useMemo(() => {
    const start = (explorerPage - 1) * ITEMS_PER_PAGE;
    return filteredCollocations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCollocations, explorerPage]);

  const totalPages = Math.ceil(filteredCollocations.length / ITEMS_PER_PAGE) || 1;

  // Quiz calculations
  const filteredQuizQuestions = useMemo(() => {
    if (selectedLevel === "ALL") return COLLOCATIONS_QUIZ_QUESTIONS;
    return COLLOCATIONS_QUIZ_QUESTIONS.filter((q) => q.level === selectedLevel);
  }, [selectedLevel]);

  const currentQuizQuestion = filteredQuizQuestions[quizQuestionIndex] || null;

  const handleSelectQuizAnswer = (idx: number) => {
    if (hasAnswered) return;
    setSelectedAnswerIndex(idx);
    setHasAnswered(true);
    if (currentQuizQuestion && idx === currentQuizQuestion.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizQuestionIndex + 1 < filteredQuizQuestions.length) {
      setQuizQuestionIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setHasAnswered(false);
    } else {
      setCompletedQuiz(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setHasAnswered(false);
    setQuizScore(0);
    setCompletedQuiz(false);
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Editorial Header - Cambridge In Use Reference */}
      <div className="space-y-2 pb-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Cambridge University Press • Michael McCarthy & Felicity O&apos;Dell
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-neutral-950 dark:text-neutral-50">
              English Collocations in Use
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              Master natural word partnerships directly from the official Cambridge Intermediate & Advanced
              reference books. Essential for overcoming Band 6.5 lexical plateaus and achieving Band 8.0+ in IELTS writing.
            </p>
          </div>

          {/* Minimalist Stats Summary (Quiet numbers, no boxes) */}
          <div className="flex items-center gap-5 text-xs text-neutral-500 dark:text-neutral-400 pt-1 md:pt-0">
            <div>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 mr-1.5">
                {COLLOCATIONS_DATASET.length}
              </span>
              <span>Collocations</span>
            </div>
            <div className="h-3 w-px bg-neutral-200 dark:bg-neutral-800" />
            <div>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 mr-1.5">
                {starredIds.size}
              </span>
              <span>Starred</span>
            </div>
            <div className="h-3 w-px bg-neutral-200 dark:bg-neutral-800" />
            <div>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 mr-1.5">
                {masteredIds.size}
              </span>
              <span>Mastered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Navigation Bar: Minimalist Tabs & Clean Controls (No lines) */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
          {/* Modes: Clean text tabs without underline lines */}
          <div className="flex items-center gap-6 text-xs">
            <button
              onClick={() => setActiveMode("explorer")}
              className={`py-1.5 transition-colors cursor-pointer ${
                activeMode === "explorer"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 font-medium"
              }`}
            >
              Explorer ({filteredCollocations.length})
            </button>
            <button
              onClick={() => setActiveMode("flashcards")}
              className={`py-1.5 transition-colors cursor-pointer ${
                activeMode === "flashcards"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 font-medium"
              }`}
            >
              Study Cards
            </button>
            <button
              onClick={() => setActiveMode("quiz")}
              className={`py-1.5 transition-colors cursor-pointer ${
                activeMode === "quiz"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 font-medium"
              }`}
            >
              Cambridge Practice Test
            </button>
          </div>

          {/* Right Filters: Level Buttons + Search + Starred */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
            {/* Book Level Filter (Sentence case, no small caps) */}
            <div className="flex items-center gap-1 border-r border-neutral-200 dark:border-neutral-800 pr-3">
              {(["ALL", "Intermediate", "Advanced"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                    selectedLevel === lvl
                      ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black font-medium"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  }`}
                >
                  {lvl === "ALL" ? "All Levels" : lvl}
                </button>
              ))}
            </div>

            {/* Topic Popout Selector */}
            <div className="relative" ref={topicDropdownRef}>
              <button
                onClick={() => setIsTopicPopoutOpen((prev) => !prev)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer select-none",
                  selectedTopic !== "ALL"
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950 font-medium"
                    : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600"
                )}
                title="Filter Collocations by Topic"
              >
                <span className={cn(
                  "text-[11px]",
                  selectedTopic !== "ALL" ? "opacity-70" : "text-neutral-400 dark:text-neutral-500"
                )}>
                  Topic:
                </span>
                <span className="max-w-[130px] sm:max-w-[160px] truncate">
                  {selectedTopic === "ALL" ? "All Topics" : COLLOCATION_TOPIC_LABELS[selectedTopic]}
                </span>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 transition-transform duration-200",
                    selectedTopic !== "ALL" ? "opacity-70" : "text-neutral-400",
                    isTopicPopoutOpen && "rotate-180"
                  )}
                />
              </button>

              {isTopicPopoutOpen && (
                <div className="absolute left-0 sm:right-0 sm:left-auto mt-1.5 w-72 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xl z-50 p-1.5 space-y-0.5">
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 mb-1 flex items-center justify-between">
                    <span>Filter by Topic</span>
                    {selectedTopic !== "ALL" && (
                      <button
                        onClick={() => {
                          setSelectedTopic("ALL");
                          setIsTopicPopoutOpen(false);
                        }}
                        className="text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer font-normal"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* All Topics Option */}
                  <button
                    onClick={() => {
                      setSelectedTopic("ALL");
                      setIsTopicPopoutOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors text-left cursor-pointer",
                      selectedTopic === "ALL"
                        ? "bg-neutral-100 dark:bg-neutral-900 font-semibold text-neutral-950 dark:text-neutral-50"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
                    )}
                  >
                    <span>All Topics</span>
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                      <span>{topicCounts.ALL || 0}</span>
                      {selectedTopic === "ALL" && (
                        <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100" />
                      )}
                    </div>
                  </button>

                  {/* Each Topic Option */}
                  {(Object.keys(COLLOCATION_TOPIC_LABELS) as CollocationTopic[]).map((topicKey) => {
                    const isSelected = selectedTopic === topicKey;
                    const count = topicCounts[topicKey] || 0;
                    return (
                      <button
                        key={topicKey}
                        onClick={() => {
                          setSelectedTopic(topicKey);
                          setIsTopicPopoutOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors text-left cursor-pointer",
                          isSelected
                            ? "bg-neutral-100 dark:bg-neutral-900 font-semibold text-neutral-950 dark:text-neutral-50"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
                        )}
                      >
                        <span className="truncate pr-2">{COLLOCATION_TOPIC_LABELS[topicKey]}</span>
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 shrink-0">
                          <span>{count}</span>
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

            {/* Quick Starred & Mastered filters */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setStatusFilter(statusFilter === "starred" ? "all" : "starred")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  statusFilter === "starred"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "text-neutral-400 hover:text-amber-500"
                }`}
                title="Filter Starred"
              >
                <Star className={`w-3.5 h-3.5 ${statusFilter === "starred" ? "fill-amber-400 text-amber-400" : ""}`} />
              </button>

              <button
                onClick={() => setStatusFilter(statusFilter === "mastered" ? "all" : "mastered")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  statusFilter === "mastered"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "text-neutral-400 hover:text-emerald-500"
                }`}
                title="Filter Mastered"
              >
                <Check className={`w-3.5 h-3.5 ${statusFilter === "mastered" ? "text-emerald-500" : ""}`} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collocations..."
                className="pl-7 pr-6 py-1 w-36 sm:w-52 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: EXPLORER (Editorial Hairline Table)                               */}
      {/* ========================================================================= */}
      {activeMode === "explorer" && (
        <div className="space-y-4">
          {filteredCollocations.length === 0 ? (
            <div className="py-16 text-center text-xs text-neutral-400 dark:text-neutral-500">
              No collocations found matching the current filters.
            </div>
          ) : (
            <div className="space-y-1">
              {paginatedItems.map((item) => {
                const isStarred = starredIds.has(item.id);
                const isMastered = masteredIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => setInspectedItem(item)}
                    className="py-3 px-3.5 rounded-xl hover:bg-neutral-100/70 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    {/* Left: Collocation, Type & Citation */}
                    <div className="md:w-1/3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => playAudio(item.collocation, e)}
                          className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors p-0.5 cursor-pointer"
                          title="Listen to pronunciation (en-GB)"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>

                        <h3 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 tracking-tight">
                          {item.collocation}
                        </h3>

                        {isMastered && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                            ✓ Mastered
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <span>{item.typeLabel}</span>
                        <span>•</span>
                        <span>{item.level}</span>
                        <span>•</span>
                        <span className="truncate" title={item.unit}>
                          {item.unit}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Meaning & Authentic IELTS Example */}
                    <div className="md:w-5/12 space-y-1 text-xs">
                      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {item.definition}
                      </p>
                      <p className="text-neutral-500 dark:text-neutral-400 italic leading-relaxed">
                        &ldquo;{item.example}&rdquo;
                      </p>
                    </div>

                    {/* Right: Mistake Alert & Band Impact */}
                    <div className="md:w-1/4 flex flex-col justify-between items-start md:items-end gap-2 text-xs">
                      <div className="text-neutral-600 dark:text-neutral-400 md:text-right text-[11px]">
                        {item.commonMistake}
                      </div>

                      <div className="flex items-center gap-2 mt-auto">
                        <span className="text-xs font-serif font-medium text-neutral-900 dark:text-neutral-100">
                          {item.bandImpact}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => toggleStar(item.id, e)}
                            className={`p-1 transition-colors cursor-pointer ${
                              isStarred
                                ? "text-amber-500"
                                : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                            }`}
                            title={isStarred ? "Unstar" : "Star for revision"}
                          >
                            <Star className={`w-3.5 h-3.5 ${isStarred ? "fill-amber-400" : ""}`} />
                          </button>

                          <button
                            onClick={(e) => toggleMaster(item.id, e)}
                            className={`p-1 transition-colors cursor-pointer ${
                              isMastered
                                ? "text-emerald-500"
                                : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                            }`}
                            title={isMastered ? "Mark unmastered" : "Mark mastered"}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pt-2">
              <div>
                Showing {(explorerPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(explorerPage * ITEMS_PER_PAGE, filteredCollocations.length)} of{" "}
                {filteredCollocations.length}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExplorerPage((prev) => Math.max(prev - 1, 1))}
                  disabled={explorerPage === 1}
                  className="px-2.5 py-1 text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-neutral-400">
                  {explorerPage} / {totalPages}
                </span>
                <button
                  onClick={() => setExplorerPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={explorerPage === totalPages}
                  className="px-2.5 py-1 text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: FLASHCARDS (Refined Minimalist Card)                              */}
      {/* ========================================================================= */}
      {activeMode === "flashcards" && (
        <div className="max-w-2xl mx-auto space-y-6">
          {flashcardPool.length === 0 ? (
            <div className="py-16 text-center text-xs text-neutral-400">
              No collocations in the active pool. Adjust your filter selections.
            </div>
          ) : currentCard ? (
            <div className="space-y-4">
              {/* Card Meta & Controls Bar */}
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <span>
                    Card {cardIndex + 1} of {flashcardPool.length}
                  </span>
                  <span>•</span>
                  <span>{currentCard.sourceBook}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsShuffled(!isShuffled)}
                    className={`flex items-center gap-1 transition-colors cursor-pointer ${
                      isShuffled ? "text-neutral-900 dark:text-neutral-100 font-medium" : "text-neutral-400"
                    }`}
                    title="Toggle Shuffle"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Shuffle</span>
                  </button>

                  <button
                    onClick={(e) => toggleStar(currentCard.id, e)}
                    className={`cursor-pointer ${
                      starredIds.has(currentCard.id) ? "text-amber-500" : "text-neutral-400"
                    }`}
                    title="Star card"
                  >
                    <Star className={`w-3.5 h-3.5 ${starredIds.has(currentCard.id) ? "fill-amber-400" : ""}`} />
                  </button>
                </div>
              </div>

              {/* 3D KokonutUI Study Card */}
              <FlipCard3D
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
                minHeight="min-h-[290px]"
                front={
                  <>
                    {/* Top Badge Row */}
                    <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500">
                      <span>{currentCard.unit}</span>
                      <span className="font-serif">{currentCard.bandImpact}</span>
                    </div>

                    {/* Center Content */}
                    <div className="my-auto text-center space-y-3 py-4">
                      <div className="flex items-center justify-center gap-2.5">
                        <h2 className="text-2xl sm:text-3xl font-serif text-neutral-950 dark:text-neutral-50 tracking-tight">
                          {currentCard.collocation}
                        </h2>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudio(currentCard.collocation, e);
                          }}
                          className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors p-1 cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {currentCard.typeLabel} • {currentCard.topicLabel}
                      </div>

                      <div className="pt-2 text-[11px] text-neutral-400 dark:text-neutral-500">
                        Click or press space to reveal definition & IELTS context
                      </div>
                    </div>

                    {/* Bottom Card Footer */}
                    <div className="flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="text-[11px]">Tap to flip</span>
                      <ParticleButton
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMaster(currentCard.id, e);
                        }}
                        className={`flex items-center gap-1 transition-colors px-2 py-0.5 rounded ${
                          masteredIds.has(currentCard.id)
                            ? "text-emerald-600 dark:text-emerald-400 font-medium"
                            : "text-neutral-400 hover:text-emerald-600"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>{masteredIds.has(currentCard.id) ? "Mastered" : "Mark Mastered"}</span>
                      </ParticleButton>
                    </div>
                  </>
                }
                back={
                  <>
                    {/* Top Badge Row */}
                    <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500">
                      <span>{currentCard.unit}</span>
                      <span className="font-serif">{currentCard.bandImpact}</span>
                    </div>

                    {/* Back Center Content */}
                    <div className="my-auto text-left space-y-3 py-2">
                      <div>
                        <div className="text-xs text-neutral-400 mb-0.5">Meaning:</div>
                        <p className="text-sm text-neutral-900 dark:text-neutral-100 leading-relaxed font-medium">
                          {currentCard.definition}
                        </p>
                      </div>

                      <div>
                        <div className="text-xs text-neutral-400 mb-0.5">IELTS Exam Example:</div>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 italic leading-relaxed">
                          &ldquo;{currentCard.example}&rdquo;
                        </p>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {currentCard.commonMistake}
                        </div>
                        {currentCard.ieltsTip && (
                          <div className="text-neutral-500 text-[11px]">
                            {currentCard.ieltsTip}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Card Footer */}
                    <div className="flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="text-[11px]">Showing answers & advice</span>
                      <ParticleButton
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMaster(currentCard.id, e);
                        }}
                        className={`flex items-center gap-1 transition-colors px-2 py-0.5 rounded ${
                          masteredIds.has(currentCard.id)
                            ? "text-emerald-600 dark:text-emerald-400 font-medium"
                            : "text-neutral-400 hover:text-emerald-600"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>{masteredIds.has(currentCard.id) ? "Mastered" : "Mark Mastered"}</span>
                      </ParticleButton>
                    </div>
                  </>
                }
              />

              {/* Navigation Controls */}
              <div className="flex items-center justify-center gap-4 pt-1">
                <button
                  onClick={handlePrevCard}
                  className="px-4 py-1.5 text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-4 py-1.5 text-xs border border-neutral-200 dark:border-neutral-800 rounded-md text-neutral-800 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCw className="w-3 h-3 text-neutral-400" />
                  <span>Flip Card</span>
                </button>

                <button
                  onClick={handleNextCard}
                  className="px-4 py-1.5 text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: CAMBRIDGE PRACTICE TEST                                           */}
      {/* ========================================================================= */}
      {activeMode === "quiz" && (
        <div className="max-w-2xl mx-auto space-y-6">
          {!completedQuiz && currentQuizQuestion ? (
            <div className="space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    Question {quizQuestionIndex + 1} of {filteredQuizQuestions.length}
                  </span>
                  <span>•</span>
                  <span>{currentQuizQuestion.sourceUnit}</span>
                </div>

                <div>
                  Score: <span className="font-semibold text-neutral-900 dark:text-neutral-100">{quizScore}</span>
                </div>
              </div>

              {/* Prompt with blank */}
              <div className="space-y-3 py-2">
                <div className="text-xs text-neutral-400">Choose the natural collocation to fill the gap:</div>
                <blockquote className="text-base sm:text-lg font-serif text-neutral-900 dark:text-neutral-100 leading-relaxed pl-3 border-l-2 border-neutral-300 dark:border-neutral-700">
                  {currentQuizQuestion.sentencePrompt}
                </blockquote>
              </div>

              {/* Multiple Choice Options (Clean lines, not heavy boxes) */}
              <div className="space-y-2 pt-2">
                {currentQuizQuestion.options.map((opt, idx) => {
                  let stateStyle =
                    "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-800 dark:text-neutral-200";

                  if (hasAnswered) {
                    if (idx === currentQuizQuestion.correctIndex) {
                      stateStyle = "border-emerald-500 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300 font-medium";
                    } else if (idx === selectedAnswerIndex) {
                      stateStyle = "border-rose-500 bg-rose-500/5 text-rose-800 dark:text-rose-300";
                    } else {
                      stateStyle = "opacity-40 border-neutral-200 dark:border-neutral-800";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectQuizAnswer(idx)}
                      className={`w-full text-left px-4 py-3 border rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${stateStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-400 text-[11px]">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span>{opt}</span>
                      </div>

                      {hasAnswered && idx === currentQuizQuestion.correctIndex && (
                        <span className="text-emerald-600 dark:text-emerald-400 text-xs">✓ Correct</span>
                      )}
                      {hasAnswered && idx === selectedAnswerIndex && idx !== currentQuizQuestion.correctIndex && (
                        <span className="text-rose-600 dark:text-rose-400 text-xs">✗ Incorrect</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Explanation */}
              {hasAnswered && (
                <div className="space-y-3 pt-3 text-xs animate-in fade-in duration-200">
                  <div className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">Explanation: </span>
                    {currentQuizQuestion.explanation}
                  </div>

                  {currentQuizQuestion.mistakeAlert && (
                    <div className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                      {currentQuizQuestion.mistakeAlert}
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextQuizQuestion}
                      className="px-4 py-2 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 rounded-md text-xs font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      {quizQuestionIndex + 1 < filteredQuizQuestions.length ? "Next Question" : "See Final Score"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed View */
            <div className="py-12 text-center space-y-4">
              <Award className="w-8 h-8 mx-auto text-neutral-900 dark:text-neutral-100" />
              <div className="space-y-1">
                <h3 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">
                  Quiz Completed
                </h3>
                <p className="text-xs text-neutral-500">
                  You scored {quizScore} out of {filteredQuizQuestions.length} (
                  {Math.round((quizScore / filteredQuizQuestions.length) * 100)}%)
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleRestartQuiz}
                  className="px-4 py-2 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 rounded-md text-xs font-medium cursor-pointer"
                >
                  Restart Practice Test
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* INSPECTION MODAL (Clean minimal sheet)                                    */}
      {/* ========================================================================= */}
      {inspectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setInspectedItem(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-5 shadow-xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">
                    {inspectedItem.collocation}
                  </h3>
                  <button
                    onClick={() => playAudio(inspectedItem.collocation)}
                    className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 p-1"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-neutral-500">
                  {inspectedItem.typeLabel} • {inspectedItem.level} • {inspectedItem.unit}
                </div>
              </div>

              <button
                onClick={() => setInspectedItem(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Meaning & Example */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <span className="text-neutral-400">Definition: </span>
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                  {inspectedItem.definition}
                </span>
              </div>

              <div>
                <span className="text-neutral-400">Examiner Context Sentence: </span>
                <blockquote className="mt-1 pl-3 border-l border-neutral-300 dark:border-neutral-700 italic text-neutral-700 dark:text-neutral-300">
                  &ldquo;{inspectedItem.example}&rdquo;
                </blockquote>
              </div>

              <div>
                <span className="text-neutral-400">Candidate Common Mistake: </span>
                <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5">
                  {inspectedItem.commonMistake}
                </div>
              </div>

              {inspectedItem.alternativePartners && (
                <div>
                  <span className="text-neutral-400">Alternative Collocates: </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {inspectedItem.alternativePartners.map((partner, idx) => (
                      <span
                        key={idx}
                        className="text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-[11px]"
                      >
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {inspectedItem.ieltsTip && (
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-neutral-500 text-[11px]">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">Examiner Tip: </span>
                  {inspectedItem.ieltsTip}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="font-serif text-neutral-900 dark:text-neutral-100">
                Impact: {inspectedItem.bandImpact}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStar(inspectedItem.id)}
                  className={`px-3 py-1.5 rounded-md border text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                    starredIds.has(inspectedItem.id)
                      ? "border-amber-400 text-amber-500 bg-amber-400/5"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300"
                  }`}
                >
                  <Star className={`w-3 h-3 ${starredIds.has(inspectedItem.id) ? "fill-amber-400" : ""}`} />
                  <span>{starredIds.has(inspectedItem.id) ? "Starred" : "Star"}</span>
                </button>

                <button
                  onClick={() => toggleMaster(inspectedItem.id)}
                  className={`px-3 py-1.5 rounded-md border text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                    masteredIds.has(inspectedItem.id)
                      ? "border-emerald-500 text-emerald-600 bg-emerald-500/5"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-300"
                  }`}
                >
                  <Check className="w-3 h-3" />
                  <span>{masteredIds.has(inspectedItem.id) ? "Mastered" : "Mark Mastered"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
