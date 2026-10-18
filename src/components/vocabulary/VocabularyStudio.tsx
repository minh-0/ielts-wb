"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { OXFORD_VOCAB_LIST, OxfordVocabItem, CefrLevel } from "@/lib/oxfordVocabData";
import { Search, Volume2, Star, ExternalLink, Check, X } from "lucide-react";
import { FlipCard3D, ParticleButton } from "@/components/kokonutui";

export function VocabularyStudio() {
  const [activeMode, setActiveMode] = useState<"flashcards" | "explorer">("flashcards");
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | "ALL">("C1");
  const [searchQuery, setSearchQuery] = useState<string>("");
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
    } catch {}
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
      if (selectedLevel !== "ALL" && item.level !== selectedLevel) return false;
      if (statusFilter === "starred" && !starredIds.has(item.id)) return false;
      if (statusFilter === "mastered" && !masteredIds.has(item.id)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesWord = item.word.toLowerCase().includes(q);
        const matchesDef = item.definition.toLowerCase().includes(q);
        const matchesPos = item.pos.toLowerCase().includes(q);
        if (!matchesWord && !matchesDef && !matchesPos) return false;
      }

      return true;
    });
  }, [selectedLevel, statusFilter, searchQuery, starredIds, masteredIds]);

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

  useEffect(() => {
    setCardIndex(0);
    setIsFlipped(false);
    setExplorerPage(1);
  }, [selectedLevel, statusFilter, searchQuery]);

  const currentCard = flashcardPool[cardIndex] || null;

  const handleNextCard = useCallback(() => {
    if (flashcardPool.length === 0) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % flashcardPool.length);
  }, [flashcardPool.length]);

  const handlePrevCard = useCallback(() => {
    if (flashcardPool.length === 0) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + flashcardPool.length) % flashcardPool.length);
  }, [flashcardPool.length]);

  // Keyboard navigation
  useEffect(() => {
    if (activeMode !== "flashcards") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const target = e.target as HTMLElement | null;
      if (
        (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable)) ||
        (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable))
      ) {
        return;
      }

      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (
        e.code === "ArrowRight" ||
        e.key === "ArrowRight" ||
        e.key === "d" ||
        e.key === "D"
      ) {
        e.preventDefault();
        handleNextCard();
      } else if (
        e.code === "ArrowLeft" ||
        e.key === "ArrowLeft" ||
        e.key === "a" ||
        e.key === "A"
      ) {
        e.preventDefault();
        handlePrevCard();
      } else if (e.key === "f" || e.key === "F" || e.key === "m" || e.key === "M") {
        e.preventDefault();
        if (currentCard) toggleMaster(currentCard.id);
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        if (currentCard) toggleStar(currentCard.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMode, currentCard, handleNextCard, handlePrevCard, toggleMaster, toggleStar]);

  const paginatedExplorerItems = useMemo(() => {
    const start = (explorerPage - 1) * ITEMS_PER_PAGE;
    return filteredWords.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredWords, explorerPage]);

  const totalExplorerPages = Math.ceil(filteredWords.length / ITEMS_PER_PAGE) || 1;

  return (
    <div className="space-y-5">
      {/* Sleek Minimal Top Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        {/* CEFR Level Filter */}
        <div className="flex items-center gap-1 text-xs">
          {(["C1", "B2", "B1", "A2", "A1", "ALL"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedLevel === lvl
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black font-medium"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              }`}
            >
              {lvl === "ALL" ? "All" : lvl}
            </button>
          ))}
        </div>

        {/* Right controls: Search, Starred toggle, Mode */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-7 pr-6 py-1 w-32 sm:w-44 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
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

          {/* Starred / Mastered quick toggle */}
          <div className="inline-flex p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs">
            <button
              onClick={() => setStatusFilter(statusFilter === "starred" ? "all" : "starred")}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === "starred"
                  ? "bg-amber-400/10 text-amber-500"
                  : "text-neutral-400 hover:text-amber-500"
              }`}
              title="Show Starred"
            >
              <Star className={`w-3.5 h-3.5 ${statusFilter === "starred" ? "fill-amber-400" : ""}`} />
            </button>
            <button
              onClick={() => setStatusFilter(statusFilter === "mastered" ? "all" : "mastered")}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === "mastered"
                  ? "bg-emerald-400/10 text-emerald-500"
                  : "text-neutral-400 hover:text-emerald-500"
              }`}
              title="Show Mastered"
            >
              <Check className={`w-3.5 h-3.5 ${statusFilter === "mastered" ? "text-emerald-500" : ""}`} />
            </button>
          </div>

          {/* Mode Switcher: Clean horizontal underline tabs (no box) */}
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setActiveMode("flashcards")}
              className={`py-1 transition-colors cursor-pointer ${
                activeMode === "flashcards"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 font-medium"
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setActiveMode("explorer")}
              className={`py-1 transition-colors cursor-pointer ${
                activeMode === "explorer"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 font-medium"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: FLASHCARDS (MINIMAL)                                              */}
      {/* ========================================================================= */}
      {activeMode === "flashcards" && (
        <div className="max-w-xl mx-auto space-y-4 pt-1">
          {flashcardPool.length === 0 ? (
            <div className="py-16 text-center text-xs text-neutral-400">
              No vocabulary items found.
            </div>
          ) : (
            <>
              {currentCard && (
                <FlipCard3D
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(!isFlipped)}
                  minHeight="min-h-[290px] sm:min-h-[310px]"
                  front={
                    <>
                      {/* Top card bar */}
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {currentCard.level}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{currentCard.pos}</span>
                        </div>

                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => playAudio(currentCard.word, e)}
                            className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                            title="Pronounce"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => toggleStar(currentCard.id, e)}
                            className="p-1 rounded-md text-neutral-400 hover:text-amber-500 transition-colors cursor-pointer"
                            title="Star"
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                starredIds.has(currentCard.id) ? "fill-amber-400 text-amber-500" : ""
                              }`}
                            />
                          </button>
                          <ParticleButton
                            type="button"
                            onClick={(e) => toggleMaster(currentCard.id, e)}
                            className="p-1 rounded-md text-neutral-400 hover:text-emerald-500 transition-colors"
                            title="Mastered"
                          >
                            <Check
                              className={`w-3.5 h-3.5 ${
                                masteredIds.has(currentCard.id) ? "text-emerald-500" : ""
                              }`}
                            />
                          </ParticleButton>
                        </div>
                      </div>

                      {/* Center content */}
                      <div className="my-auto py-4 text-center space-y-2">
                        <h2 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
                          {currentCard.word}
                        </h2>
                        <p className="text-xs text-neutral-400">
                          {currentCard.phonetic}
                        </p>
                        <p className="text-[11px] text-neutral-400/70 pt-3">
                          Tap to flip or press space
                        </p>
                      </div>

                      {/* Card bottom */}
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-900">
                        <span>
                          {cardIndex + 1} of {flashcardPool.length}
                        </span>
                        <a
                          href={currentCard.oxfordUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-1"
                        >
                          Oxford <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </>
                  }
                  back={
                    <>
                      {/* Top card bar */}
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {currentCard.level}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{currentCard.pos}</span>
                        </div>

                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => playAudio(currentCard.word, e)}
                            className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                            title="Pronounce"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <ParticleButton
                            type="button"
                            onClick={(e) => toggleMaster(currentCard.id, e)}
                            className="p-1 rounded-md text-neutral-400 hover:text-emerald-500 transition-colors"
                            title="Mastered"
                          >
                            <Check
                              className={`w-3.5 h-3.5 ${
                                masteredIds.has(currentCard.id) ? "text-emerald-500" : ""
                              }`}
                            />
                          </ParticleButton>
                        </div>
                      </div>

                      {/* Back Center content */}
                      <div className="my-auto py-2 space-y-3 text-left">
                        <div>
                          <span className="text-base font-semibold text-neutral-900 dark:text-neutral-100 block">
                            {currentCard.word}
                          </span>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mt-1">
                            {currentCard.definition}
                          </p>
                        </div>

                        {currentCard.example && (
                          <p className="text-xs text-neutral-500 italic leading-relaxed pt-1">
                            &ldquo;{currentCard.example}&rdquo;
                          </p>
                        )}

                        {currentCard.collocations && currentCard.collocations.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {currentCard.collocations.map((c, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card bottom */}
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-900">
                        <span>Tap to flip back</span>
                        <a
                          href={currentCard.oxfordUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-1"
                        >
                          Oxford <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </>
                  }
                />
              )}

              {/* Navigation controls */}
              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={handlePrevCard}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                >
                  ← Prev
                </button>

                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                    isShuffled
                      ? "text-neutral-900 dark:text-neutral-100 font-medium"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  Shuffle {isShuffled ? "on" : "off"}
                </button>

                <button
                  onClick={handleNextCard}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                >
                  Next →
                </button>
              </div>

              {/* Keyboard Navigation Hint */}
              <div className="flex items-center justify-center gap-3 text-[11px] text-neutral-400 dark:text-neutral-500 pt-1 select-none">
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[10px]">Space</kbd> Flip
                </span>
                <span>•</span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[10px]">A</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[10px]">←</kbd> Prev
                </span>
                <span>•</span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[10px]">D</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[10px]">→</kbd> Next
                </span>
                <span>•</span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[10px]">F</kbd> Master
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: EXPLORER LIST (MINIMAL)                                           */}
      {/* ========================================================================= */}
      {activeMode === "explorer" && (
        <div className="space-y-3">
          <div className="divide-y divide-neutral-100 dark:divide-neutral-900 border-y border-neutral-100 dark:border-neutral-900">
            {paginatedExplorerItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setInspectedWord(item)}
                className="py-2.5 px-2 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-baseline gap-2.5 min-w-0">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {item.word}
                  </span>
                  <span className="text-[11px] text-neutral-400 capitalize shrink-0">
                    {item.pos}
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 truncate hidden sm:inline text-[11px]">
                    {item.definition}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[10px] text-neutral-400">
                    {item.level}
                  </span>
                  <button
                    onClick={(e) => playAudio(item.word, e)}
                    className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => toggleStar(item.id, e)}
                    className="p-1 text-neutral-400 hover:text-amber-500 cursor-pointer"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        starredIds.has(item.id) ? "fill-amber-400 text-amber-500" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => toggleMaster(item.id, e)}
                    className="p-1 text-neutral-400 hover:text-emerald-500 cursor-pointer"
                  >
                    <Check
                      className={`w-3.5 h-3.5 ${
                        masteredIds.has(item.id) ? "text-emerald-500" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Minimal Pagination */}
          {filteredWords.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between pt-2 text-xs text-neutral-400">
              <span className="text-[11px]">
                {(explorerPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(explorerPage * ITEMS_PER_PAGE, filteredWords.length)} of{" "}
                {filteredWords.length.toLocaleString()}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={explorerPage <= 1}
                  onClick={() => setExplorerPage((p) => Math.max(1, p - 1))}
                  className="px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
                >
                  Prev
                </button>
                <span className="px-1.5 text-[11px]">
                  {explorerPage} / {totalExplorerPages}
                </span>
                <button
                  disabled={explorerPage >= totalExplorerPages}
                  onClick={() => setExplorerPage((p) => Math.min(totalExplorerPages, p + 1))}
                  className="px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Word Detail Modal */}
      {inspectedWord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setInspectedWord(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-950 p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {inspectedWord.word}
                  </h3>
                  <button
                    onClick={() => playAudio(inspectedWord.word)}
                    className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                  <span>{inspectedWord.phonetic}</span>
                  <span>•</span>
                  <span className="capitalize">{inspectedWord.pos}</span>
                  <span>•</span>
                  <span>{inspectedWord.level}</span>
                </div>
              </div>

              <button
                onClick={() => setInspectedWord(null)}
                className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {inspectedWord.definition}
            </p>

            {inspectedWord.example && (
              <p className="text-xs text-neutral-500 italic leading-relaxed">
                "{inspectedWord.example}"
              </p>
            )}

            {inspectedWord.collocations && inspectedWord.collocations.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {inspectedWord.collocations.map((c, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStar(inspectedWord.id)}
                  className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer transition-colors ${
                    starredIds.has(inspectedWord.id)
                      ? "border-amber-400/40 bg-amber-400/10 text-amber-500"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-amber-500"
                  }`}
                >
                  Star
                </button>
                <button
                  onClick={() => toggleMaster(inspectedWord.id)}
                  className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer transition-colors ${
                    masteredIds.has(inspectedWord.id)
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-emerald-500"
                  }`}
                >
                  Mastered
                </button>
              </div>

              <a
                href={inspectedWord.oxfordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-1"
              >
                Oxford <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
