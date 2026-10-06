"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { WritingStudio } from "@/components/writing/WritingStudio";
import { SpeakingStudio } from "@/components/speaking/SpeakingStudio";
import { RubricViewer } from "@/components/rubric/RubricViewer";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { SelectionToolbar } from "@/components/SelectionToolbar";
import { ShieldCheck, Sparkles, Share2, Headphones, CheckCircle2, BookOpen } from "lucide-react";

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

      {/* Main Expansive Container (1440px max width for wide screen layouts) */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 xl:px-12 py-8 sm:py-10 space-y-10">
        {/* Hero Section: Open, wide, linear with thin divider line */}
        <div className="pb-8 border-b border-black/10 dark:border-white/10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-black/10 dark:border-white/15 text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
              OFFICIAL CAMBRIDGE & IDP BAND DESCRIPTORS
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> FREE PRACTICAL UTILITY
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-black dark:text-white leading-[1.1]">
            IELTS Diagnostic & Practice Suite
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
            Automated Writing and Speaking evaluation strictly aligned with official public band criteria.
            Identify exact in-text errors, discover high-scoring C1/C2 vocabulary replacements, and track
            pronunciation pacing with real-time feedback.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
              <span>4 Assessment Criteria</span>
            </div>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
              <span>In-Text Highlighting & Lexical Upgrades</span>
            </div>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <div className="flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
              <span>Dual-Mode Speaking Exam Timers</span>
            </div>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Oxford Learner's Dictionary & Study Highlighter</span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "writing" && <WritingStudio apiKey={apiKey} />}
        {activeTab === "speaking" && (
          <SpeakingStudio
            apiKey={apiKey}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          />
        )}
        {activeTab === "rubric" && <RubricViewer />}
      </main>

      {/* Footer: Simple thin line, wide layout */}
      <footer className="border-t border-black/10 dark:border-white/10 py-8 bg-transparent mt-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-500">
          <div>IELTSlayer666</div>
          <div>Grounded in British Council, IDP, and Cambridge English public band descriptors.</div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={setApiKey}
      />

      {/* Text Selection Toolbar (Oxford Dictionary + Cursor Highlighter) */}
      <SelectionToolbar />
    </div>
  );
}
