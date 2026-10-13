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
import { StartPage } from "@/components/start/StartPage";
import { TaskType } from "@/types/ielts";
import { Particles } from "@/components/magicui/particles";
import { ThemeToggle } from "@/components/ThemeToggle";
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
  const [hasEntered, setHasEntered] = useState<boolean | null>(null);
  const [category, setCategory] = useState<"practice" | "learn">("practice");
  const [practiceTab, setPracticeTab] = useState<"writing" | "speaking">("writing");
  const [learnTab, setLearnTab] = useState<"collocations" | "vocabulary" | "rubric">("collocations");
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [writingTaskType, setWritingTaskType] = useState<TaskType>("task2");

  useEffect(() => {
    const entered = localStorage.getItem("ielts_has_entered") === "true";
    setHasEntered(entered);
    const saved = localStorage.getItem("gemini_api_key") || "";
    setApiKey(saved);
  }, []);

  const enterWorkbench = (
    targetCategory: "practice" | "learn",
    targetSubTab?: string,
    taskType?: TaskType
  ) => {
    try {
      localStorage.setItem("ielts_has_entered", "true");
    } catch {
      // ignore storage errors
    }
    setHasEntered(true);
    setCategory(targetCategory);
    if (targetCategory === "practice") {
      if (targetSubTab === "speaking") {
        setPracticeTab("speaking");
      } else {
        setPracticeTab("writing");
        if (taskType) setWritingTaskType(taskType);
      }
    } else if (targetCategory === "learn") {
      if (targetSubTab === "vocabulary") {
        setLearnTab("vocabulary");
      } else if (targetSubTab === "rubric") {
        setLearnTab("rubric");
      } else {
        setLearnTab("collocations");
      }
    }
  };

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

  if (hasEntered === null) {
    return <div className="min-h-screen bg-white dark:bg-black" />;
  }

  if (!hasEntered) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 selection:bg-neutral-200 dark:selection:bg-neutral-800 relative overflow-hidden">
        <Particles
          className="absolute inset-0 pointer-events-none z-0"
          quantity={50}
          ease={70}
          color="#888888"
          size={0.5}
          staticity={35}
        />
        {/* Minimal Entrance Top Bar */}
        <header className="relative z-10 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
            <span className="font-serif font-semibold text-base tracking-tight text-neutral-900 dark:text-neutral-100">
              IELTSpro666
            </span>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Start Portal */}
        <main className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-8 py-6">
          <StartPage
            onStartWriting={(taskType = "task2") => enterWorkbench("practice", "writing", taskType)}
            onStartSpeaking={() => enterWorkbench("practice", "speaking")}
            onOpenLearn={(subTab) => enterWorkbench("learn", subTab)}
          />
        </main>

        {/* Quiet Minimalist Footnote */}
        <footer className="relative z-10 py-5 text-xs text-neutral-400 dark:text-neutral-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400 dark:text-neutral-600">rkrh • light</span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-600">
              Le Tuan Minh K67 FDA NEU
            </span>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* Top Navigation */}
      <Navbar
        activeCategory={category}
        onCategoryChange={setCategory}
        onOpenStartPage={() => setHasEntered(false)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
      />

      {/* Minimalist Hero Header with Atmospheric Colored Gradients & Integrated Studio Tabs */}
      <section className="relative overflow-hidden border-b border-neutral-200/80 dark:border-neutral-800/80 bg-gradient-to-b from-red-50/35 via-white to-neutral-50/60 dark:from-neutral-950 dark:via-neutral-900/40 dark:to-black transition-all duration-300">
        <Particles
          className="absolute inset-0 pointer-events-none z-0"
          quantity={65}
          ease={70}
          color="#888888"
          size={0.5}
          staticity={35}
        />
        {/* Ambient Colored Radial Glow Backdrops */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[360px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(239,68,68,0.09),rgba(244,63,94,0.04),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.15),rgba(0,0,0,0))] pointer-events-none -z-0" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-red-500/10 to-transparent dark:from-emerald-500/10 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute top-10 -right-32 w-96 h-96 bg-gradient-to-bl from-rose-500/10 to-transparent dark:from-sky-500/10 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 pt-9 sm:pt-12">
          <div className="space-y-5 pb-8 sm:pb-10">
            {/* Subtle Gradient Metadata Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-200/60 dark:border-neutral-800/80 bg-gradient-to-r from-red-50/80 via-white to-rose-50/40 dark:from-neutral-900/90 dark:via-neutral-900/60 dark:to-neutral-950 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 dark:from-blue-500 dark:to-emerald-400 shadow-xs shadow-red-500/40 dark:shadow-emerald-500/50" />
              <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                Cambridge & IDP Assessment Standards • Official Descriptors
              </span>
            </div>

            {/* Primary Headline & Description */}
            <div className="max-w-3xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight font-serif leading-[1.15] bg-gradient-to-r from-neutral-950 via-neutral-900 to-red-800 dark:from-white dark:via-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
                The IELTS companion
              </h1>
              <p className="text-sm sm:text-[15px] text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                An examiner-calibrated workbench for IELTS candidates. Practice Writing with 50 Task 1 visual charts and 100 Task 2 prompts, build Speaking fluency with structured cue cards and native shadowing, and study Cambridge collocations and Oxford 3000/5000 vocabulary.
              </p>
            </div>

            {/* Minimalist Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => handleStartWriting("task2")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 text-white dark:from-white dark:via-neutral-100 dark:to-neutral-200 dark:hover:from-neutral-100 dark:hover:to-white dark:text-neutral-950 text-xs font-medium tracking-tight transition-all duration-200 shadow-sm shadow-black/10 dark:shadow-white/5 cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Start Writing</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-70" />
              </button>

              <button
                onClick={() => handleStartWriting("task1_academic")}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-neutral-200/90 dark:border-neutral-800/90 bg-gradient-to-b from-white to-neutral-50/80 hover:to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 hover:dark:from-neutral-800 hover:dark:to-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-medium transition-all shadow-xs cursor-pointer"
              >
                <BarChart2 className="w-3.5 h-3.5 text-neutral-500" />
                <span>50 Task 1 Charts</span>
              </button>

              <button
                onClick={handleStartSpeaking}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-neutral-400" />
                <span>Simulate Speaking</span>
              </button>

              <button
                onClick={() => handleOpenLearn("rubric")}
                className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                <span>Public Descriptors</span>
              </button>
            </div>
          </div>

          {/* Integrated Studio Navigation Tabs (sits directly on the section border) */}
          <div className="flex items-center gap-6 -mb-px">
            {category === "practice" ? (
              <>
                <button
                  onClick={() => setPracticeTab("writing")}
                  className={`flex items-center gap-2 text-xs pb-3 transition-colors cursor-pointer ${
                    practiceTab === "writing"
                      ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Writing Studio</span>
                </button>
                <button
                  onClick={() => setPracticeTab("speaking")}
                  className={`flex items-center gap-2 text-xs pb-3 transition-colors cursor-pointer ${
                    practiceTab === "speaking"
                      ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
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
                  className={`flex items-center gap-2 text-xs pb-3 transition-colors cursor-pointer ${
                    learnTab === "collocations"
                      ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
                  }`}
                >
                  <BookText className="w-3.5 h-3.5" />
                  <span>Collocations</span>
                </button>
                <button
                  onClick={() => setLearnTab("vocabulary")}
                  className={`flex items-center gap-2 text-xs pb-3 transition-colors cursor-pointer ${
                    learnTab === "vocabulary"
                      ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
                  }`}
                >
                  <BookA className="w-3.5 h-3.5" />
                  <span>Vocabulary (Oxford)</span>
                </button>
                <button
                  onClick={() => setLearnTab("rubric")}
                  className={`flex items-center gap-2 text-xs pb-3 transition-colors cursor-pointer ${
                    learnTab === "rubric"
                      ? "text-neutral-950 dark:text-neutral-50 font-semibold border-b-2 border-neutral-900 dark:border-neutral-100"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 font-medium"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Band Descriptors</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Expansive Container */}
      <main id="diagnostic-studio" className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 xl:px-12 py-6">

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
