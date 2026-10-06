"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { WritingStudio } from "@/components/writing/WritingStudio";
import { SpeakingStudio } from "@/components/speaking/SpeakingStudio";
import { RubricViewer } from "@/components/rubric/RubricViewer";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { ShieldCheck, Sparkles, Share2 } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"writing" | "speaking" | "rubric">("writing");
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("gemini_api_key") || "";
    setApiKey(saved);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Hero Section: Open, linear, no heavy box, thin divider line below */}
        <div className="pb-8 border-b border-black/10 dark:border-white/10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-black/10 dark:border-white/15 text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
            <span>OFFICIAL CAMBRIDGE & IDP DESCRIPTORS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-black dark:text-white leading-tight">
            IELTS Diagnostic & Practice Suite
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
            Automated Writing and Speaking evaluation graded strictly against official band criteria. Line-by-line diffs, lexical upgrades, and dual-mode speaking timers.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
              <span>4 Assessment Criteria</span>
            </div>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
              <span>Lexical Upgrades</span>
            </div>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <div className="flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
              <span>Shareable Scorecard</span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "writing" && <WritingStudio apiKey={apiKey} />}
        {activeTab === "speaking" && <SpeakingStudio apiKey={apiKey} />}
        {activeTab === "rubric" && <RubricViewer />}
      </main>

      {/* Footer: Simple thin line */}
      <footer className="border-t border-black/10 dark:border-white/10 py-8 bg-transparent mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-500">
          <div>IELTS BandBoost • Vibe Coding Contest 2026</div>
          <div>Grounded in British Council, IDP, and Cambridge English public descriptors.</div>
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
