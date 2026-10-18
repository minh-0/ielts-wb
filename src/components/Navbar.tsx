"use client";

import React from "react";
import {
  PenTool,
  Mic,
  BookText,
  BookA,
  BarChart2,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Dock, DockIcon } from "@/components/magicui/dock";
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
  onSelectPracticeTab,
  onSelectLearnTab,
  onOpenStartPage,
  onOpenApiKeyModal,
  hasApiKey,
}: NavbarProps) {
  const renderDock = (isMobile = false) => (
    <Dock
      tooltipPosition="bottom"
      iconSize={isMobile ? 28 : 32}
      iconMagnification={isMobile ? 38 : 44}
      iconDistance={85}
      className={cn(
        "items-center border-0 border-transparent bg-transparent dark:bg-transparent shadow-none backdrop-blur-none select-none",
        isMobile ? "h-10 gap-0.5 px-0" : "h-11 gap-1 px-0"
      )}
    >
      {/* Writing Studio */}
      <DockIcon
        title="Writing Studio (Task 1 & 2)"
        isActive={activeCategory === "practice" && practiceTab === "writing"}
        onClick={() => onSelectPracticeTab("writing")}
      >
        <PenTool className={isMobile ? "w-3.5 h-3.5" : "w-4 h-4"} />
      </DockIcon>

      {/* Speaking Studio */}
      <DockIcon
        title="Speaking Studio (Cue Cards & Shadowing)"
        isActive={activeCategory === "practice" && practiceTab === "speaking"}
        onClick={() => onSelectPracticeTab("speaking")}
      >
        <Mic className={isMobile ? "w-3.5 h-3.5" : "w-4 h-4"} />
      </DockIcon>

      <div className="h-4 w-px bg-neutral-200/80 dark:bg-neutral-800/80 mx-1 shrink-0" />

      {/* Collocations */}
      <DockIcon
        title="Cambridge Collocations"
        isActive={activeCategory === "learn" && learnTab === "collocations"}
        onClick={() => onSelectLearnTab("collocations")}
      >
        <BookText className={isMobile ? "w-3.5 h-3.5" : "w-4 h-4"} />
      </DockIcon>

      {/* Vocabulary */}
      <DockIcon
        title="Oxford 3k & 5k Vocabulary"
        isActive={activeCategory === "learn" && learnTab === "vocabulary"}
        onClick={() => onSelectLearnTab("vocabulary")}
      >
        <BookA className={isMobile ? "w-3.5 h-3.5" : "w-4 h-4"} />
      </DockIcon>

      {/* Band Descriptors */}
      <DockIcon
        title="Official Band Descriptors"
        isActive={activeCategory === "learn" && learnTab === "rubric"}
        onClick={() => onSelectLearnTab("rubric")}
      >
        <BarChart2 className={isMobile ? "w-3.5 h-3.5" : "w-4 h-4"} />
      </DockIcon>
    </Dock>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/85 dark:bg-black/85 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12">
        {/* Desktop Single Row (sm and up) */}
        <div className="hidden sm:flex h-16 items-center justify-between gap-4">
          {/* Brand / Logo */}
          <button
            onClick={onOpenStartPage}
            className="flex items-center gap-2 text-left cursor-pointer group shrink-0"
            title="Return to Start Page"
          >
            <span className="font-serif font-semibold text-xl tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:opacity-80 transition-opacity">
              IELTSpro666
            </span>
          </button>

          {/* Center Magic UI Dock */}
          <div className="flex-1 flex justify-center">{renderDock(false)}</div>

          {/* Right Actions: AI Engine Status & ThemeToggle */}
          <div className="flex items-center gap-3 shrink-0">
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
              <span className="hidden lg:inline">
                {hasApiKey ? "Live AI" : "AI Engine"}
              </span>
            </button>

            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Two-Tier Layout (< sm) */}
        <div className="sm:hidden py-2 space-y-2">
          {/* Top Line: Brand on Left, Actions on Right */}
          <div className="flex items-center justify-between h-8 px-0.5">
            <button
              onClick={onOpenStartPage}
              className="font-serif font-semibold text-base tracking-tight text-neutral-900 dark:text-neutral-100"
            >
              IELTSpro666
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenApiKeyModal}
                className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md border ${
                  hasApiKey
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                    : "border-neutral-200 dark:border-neutral-800 text-neutral-500"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    hasApiKey ? "bg-emerald-500" : "bg-neutral-400"
                  }`}
                />
                <span>{hasApiKey ? "Live AI" : "AI"}</span>
              </button>
              <ThemeToggle />
            </div>
          </div>

          {/* Bottom Line: Center Magnifying Dock */}
          <div className="flex justify-center overflow-x-auto pb-0.5">
            {renderDock(true)}
          </div>
        </div>
      </div>
    </header>
  );
}
