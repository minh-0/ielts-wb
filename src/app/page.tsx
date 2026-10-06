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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section: Sharp academic style with thick lines */}
        <div className="relative border-2 border-gray-900 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]">
          {/* Top thick red stripe */}
          <div className="h-1.5 bg-red-600 w-full" />

          <div className="p-6 sm:p-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-black uppercase bg-red-600 text-white tracking-wider border border-red-700">
              <Award className="w-3.5 h-3.5" /> OFFICIAL EXAMINER STANDARD
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-950 dark:text-white leading-tight">
              Master IELTS with{" "}
              <span className="text-red-600 dark:text-red-500 underline decoration-4 underline-offset-6">
                Examiner-Grade Precision
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl font-medium">
              No generic chatbot fluff. Get line-by-line examiner diffs, band-boosting C1/C2 vocabulary suggestions, and dual-mode Speaking test simulations with audio pacing analytics grounded in official Cambridge & IDP band descriptors.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-300 border-t-2 border-gray-100 dark:border-gray-800 pt-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span>4 Official Criteria Graded</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span>Word & Idiom Upgrades</span>
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-red-600" />
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
      <footer className="border-t-2 border-gray-900 dark:border-gray-800 py-8 bg-white dark:bg-gray-950 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-black text-red-600 dark:text-red-500 uppercase">IELTS BandBoost AI</span>
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
