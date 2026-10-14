"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  PenTool,
  Mic,
  BookOpen,
  BookText,
  BookA,
  BarChart2,
  ChevronDown,
  Check,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activeCategory: "practice" | "learn";
  practiceTab: "writing" | "speaking";
  learnTab: "collocations" | "vocabulary" | "rubric";
  onCategoryChange: (category: "practice" | "learn") => void;
  onSelectPracticeTab: (tab: "writing" | "speaking") => void;
  onSelectLearnTab: (tab: "collocations" | "vocabulary" | "rubric") => void;
  onOpenStartPage: () => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

export function Navbar({
  activeCategory,
  practiceTab,
  learnTab,
  onCategoryChange,
  onSelectPracticeTab,
  onSelectLearnTab,
  onOpenStartPage,
  onOpenApiKeyModal,
  hasApiKey,
}: NavbarProps) {
  const [openDropdown, setOpenDropdown] = useState<"practice" | "learn" | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleTogglePractice = () => {
    if (activeCategory !== "practice") {
      onCategoryChange("practice");
    }
    setOpenDropdown((prev) => (prev === "practice" ? null : "practice"));
  };

  const handleToggleLearn = () => {
    if (activeCategory !== "learn") {
      onCategoryChange("learn");
    }
    setOpenDropdown((prev) => (prev === "learn" ? null : "learn"));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 h-14 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={onOpenStartPage}
          className="flex items-center gap-2.5 text-left cursor-pointer group"
          title="Return to Start Page"
        >
          <span className="font-serif font-semibold text-lg sm:text-xl tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:opacity-80 transition-opacity">
            IELTSpro666
          </span>
          <span className="hidden sm:inline text-xs text-neutral-400 dark:text-neutral-500">
            Examiner Bench
          </span>
        </button>

        {/* Right Section: Tabs with Dropdowns + Actions */}
        <div ref={navRef} className="flex items-center gap-3.5 sm:gap-6">
          {/* Tab Navigation: Practice (dropdown), Learn (dropdown) */}
          <nav className="flex items-center gap-2 sm:gap-4 text-xs">
            {/* PRACTICE DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={handleTogglePractice}
                className={cn(
                  "py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-medium",
                  activeCategory === "practice"
                    ? "text-neutral-950 dark:text-neutral-50 font-semibold bg-neutral-100/80 dark:bg-neutral-900/80"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50"
                )}
                aria-expanded={openDropdown === "practice"}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Practice</span>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 text-neutral-400 dark:text-neutral-500 transition-transform duration-200",
                    openDropdown === "practice" && "rotate-180"
                  )}
                />
              </button>

              {openDropdown === "practice" && (
                <div className="absolute top-full left-0 mt-2 w-64 p-1.5 rounded-xl border border-neutral-200/90 dark:border-neutral-800/90 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/40 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Practice Studios
                  </div>

                  {/* Writing Studio */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPracticeTab("writing");
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer",
                      activeCategory === "practice" && practiceTab === "writing"
                        ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 font-medium"
                        : "hover:bg-neutral-50 dark:hover:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-center bg-white dark:bg-neutral-900 shrink-0">
                        <PenTool className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
                      </div>
                      <div>
                        <div className="text-xs font-medium">Writing Studio</div>
                        <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
                          Task 1 & Task 2 practice
                        </div>
                      </div>
                    </div>
                    {activeCategory === "practice" && practiceTab === "writing" && (
                      <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100 shrink-0" />
                    )}
                  </button>

                  {/* Speaking Studio */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPracticeTab("speaking");
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer mt-0.5",
                      activeCategory === "practice" && practiceTab === "speaking"
                        ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 font-medium"
                        : "hover:bg-neutral-50 dark:hover:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-center bg-white dark:bg-neutral-900 shrink-0">
                        <Mic className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
                      </div>
                      <div>
                        <div className="text-xs font-medium">Speaking Studio</div>
                        <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
                          Part 2 cue cards & shadowing
                        </div>
                      </div>
                    </div>
                    {activeCategory === "practice" && practiceTab === "speaking" && (
                      <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100 shrink-0" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* LEARN DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={handleToggleLearn}
                className={cn(
                  "py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-medium",
                  activeCategory === "learn"
                    ? "text-neutral-950 dark:text-neutral-50 font-semibold bg-neutral-100/80 dark:bg-neutral-900/80"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50"
                )}
                aria-expanded={openDropdown === "learn"}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Learn</span>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 text-neutral-400 dark:text-neutral-500 transition-transform duration-200",
                    openDropdown === "learn" && "rotate-180"
                  )}
                />
              </button>

              {openDropdown === "learn" && (
                <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-64 p-1.5 rounded-xl border border-neutral-200/90 dark:border-neutral-800/90 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/40 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Learning Resources
                  </div>

                  {/* Collocations */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectLearnTab("collocations");
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer",
                      activeCategory === "learn" && learnTab === "collocations"
                        ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 font-medium"
                        : "hover:bg-neutral-50 dark:hover:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-center bg-white dark:bg-neutral-900 shrink-0">
                        <BookText className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
                      </div>
                      <div>
                        <div className="text-xs font-medium">Collocations</div>
                        <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
                          500+ Cambridge Academic In Use
                        </div>
                      </div>
                    </div>
                    {activeCategory === "learn" && learnTab === "collocations" && (
                      <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100 shrink-0" />
                    )}
                  </button>

                  {/* Vocabulary */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectLearnTab("vocabulary");
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer mt-0.5",
                      activeCategory === "learn" && learnTab === "vocabulary"
                        ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 font-medium"
                        : "hover:bg-neutral-50 dark:hover:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-center bg-white dark:bg-neutral-900 shrink-0">
                        <BookA className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
                      </div>
                      <div>
                        <div className="text-xs font-medium">Vocabulary</div>
                        <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
                          Oxford 3000 & 5000 CEFR
                        </div>
                      </div>
                    </div>
                    {activeCategory === "learn" && learnTab === "vocabulary" && (
                      <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100 shrink-0" />
                    )}
                  </button>

                  {/* Band Descriptors */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectLearnTab("rubric");
                      setOpenDropdown(null);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer mt-0.5",
                      activeCategory === "learn" && learnTab === "rubric"
                        ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 font-medium"
                        : "hover:bg-neutral-50 dark:hover:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-center bg-white dark:bg-neutral-900 shrink-0">
                        <BarChart2 className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
                      </div>
                      <div>
                        <div className="text-xs font-medium">Band Descriptors</div>
                        <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
                          Official Scoring Rubric
                        </div>
                      </div>
                    </div>
                    {activeCategory === "learn" && learnTab === "rubric" && (
                      <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100 shrink-0" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Hairline separator */}
          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

          {/* AI Engine Status Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              hasApiKey
                ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                : "border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
            title="Configure Live Gemini AI or use local evaluation engine"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                hasApiKey ? "bg-emerald-500" : "bg-neutral-400 dark:bg-neutral-600"
              }`}
            />
            <span className="hidden sm:inline">
              {hasApiKey ? "Live AI" : "AI Engine"}
            </span>
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
