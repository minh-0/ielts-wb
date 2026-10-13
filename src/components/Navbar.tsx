"use client";

import React from "react";
import { PenTool, BookOpen, LayoutGrid } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  activeCategory: "practice" | "learn";
  onCategoryChange: (category: "practice" | "learn") => void;
  onOpenStartPage: () => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

export function Navbar({
  activeCategory,
  onCategoryChange,
  onOpenStartPage,
  onOpenApiKeyModal,
  hasApiKey,
}: NavbarProps) {
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

        {/* Right Section: Tabs + Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Tab Navigation: Start, Practice, Learn */}
          <nav className="flex items-center gap-4 sm:gap-6 text-xs">
            <button
              onClick={onOpenStartPage}
              className="py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
              title="Go to Start Page"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Start</span>
            </button>

            <button
              onClick={() => onCategoryChange("practice")}
              className={`py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "practice"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
              }`}
            >
              <PenTool className="w-3 h-3" />
              <span>Practice</span>
            </button>

            <button
              onClick={() => onCategoryChange("learn")}
              className={`py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "learn"
                  ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Learn</span>
            </button>
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
