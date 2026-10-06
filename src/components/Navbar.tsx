"use client";

import React from "react";
import { PenTool, Mic, BookOpen, Key, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  activeTab: "writing" | "speaking" | "rubric";
  onTabChange: (tab: "writing" | "speaking" | "rubric") => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

export function Navbar({ activeTab, onTabChange, onOpenApiKeyModal, hasApiKey }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 px-2.5 rounded-lg bg-red-600 text-white font-black text-lg tracking-wider shadow-sm">
            IELTS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-gray-900 dark:text-white">
                BandBoost
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                AI
              </span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block">
              Cambridge & IDP Standard Diagnostic
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 text-xs font-semibold">
          <button
            onClick={() => onTabChange("writing")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "writing"
                ? "bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 shadow-xs"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Writing</span>
          </button>

          <button
            onClick={() => onTabChange("speaking")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "speaking"
                ? "bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 shadow-xs"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Speaking</span>
          </button>

          <button
            onClick={() => onTabChange("rubric")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hidden md:flex ${
              activeTab === "rubric"
                ? "bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 shadow-xs"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Band Descriptors</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl border transition-all ${
              hasApiKey
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-gray-300"
            }`}
            title="Configure Gemini API Key"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {hasApiKey ? "Custom Key Active" : "API Key"}
            </span>
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
