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
  BookA,
  BarChart2,
  FileText,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [category, setCategory] = useState<"practice" | "learn">("practice");
  const [practiceTab, setPracticeTab] = useState<"writing" | "speaking">("writing");
  const [learnTab, setLearnTab] = useState<"collocations" | "vocabulary" | "rubric">("collocations");
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [writingTaskType, setWritingTaskType] = useState<TaskType>("task2");

  useEffect(() => {
    const saved = localStorage.getItem("gemini_api_key") || "";
    setApiKey(saved);
  }, []);

  const handleStartWriting = (taskType: TaskType = "task2") => {
    setWritingTaskType(taskType);
    setCategory("practice");
    setPracticeTab("writing");
    const studioEl = document.getElementById("diagnostic-studio");
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStartSpeaking = () => {
    setCategory("practice");
    setPracticeTab("speaking");
    const studioEl = document.getElementById("diagnostic-studio");
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenLearn = (subTab: "collocations" | "vocabulary" | "rubric") => {
    setCategory("learn");
    setLearnTab(subTab);
    const studioEl = document.getElementById("diagnostic-studio");
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* Top Navigation */}
      <Navbar
        activeCategory={category}
        onCategoryChange={setCategory}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
      />

      {/* Memorable Minimalist Hero Section with Refined Atmospheric Gradients */}
      <section className="relative overflow-hidden border-b border-neutral-200/80 dark:border-neutral-800/80 bg-gradient-to-b from-red-50/30 via-white to-neutral-50/60 dark:from-neutral-950 dark:via-neutral-900/40 dark:to-black transition-all duration-300">
        {/* Subtle Ambient Radial Glow Backdrops */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[360px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(239,68,68,0.08),rgba(244,63,94,0.03),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.14),rgba(0,0,0,0))] pointer-events-none -z-0" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-red-500/8 to-transparent dark:from-emerald-500/10 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute top-10 -right-32 w-96 h-96 bg-gradient-to-bl from-rose-500/8 to-transparent dark:from-sky-500/10 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 py-7 sm:py-9">
          {/* Top Metadata Badge with Gradient Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-200/60 dark:border-neutral-800/80 bg-gradient-to-r from-red-50/80 via-white to-rose-50/40 dark:from-neutral-900/90 dark:via-neutral-900/60 dark:to-neutral-950 shadow-xs mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 dark:from-blue-500 dark:to-emerald-400 shadow-xs shadow-red-500/40 dark:shadow-emerald-500/50" />
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              Cambridge & IDP Diagnostic Bench • Official Descriptors
            </span>
          </div>

          <div className="space-y-6">
            {/* Primary Headline & Description */}
            <div className="max-w-3xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight font-serif leading-[1.15] bg-gradient-to-r from-neutral-950 via-neutral-900 to-red-800 dark:from-white dark:via-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
                The IELTS companion
              </h1>
              <p className="text-sm sm:text-[15px] text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                A complete, examiner-grade diagnostic workbench for IELTS candidates. Practice Writing with 50 Task 1 visual charts and 100 Task 2 prompts, simulate full Speaking tests with real-time speech analytics, master high-yield Collocations from official Cambridge books, and study Oxford 3000/5000 vocabulary — all scored against authentic British Council and IDP band descriptors.
              </p>
            </div>

              {/* Conversion Pathways & Direct Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => handleStartWriting("task2")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 text-white dark:from-white dark:via-neutral-100 dark:to-neutral-200 dark:hover:from-neutral-100 dark:hover:to-white dark:text-neutral-950 text-xs font-medium tracking-tight transition-all duration-200 shadow-sm shadow-black/10 dark:shadow-white/5 cursor-pointer hover:shadow-md"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Start Writing Session</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </button>

                <button
                  onClick={handleStartSpeaking}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-neutral-200/90 dark:border-neutral-800/90 bg-gradient-to-b from-white to-neutral-50/80 hover:to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 hover:dark:from-neutral-800 hover:dark:to-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-medium transition-all shadow-xs cursor-pointer"
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
                  onClick={() => handleOpenLearn("rubric")}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Public Descriptors</span>
                </button>

                <button
                  onClick={() => handleOpenLearn("collocations")}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors cursor-pointer"
                >
                  <BookText className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Collocations in Use</span>
                </button>
              </div>

              {/* Minimalist Verification Audit Strip with Refined Gradient Cards */}
              <div className="border-t border-neutral-200/80 dark:border-neutral-800/80 pt-5 mt-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  <div className="p-3 rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 bg-gradient-to-b from-white/70 to-neutral-50/30 dark:from-neutral-900/40 dark:to-neutral-950/20 backdrop-blur-xs space-y-0.5 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      50 Task 1 Charts
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Simon Corcoran & Cambridge books verified
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 bg-gradient-to-b from-white/70 to-neutral-50/30 dark:from-neutral-900/40 dark:to-neutral-950/20 backdrop-blur-xs space-y-0.5 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      100 Task 2 Prompts
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      9 core academic exam categories
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 bg-gradient-to-b from-white/70 to-neutral-50/30 dark:from-neutral-900/40 dark:to-neutral-950/20 backdrop-blur-xs space-y-0.5 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      4 Official Criteria
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      TA/TR, CC, LR, and GRA calibration
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 bg-gradient-to-b from-white/70 to-neutral-50/30 dark:from-neutral-900/40 dark:to-neutral-950/20 backdrop-blur-xs space-y-0.5 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Zero Data Retention
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
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
        {/* Category Sub-Navigation (Clean Underline Style) */}
        <div className="flex items-center gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-6">
          {category === "practice" ? (
            <>
              <button
                onClick={() => setPracticeTab("writing")}
                className={`flex items-center gap-2 text-xs font-medium pb-1 transition-colors cursor-pointer ${
                  practiceTab === "writing"
                    ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Writing Studio</span>
              </button>
              <button
                onClick={() => setPracticeTab("speaking")}
                className={`flex items-center gap-2 text-xs font-medium pb-1 transition-colors cursor-pointer ${
                  practiceTab === "speaking"
                    ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Speaking Studio</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setLearnTab("collocations")}
                className={`flex items-center gap-2 text-xs font-medium pb-1 transition-colors cursor-pointer ${
                  learnTab === "collocations"
                    ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                }`}
              >
                <BookText className="w-3.5 h-3.5" />
                <span>Collocations</span>
              </button>
              <button
                onClick={() => setLearnTab("vocabulary")}
                className={`flex items-center gap-2 text-xs font-medium pb-1 transition-colors cursor-pointer ${
                  learnTab === "vocabulary"
                    ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                }`}
              >
                <BookA className="w-3.5 h-3.5" />
                <span>Vocabulary (Oxford)</span>
              </button>
              <button
                onClick={() => setLearnTab("rubric")}
                className={`flex items-center gap-2 text-xs font-medium pb-1 transition-colors cursor-pointer ${
                  learnTab === "rubric"
                    ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Band Descriptors</span>
              </button>
            </>
          )}
        </div>

        {/* Tab Content */}
        {category === "practice" && practiceTab === "writing" && (
          <WritingStudio apiKey={apiKey} initialTaskType={writingTaskType} />
        )}
        {category === "practice" && practiceTab === "speaking" && (
          <SpeakingStudio
            apiKey={apiKey}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          />
        )}
        {category === "learn" && learnTab === "collocations" && <CollocationsStudio />}
        {category === "learn" && learnTab === "vocabulary" && <VocabularyStudio />}
        {category === "learn" && learnTab === "rubric" && <RubricViewer />}
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
