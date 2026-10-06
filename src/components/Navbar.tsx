"use client";

import React from "react";
import { PenTool, Mic, BookOpen, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  activeTab: "writing" | "speaking" | "rubric";
  onTabChange: (tab: "writing" | "speaking" | "rubric") => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

export function Navbar({ activeTab, onTabChange, onOpenApiKeyModal, hasApiKey }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 h-14 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm tracking-tight text-black dark:text-white px-2 py-0.5 rounded-md border border-black/15 dark:border-white/20 bg-black/5 dark:bg-white/5">
            IELTSlayer666
          </span>
        </div>

        {/* Tab Navigation: Segmented tabs */}
        <nav className="flex items-center gap-1 p-0.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-xs font-medium">
          <button
            onClick={() => onTabChange("writing")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === "writing"
                ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <PenTool className="w-3 h-3" />
            <span>Writing</span>
          </button>

          <button
            onClick={() => onTabChange("speaking")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === "speaking"
                ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>Speaking</span>
          </button>

          <button
            onClick={() => onTabChange("rubric")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md transition-colors cursor-pointer hidden md:flex ${
              activeTab === "rubric"
                ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Rubric</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* AI Mode Selector Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              hasApiKey
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-black/10 dark:border-white/15 text-neutral-600 dark:text-neutral-400 hover:border-black/30 dark:hover:border-white/30 hover:text-black dark:hover:text-white"
            }`}
            title="Configure Live Gemini AI or use free practice engine"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                hasApiKey ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"
              }`}
            />
            <Sparkles className="w-3 h-3 text-neutral-400" />
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
