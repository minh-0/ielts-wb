"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { WritingStudio } from "@/components/writing/WritingStudio";
import { SpeakingStudio } from "@/components/speaking/SpeakingStudio";
import { VocabularyStudio } from "@/components/vocabulary/VocabularyStudio";
import { CollocationsStudio } from "@/components/collocations/CollocationsStudio";
import { RubricViewer } from "@/components/rubric/RubricViewer";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { SelectionToolbar } from "@/components/SelectionToolbar";
import { TaskType } from "@/types/ielts";
import {
  PenTool,
  Mic,
  BookOpen,
  BookText,
  BarChart2,
  FileText,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"writing" | "speaking" | "rubric" | "vocabulary" | "collocations">("writing");
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [writingTaskType, setWritingTaskType] = useState<TaskType>("task2");

  useEffect(() => {
    const saved = localStorage.getItem("gemini_api_key") || "";
    setApiKey(saved);
  }, []);

  const handleStartWriting = (taskType: TaskType = "task2") => {
    setWritingTaskType(taskType);
    setActiveTab("writing");
    const studioEl = document.getElementById("diagnostic-studio");
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStartSpeaking = () => {
    setActiveTab("speaking");
    const studioEl = document.getElementById("diagnostic-studio");
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
      />

      {/* Memorable Minimalist Hero Section: Direction 2 (The Examiner's Workbench) */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 transition-all duration-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 py-7 sm:py-9">
          {/* Top Metadata Row */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Cambridge & IDP Diagnostic Bench • Official Descriptors
            </span>
          </div>

          <div className="space-y-6">
            {/* Primary Headline & Description */}
            <div className="max-w-3xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-neutral-950 dark:text-neutral-50 font-serif leading-[1.15]">
                The best IELTS tools.{" "}
                <span className="italic text-neutral-400 dark:text-neutral-500 font-normal">
                  Built for real band gains.
                </span>
              </h1>
              <p className="text-sm sm:text-[15px] text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                A complete, examiner-grade diagnostic workbench for IELTS candidates. Practice Writing with 50 Task 1 visual charts and 100 Task 2 prompts, simulate full Speaking tests with real-time speech analytics, master high-yield Collocations from official Cambridge books, and study Oxford 3000/5000 vocabulary — all scored against authentic British Council and IDP band descriptors.
              </p>
            </div>

              {/* Conversion Pathways & Direct Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => handleStartWriting("task2")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 text-xs font-medium tracking-tight transition-colors shadow-xs cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Start Writing Session</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </button>

                <button
                  onClick={handleStartSpeaking}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Simulate Speaking</span>
                </button>

                <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1 hidden sm:block" />

                <button
                  onClick={() => handleStartWriting("task1_academic")}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors cursor-pointer"
                >
                  <BarChart2 className="w-3.5 h-3.5 text-neutral-400" />
                  <span>50 Task 1 Charts</span>
                </button>

                <button
                  onClick={() => handleStartWriting("task2")}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-neutral-400" />
                  <span>100 Task 2 Prompts</span>
                </button>

                <button
                  onClick={() => setActiveTab("rubric")}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Public Descriptors</span>
                </button>

                <button
                  onClick={() => setActiveTab("collocations")}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors cursor-pointer"
                >
                  <BookText className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Collocations in Use</span>
                </button>
              </div>

              {/* Minimalist Verification Audit Strip (Clean horizontal line instead of box cards) */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-5 mt-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      50 Task 1 Charts
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      Simon Corcoran & Cambridge books verified
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      100 Task 2 Prompts
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      9 core academic exam categories
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      4 Official Criteria
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      TA/TR, CC, LR, and GRA calibration
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Zero Data Retention
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      Local engine or client Gemini key
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* Main Expansive Container */}
      <main id="diagnostic-studio" className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 xl:px-12 py-5 sm:py-6">
        {/* Tab Content */}
        {activeTab === "writing" && (
          <WritingStudio apiKey={apiKey} initialTaskType={writingTaskType} />
        )}
        {activeTab === "speaking" && (
          <SpeakingStudio
            apiKey={apiKey}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          />
        )}
        {activeTab === "vocabulary" && <VocabularyStudio />}
        {activeTab === "collocations" && <CollocationsStudio />}
        {activeTab === "rubric" && <RubricViewer />}
      </main>

      {/* Footer: Simple, quiet line */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 bg-transparent mt-12 text-xs text-neutral-400 dark:text-neutral-600">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
            <span className="text-[11px] text-neutral-600 dark:text-neutral-400">rkrh • light</span>
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-500">
            Le Tuan Minh K67 FDA NEU
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
