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
    <header className="sticky top-0 z-40 w-full border-b-2 border-gray-900 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-8 px-2 bg-red-600 text-white font-black text-base tracking-widest border border-red-700">
            IELTS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-gray-900 dark:text-white uppercase">
                BandBoost
              </span>
              <span className="px-1.5 py-0.2 text-[10px] font-black uppercase bg-red-600 text-white">
                AI
              </span>
            </div>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 hidden sm:block uppercase tracking-wider">
              Cambridge & IDP Criteria Engine
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center border-2 border-gray-900 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-xs font-bold">
          <button
            onClick={() => onTabChange("writing")}
            className={`flex items-center gap-1.5 px-3.5 py-2 transition-all ${
              activeTab === "writing"
                ? "bg-red-600 text-white font-black"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>WRITING</span>
          </button>

          <button
            onClick={() => onTabChange("speaking")}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-l-2 border-gray-900 dark:border-gray-700 transition-all ${
              activeTab === "speaking"
                ? "bg-red-600 text-white font-black"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>SPEAKING</span>
          </button>

          <button
            onClick={() => onTabChange("rubric")}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-l-2 border-gray-900 dark:border-gray-700 transition-all hidden md:flex ${
              activeTab === "rubric"
                ? "bg-red-600 text-white font-black"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>RUBRIC</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 transition-all cursor-pointer ${
              hasApiKey
                ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                : "border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-100"
            }`}
            title="Configure Gemini API Key"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {hasApiKey ? "KEY ACTIVE" : "API KEY"}
            </span>
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
