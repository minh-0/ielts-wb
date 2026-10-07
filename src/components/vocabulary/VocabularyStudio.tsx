"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  OXFORD_VOCAB_LIST,
  OxfordVocabItem,
  CefrLevel,
  CEFR_LEVEL_METADATA,
} from "@/lib/oxfordVocabData";
import {
  Search,
  Volume2,
  Star,
  CheckCircle2,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  ExternalLink,
  BookOpen,
  Sparkles,
  Filter,
  Layers,
  ListFilter,
  Check,
  X,
} from "lucide-react";

export function VocabularyStudio() {
  // Navigation & filter states
  const [activeMode, setActiveMode] = useState<"flashcards" | "explorer">("flashcards");
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | "ALL">("C1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPos, setSelectedPos] = useState<string>("ALL");
  const [selectedLetter, setSelectedLetter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"all" | "starred" | "mastered">("all");

  // Local storage persistence
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  // Flashcards state
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);

  // Explorer modal / selected item
  const [inspectedWord, setInspectedWord] = useState<OxfordVocabItem | null>(null);
  const [explorerPage, setExplorerPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 30;

  // Load persistence
  useEffect(() => {
    try {
      const savedStarred = localStorage.getItem("oxford_starred");
      if (savedStarred) setStarredIds(new Set(JSON.parse(savedStarred)));

      const savedMastered = localStorage.getItem("oxford_mastered");
      if (savedMastered) setMasteredIds(new Set(JSON.parse(savedMastered)));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleStar = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem("oxford_starred", JSON.stringify(Array.from(next)));
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
        localStorage.setItem("oxford_mastered", JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }, []);

  // Audio pronunciation helper using Web Speech API
  const playAudio = useCallback((word: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-GB";
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Filtered dataset
  const filteredWords = useMemo(() => {
    return OXFORD_VOCAB_LIST.filter((item) => {
      // Level filter
      if (selectedLevel !== "ALL" && item.level !== selectedLevel) return false;

      // Status filter
      if (statusFilter === "starred" && !starredIds.has(item.id)) return false;
      if (statusFilter === "mastered" && !masteredIds.has(item.id)) return false;

      // Part of speech filter
      if (selectedPos !== "ALL") {
        if (!item.pos.toLowerCase().includes(selectedPos.toLowerCase())) return false;
      }

      // Letter filter
      if (selectedLetter !== "ALL") {
        if (!item.word.toLowerCase().startsWith(selectedLetter.toLowerCase())) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesWord = item.word.toLowerCase().includes(q);
        const matchesDef = item.definition.toLowerCase().includes(q);
        const matchesPos = item.pos.toLowerCase().includes(q);
        if (!matchesWord && !matchesDef && !matchesPos) return false;
      }

      return true;
    });
  }, [selectedLevel, statusFilter, selectedPos, selectedLetter, searchQuery, starredIds, masteredIds]);

  // Flashcards active pool
  const flashcardPool = useMemo(() => {
    if (!isShuffled) return filteredWords;
    const arr = [...filteredWords];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [filteredWords, isShuffled]);

  // Reset index when filters change
  useEffect(() => {
    setCardIndex(0);
    setIsFlipped(false);
    setExplorerPage(1);
  }, [selectedLevel, statusFilter, selectedPos, selectedLetter, searchQuery]);

  // Current card
  const currentCard = flashcardPool[cardIndex] || null;

  // Flashcard keyboard shortcuts
  useEffect(() => {
    if (activeMode !== "flashcards") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in search input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNextCard();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrevCard();
      } else if (e.key === "m" || e.key === "M") {
        if (currentCard) toggleMaster(currentCard.id);
      } else if (e.key === "s" || e.key === "S") {
        if (currentCard) toggleStar(currentCard.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMode, currentCard, flashcardPool.length, toggleMaster, toggleStar]);

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

  // Level counts
  const levelCounts = useMemo(() => {
    const c: Record<string, number> = { ALL: OXFORD_VOCAB_LIST.length };
    OXFORD_VOCAB_LIST.forEach((w) => {
      c[w.level] = (c[w.level] || 0) + 1;
    });
    return c;
  }, []);

  // Explorer paginated items
  const paginatedExplorerItems = useMemo(() => {
    const start = (explorerPage - 1) * ITEMS_PER_PAGE;
    return filteredWords.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredWords, explorerPage]);

  const totalExplorerPages = Math.ceil(filteredWords.length / ITEMS_PER_PAGE) || 1;

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Oxford 3000™ & 5000™ Vocabulary
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
              {OXFORD_VOCAB_LIST.length.toLocaleString()} words
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            CEFR A1 through C1 core lexical syllabus. Master high-register B2 & C1 academic lexis for IELTS Band 7.5–9.0.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="inline-flex items-center p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-xs font-medium self-start md:self-auto">
          <button
            onClick={() => setActiveMode("flashcards")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeMode === "flashcards"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => setActiveMode("explorer")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeMode === "explorer"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Word Explorer</span>
          </button>
        </div>
      </div>

      {/* Control Strip: CEFR Level Pills & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* CEFR Level Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs">
          {(["C1", "B2", "B1", "A2", "A1", "ALL"] as (CefrLevel | "ALL")[]).map((lvl) => {
            const isSelected = selectedLevel === lvl;
            const count = levelCounts[lvl] || 0;
            return (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 font-medium ${
                  isSelected
                    ? "border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black shadow-xs"
                    : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-200"
                }`}
              >
                <span>{lvl === "ALL" ? "All Levels" : lvl}</span>
                <span
                  className={`text-[10px] px-1 rounded-sm font-mono ${
                    isSelected
                      ? "bg-white/20 text-white dark:bg-black/20 dark:text-black"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {count.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Quick Filter */}
        <div className="flex items-center gap-2">
          {/* Status Filter (All / Starred / Mastered) */}
          <div className="inline-flex items-center p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === "all"
                  ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("starred")}
              className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                statusFilter === "starred"
                  ? "bg-white text-amber-600 dark:bg-neutral-800 dark:text-amber-400 font-medium"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
              title="Starred words to review"
            >
              <Star className="w-3 h-3 fill-amber-400/30 text-amber-500" />
              <span>{starredIds.size}</span>
            </button>
            <button
              onClick={() => setStatusFilter("mastered")}
              className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                statusFilter === "mastered"
                  ? "bg-white text-emerald-600 dark:bg-neutral-800 dark:text-emerald-400 font-medium"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
              title="Mastered words"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>{masteredIds.size}</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[180px] sm:min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lexis..."
              className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
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

      {/* ========================================================================= */}
      {/* MODE 1: FLASHCARDS                                                        */}
      {/* ========================================================================= */}
      {activeMode === "flashcards" && (
        <div className="max-w-2xl mx-auto space-y-4">
          {flashcardPool.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No vocabulary items match your selected filter criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedLevel("ALL");
                  setStatusFilter("all");
                  setSearchQuery("");
                }}
                className="mt-3 px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Progress and control header */}
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="font-mono">
                    {cardIndex + 1} / {flashcardPool.length}
                  </span>
                  <span className="text-neutral-300 dark:text-neutral-700">•</span>
                  <span>{selectedLevel === "ALL" ? "All Levels" : `${selectedLevel} Lexis`}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsShuffled(!isShuffled)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] transition-colors cursor-pointer border ${
                      isShuffled
                        ? "border-neutral-900 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-medium"
                        : "border-transparent text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    }`}
                    title="Toggle shuffle order"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Shuffle</span>
                  </button>

                  <span className="text-neutral-400 dark:text-neutral-500 hidden sm:inline">
                    Space: flip • ← / →: navigate
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-900 dark:bg-neutral-100 transition-all duration-200"
                  style={{
                    width: `${((cardIndex + 1) / flashcardPool.length) * 100}%`,
                  }}
                />
              </div>

              {/* The Interactive Flashcard */}
              {currentCard && (
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`min-h-[340px] sm:min-h-[360px] p-6 sm:p-8 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                    isFlipped
                      ? "border-neutral-300 dark:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-900/60 shadow-sm"
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-xs"
                  }`}
                >
                  {/* Card Top: Badges and Star Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold border ${
                          CEFR_LEVEL_METADATA[currentCard.level]?.badgeColor || "border-neutral-200"
                        }`}
                      >
                        {currentCard.level}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                        {currentCard.pos}
                      </span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono hidden sm:inline">
                        {currentCard.sourceList}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => toggleStar(currentCard.id, e)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          starredIds.has(currentCard.id)
                            ? "border-amber-400/40 bg-amber-400/10 text-amber-500"
                            : "border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-amber-500"
                        }`}
                        title={starredIds.has(currentCard.id) ? "Remove Star" : "Star for Review"}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            starredIds.has(currentCard.id) ? "fill-amber-400 text-amber-500" : ""
                          }`}
                        />
                      </button>

                      <button
                        onClick={(e) => toggleMaster(currentCard.id, e)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          masteredIds.has(currentCard.id)
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-emerald-500"
                        }`}
                        title={masteredIds.has(currentCard.id) ? "Marked as Mastered" : "Mark Mastered"}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            masteredIds.has(currentCard.id) ? "text-emerald-500 fill-emerald-500/20" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Card Center: Content based on flip */}
                  <div className="my-auto py-4">
                    {!isFlipped ? (
                      <div className="text-center space-y-3">
                        <div className="flex items-center justify-center gap-3">
                          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                            {currentCard.word}
                          </h2>
                          <button
                            onClick={(e) => playAudio(currentCard.word, e)}
                            className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                            title="Listen to UK pronunciation"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="font-mono text-sm text-neutral-400 dark:text-neutral-500">
                          {currentCard.phonetic}
                        </p>

                        <div className="pt-4">
                          <span className="text-xs text-neutral-400 dark:text-neutral-500 flex items-center justify-center gap-1">
                            <RotateCw className="w-3 h-3" />
                            Click or press Space to reveal definition & IELTS context
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Audio + Word Recap */}
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                              {currentCard.word}
                            </span>
                            <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
                              {currentCard.phonetic}
                            </span>
                          </div>
                          <button
                            onClick={(e) => playAudio(currentCard.word, e)}
                            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Definition */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                            Definition
                          </span>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 leading-relaxed">
                            {currentCard.definition}
                          </p>
                        </div>

                        {/* IELTS Example Sentence */}
                        <div className="space-y-1 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/70">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                            IELTS Usage Context
                          </span>
                          <p className="text-xs text-neutral-700 dark:text-neutral-300 italic leading-relaxed">
                            "{currentCard.example}"
                          </p>
                        </div>

                        {/* Collocations */}
                        {currentCard.collocations && currentCard.collocations.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                              Academic Collocations
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {currentCard.collocations.map((c, i) => (
                                <span
                                  key={i}
                                  className="text-[11px] px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300 font-mono"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Oxford External Link & Flip Indicator */}
                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                    <span className="text-[11px]">
                      {isFlipped ? "Click to flip back" : "Tap card to flip"}
                    </span>
                    <a
                      href={currentCard.oxfordUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    >
                      <span>Oxford Dictionaries</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrevCard}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 text-xs font-medium transition-colors cursor-pointer shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => currentCard && toggleMaster(currentCard.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      currentCard && masteredIds.has(currentCard.id)
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {currentCard && masteredIds.has(currentCard.id) ? "Mastered" : "Mark Mastered"}
                    </span>
                  </button>

                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="px-4 py-2 rounded-xl border border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                  >
                    {isFlipped ? "Flip Back" : "Reveal Meaning"}
                  </button>
                </div>

                <button
                  onClick={handleNextCard}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 text-xs font-medium transition-colors cursor-pointer shadow-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: WORD EXPLORER (BROWSER / TABLE)                                   */}
      {/* ========================================================================= */}
      {activeMode === "explorer" && (
        <div className="space-y-4">
          {/* Alphabet Strip */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono">
            <button
              onClick={() => setSelectedLetter("ALL")}
              className={`px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                selectedLetter === "ALL"
                  ? "border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black font-semibold"
                  : "border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              ALL
            </button>
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                  selectedLetter === letter
                    ? "border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black font-semibold"
                    : "border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Explorer Word Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {paginatedExplorerItems.map((item) => {
              const isStarred = starredIds.has(item.id);
              const isMastered = masteredIds.has(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setInspectedWord(item)}
                  className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white">
                          {item.word}
                        </span>
                        <button
                          onClick={(e) => playAudio(item.word, e)}
                          className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                          title="Listen pronunciation"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-neutral-400 capitalize">
                          {item.pos}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-400">
                          {item.phonetic}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold border ${
                          CEFR_LEVEL_METADATA[item.level]?.badgeColor || "border-neutral-200"
                        }`}
                      >
                        {item.level}
                      </span>
                      <button
                        onClick={(e) => toggleStar(item.id, e)}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                          isStarred ? "text-amber-500" : "text-neutral-300 dark:text-neutral-700 hover:text-neutral-500"
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${isStarred ? "fill-amber-400 text-amber-500" : ""}`} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {item.definition}
                  </p>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="font-mono text-[10px]">{item.sourceList}</span>
                    {isMastered && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        <Check className="w-3 h-3" /> Mastered
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {filteredWords.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
              <div>
                Showing {(explorerPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(explorerPage * ITEMS_PER_PAGE, filteredWords.length)} of{" "}
                {filteredWords.length.toLocaleString()} words
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={explorerPage <= 1}
                  onClick={() => setExplorerPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
                >
                  Prev
                </button>
                <span className="px-2 font-mono">
                  {explorerPage} / {totalExplorerPages}
                </span>
                <button
                  disabled={explorerPage >= totalExplorerPages}
                  onClick={() => setExplorerPage((p) => Math.min(totalExplorerPages, p + 1))}
                  className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* WORD INSPECTION MODAL (EXPLORER DETAIL VIEW)                              */}
      {/* ========================================================================= */}
      {inspectedWord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setInspectedWord(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {inspectedWord.word}
                  </h3>
                  <button
                    onClick={() => playAudio(inspectedWord.word)}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer"
                    title="Listen pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs text-neutral-400">
                    {inspectedWord.phonetic}
                  </span>
                  <span className="text-neutral-300 dark:text-neutral-700">•</span>
                  <span className="text-xs text-neutral-500 capitalize">{inspectedWord.pos}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-mono font-semibold border ${
                    CEFR_LEVEL_METADATA[inspectedWord.level]?.badgeColor || "border-neutral-200"
                  }`}
                >
                  {inspectedWord.level}
                </span>
                <button
                  onClick={() => setInspectedWord(null)}
                  className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                Definition
              </span>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 leading-relaxed">
                {inspectedWord.definition}
              </p>
            </div>

            <div className="space-y-1 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                IELTS Context
              </span>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 italic leading-relaxed">
                "{inspectedWord.example}"
              </p>
            </div>

            {inspectedWord.collocations && inspectedWord.collocations.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                  Common Collocations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {inspectedWord.collocations.map((c, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300 font-mono"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStar(inspectedWord.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                    starredIds.has(inspectedWord.id)
                      ? "border-amber-400/40 bg-amber-400/10 text-amber-500"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      starredIds.has(inspectedWord.id) ? "fill-amber-400 text-amber-500" : ""
                    }`}
                  />
                  <span>{starredIds.has(inspectedWord.id) ? "Starred" : "Star"}</span>
                </button>

                <button
                  onClick={() => toggleMaster(inspectedWord.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                    masteredIds.has(inspectedWord.id)
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{masteredIds.has(inspectedWord.id) ? "Mastered" : "Mark Mastered"}</span>
                </button>
              </div>

              <a
                href={inspectedWord.oxfordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                <span>Oxford Dictionary</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
