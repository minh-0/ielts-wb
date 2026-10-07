"use client";

import React from "react";
import { PenTool, Mic, BookOpen, BookA, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  activeTab: "writing" | "speaking" | "rubric" | "vocabulary";
  onTabChange: (tab: "writing" | "speaking" | "rubric" | "vocabulary") => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

export function Navbar({ activeTab, onTabChange, onOpenApiKeyModal, hasApiKey }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 h-13 flex items-center justify-between">
        {/* Brand / Logo - Project Name */}
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50">
            IELTSlayer666
          </span>
        </div>

        {/* Tab Navigation: Minimalist segmented switcher */}
        <nav className="flex items-center gap-1 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 text-xs font-medium">
          <button
            onClick={() => onTabChange("writing")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === "writing"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <PenTool className="w-3 h-3" />
            <span>Writing</span>
          </button>

          <button
            onClick={() => onTabChange("speaking")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === "speaking"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>Speaking</span>
          </button>

          <button
            onClick={() => onTabChange("vocabulary")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === "vocabulary"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <BookA className="w-3 h-3" />
            <span>Vocabulary</span>
          </button>

          <button
            onClick={() => onTabChange("rubric")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer hidden md:flex ${
              activeTab === "rubric"
                ? "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-medium shadow-xs"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Rubric</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* AI Mode Selector Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              hasApiKey
                ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                : "border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
            title="Configure Live Gemini AI or use free evaluation engine"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                hasApiKey ? "bg-emerald-500" : "bg-neutral-400 dark:bg-neutral-600"
              }`}
            />
            <span className="hidden sm:inline">
              {hasApiKey ? "Live AI Active" : "AI Mode (Free)"}
            </span>
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
