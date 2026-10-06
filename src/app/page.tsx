"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { WritingStudio } from "@/components/writing/WritingStudio";
import { SpeakingStudio } from "@/components/speaking/SpeakingStudio";
import { RubricViewer } from "@/components/rubric/RubricViewer";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { ShieldCheck, Award, Sparkles, Share2 } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"writing" | "speaking" | "rubric">("writing");
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("gemini_api_key") || "";
    setApiKey(saved);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600/10 via-red-950/5 to-transparent border border-red-500/20 p-6 sm:p-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs">
              <Award className="w-3.5 h-3.5" /> OFFICIAL EXAMINER STANDARD
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
              Master IELTS with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
                Examiner-Grade Precision
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              No vague chatbot feedback. Get line-by-line examiner diffs, band-boosting C1/C2 collocations, and dual-mode Speaking test simulations with audio pacing analytics grounded in Cambridge & IDP criteria.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>4 Official Assessment Criteria</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Word & Idiom Upgrades</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-red-500" />
                <span>Downloadable Scorecards for Facebook</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "writing" && <WritingStudio apiKey={apiKey} />}
        {activeTab === "speaking" && <SpeakingStudio apiKey={apiKey} />}
        {activeTab === "rubric" && <RubricViewer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 bg-white/50 dark:bg-gray-950/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-red-600 dark:text-red-500">IELTS BandBoost AI</span>
            <span>• Built for Vibe Coding Contest 2026</span>
          </div>
          <div>
            Grounded in the Public Band Descriptors owned by British Council, IDP: IELTS Australia, and Cambridge English.
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={setApiKey}
      />
    </div>
  );
}
