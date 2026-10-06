"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { WritingStudio } from "@/components/writing/WritingStudio";
import { SpeakingStudio } from "@/components/speaking/SpeakingStudio";
import { RubricViewer } from "@/components/rubric/RubricViewer";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { SelectionToolbar } from "@/components/SelectionToolbar";

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

      {/* Main Expansive Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 xl:px-12 py-6 sm:py-8 space-y-8">
        {/* Minimalist Studio Subheader */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              {activeTab === "writing"
                ? "Writing Studio"
                : activeTab === "speaking"
                ? "Speaking Studio"
                : "Evaluation Rubric"}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {activeTab === "writing"
                ? "In-text error diagnostics, higher-rated vocabulary upgrades & examiner scoring"
                : activeTab === "speaking"
                ? "Live voice recording, transcription, speech rate & pronunciation analysis"
                : "Official public band descriptors and performance level criteria"}
            </p>
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

      {/* Footer: Simple, quiet line */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 bg-transparent mt-12 text-xs text-neutral-400 dark:text-neutral-600">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
            <span className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400">studio</span>
          </div>
          <div className="text-[11px]">
            Examiner-grounded diagnostic feedback & language analytics
          </div>
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
