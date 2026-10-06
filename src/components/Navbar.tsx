"use client";

import React from "react";
import { PenTool, Mic, BookOpen, Key } from "lucide-react";
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand / Logo: Minimalist Monospace & Clean Sans */}
        <div className="flex items-center gap-2.5">
          <span className="font-mono font-bold text-xs tracking-wider px-2 py-0.5 rounded-md border border-black/15 dark:border-white/20 bg-black/5 dark:bg-white/5 text-black dark:text-white">
            IELTS
          </span>
          <span className="font-medium text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
            BandBoost
          </span>
        </div>

        {/* Tab Navigation: Minimalist Pill segmented control */}
        <nav className="flex items-center gap-1 p-0.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-xs font-medium">
          <button
            onClick={() => onTabChange("writing")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors hidden md:flex ${
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
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              hasApiKey
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-black/10 dark:border-white/15 text-neutral-600 dark:text-neutral-400 hover:border-black/30 dark:hover:border-white/30"
            }`}
            title="Configure Gemini API Key"
          >
            <Key className="w-3 h-3" />
            <span className="hidden sm:inline">
              {hasApiKey ? "Key active" : "API Key"}
            </span>
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
