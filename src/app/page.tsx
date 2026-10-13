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

      {/* Minimalist Hero Header with Integrated Studio Tabs */}
      <section className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-b from-neutral-50/50 to-white dark:from-neutral-950 dark:to-black">
        <Particles
          className="absolute inset-0 pointer-events-none z-0"
          quantity={45}
          ease={70}
          color="#888888"
          size={0.5}
          staticity={40}
        />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 pt-7 sm:pt-9">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6">
            <div className="space-y-1.5 max-w-2xl">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight font-serif text-neutral-950 dark:text-white">
                The IELTS companion
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Examiner-calibrated Writing & Speaking practice, Cambridge collocations, and Oxford 3000/5000 vocabulary.
              </p>
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
