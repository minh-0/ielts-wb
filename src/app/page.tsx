"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { WritingStudio } from "@/components/writing/WritingStudio";
import { SpeakingStudio } from "@/components/speaking/SpeakingStudio";
import { VocabularyStudio } from "@/components/vocabulary/VocabularyStudio";
import { CollocationsStudio } from "@/components/collocations/CollocationsStudio";
import { RubricViewer } from "@/components/rubric/RubricViewer";
import { SelectionToolbar } from "@/components/SelectionToolbar";
import { StartPage } from "@/components/start/StartPage";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { SupportModal } from "@/components/SupportModal";
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
  Key,
  Heart,
} from "lucide-react";
import { DynamicText, ParticleButton } from "@/components/kokonutui";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export default function Home() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [category, setCategory] = useState<"practice" | "learn">("practice");
  const [practiceTab, setPracticeTab] = useState<"writing" | "speaking">("writing");
  const [learnTab, setLearnTab] = useState<"collocations" | "vocabulary" | "rubric">("collocations");
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);
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

  if (!hasEntered) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 selection:bg-neutral-200 dark:selection:bg-neutral-800 relative overflow-x-hidden">
        <Particles
          className="absolute inset-0 pointer-events-none z-0"
          quantity={50}
          ease={70}
          color="#888888"
          size={0.5}
          staticity={35}
        />
        {/* Minimal Entrance Top Bar */}
        <header className="relative z-10 w-full shrink-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
            <span className="font-serif font-semibold text-base tracking-tight text-neutral-900 dark:text-neutral-100">
              ieltsworkbench
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsApiKeyModalOpen(true)}
                title="Gemini API Key Settings"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Key className="w-3.5 h-3.5 text-neutral-500" />
                <span className="hidden sm:inline">{apiKey ? "Custom Key Active" : "API Key"}</span>
              </button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Start Portal */}
        <main className="relative z-10 flex-1 flex flex-col justify-start md:justify-center px-3 sm:px-8 py-4 sm:py-8">
          <StartPage
            onStartWriting={(taskType = "task2") => enterWorkbench("practice", "writing", taskType)}
            onStartSpeaking={() => enterWorkbench("practice", "speaking")}
            onOpenLearn={(subTab) => enterWorkbench("learn", subTab)}
          />
        </main>

        {/* Quiet Minimalist Footnote */}
        <footer className="relative z-10 py-5 text-xs text-neutral-400 dark:text-neutral-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 flex items-center justify-between">
            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="group inline-flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500/80 fill-rose-500/20 group-hover:scale-110 transition-transform" />
              <span>Support me</span>
            </button>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-600">
              Le Tuan Minh K67 FDA NEU
            </span>
          </div>
        </footer>

        {/* API Key Modal on Start Screen */}
        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          onKeySaved={setApiKey}
        />

        {/* Support Modal on Start Screen */}
        <SupportModal
          isOpen={isSupportModalOpen}
          onClose={() => setIsSupportModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* Top Navigation */}
      <Navbar
        activeCategory={category}
        practiceTab={practiceTab}
        learnTab={learnTab}
        onCategoryChange={setCategory}
        onSelectPracticeTab={(tab) => {
          setCategory("practice");
          setPracticeTab(tab);
        }}
        onSelectLearnTab={(tab) => {
          setCategory("learn");
          setLearnTab(tab);
        }}
        onOpenStartPage={() => setHasEntered(false)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasCustomKey={Boolean(apiKey)}
      />

      {/* Minimalist Hero Header with Atmospheric Colored Gradients & Integrated Studio Tabs */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50/35 via-white to-neutral-50/60 dark:from-neutral-950 dark:via-neutral-900/40 dark:to-black transition-all duration-300">
        <Particles
          className="absolute inset-0 pointer-events-none z-0"
          quantity={65}
          ease={70}
          color="#888888"
          size={0.5}
          staticity={35}
        />
        {/* Ambient Colored Radial Glow Backdrops: Red in Light Mode, Emerald/Cyan Aurora in Dark Mode */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[360px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(239,68,68,0.08),rgba(244,63,94,0.04),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(16,185,129,0.12),rgba(6,182,212,0.08),rgba(0,0,0,0))] pointer-events-none -z-0" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-red-500/10 to-transparent dark:from-emerald-500/15 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute top-10 -right-32 w-96 h-96 bg-gradient-to-bl from-rose-500/10 to-transparent dark:from-cyan-500/12 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 pt-5 sm:pt-12">
          <div className="space-y-3.5 sm:space-y-5 pb-5 sm:pb-10">
            {/* Subtle Gradient Metadata Pill (Hidden on mobile to save vertical space) */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-200/60 dark:border-neutral-800/80 bg-gradient-to-r from-red-50/80 via-white to-rose-50/40 dark:from-neutral-900/90 dark:via-neutral-900/60 dark:to-neutral-950 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 dark:from-emerald-400 dark:to-cyan-400 shadow-xs shadow-red-500/40 dark:shadow-emerald-500/50" />
              <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                Cambridge & IDP Assessment Standards • Official Descriptors
              </span>
            </div>

            {/* Primary Headline with Dynamic Text & Description */}
            <div className="max-w-3xl space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-normal tracking-tight font-serif leading-snug sm:leading-[1.15] text-neutral-950 dark:text-white flex flex-wrap items-baseline gap-x-2 sm:gap-x-3">
                <span className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-red-800 dark:from-white dark:via-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                  The IELTS companion for
                </span>
                <DynamicText
                  words={[
                    "Task 2 Essays",
                    "Task 1 Charts",
                    "Speaking Cue Cards",
                    "Cambridge Collocations",
                    "Oxford Lexicon",
                  ]}
                  gradientClassName="from-red-700 via-rose-700 to-red-800 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400"
                />
              </h1>
              <p className="text-xs sm:text-[15px] text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                <span className="sm:hidden">
                  Examiner-calibrated workbench for Writing, Speaking, and Vocabulary.
                </span>
                <span className="hidden sm:inline">
                  An examiner-calibrated workbench for IELTS candidates. Practice Writing with 50 Task 1 visual charts and 100 Task 2 prompts, build Speaking fluency with structured cue cards and native shadowing, and study Cambridge collocations and Oxford 3000/5000 vocabulary.
                </span>
              </p>
            </div>

            {/* Action Buttons: Condensed to 1 primary on mobile, full set on desktop */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-0.5 sm:pt-1">
              <InteractiveHoverButton
                onClick={() => handleStartWriting("task2")}
                className="text-xs font-medium cursor-pointer"
              >
                <span>Start Writing</span>
              </InteractiveHoverButton>

              <ShinyButton
                onClick={handleStartSpeaking}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium cursor-pointer shadow-xs"
              >
                <Mic className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                <span>Simulate Speaking</span>
              </ShinyButton>

              <button
                onClick={() => handleStartWriting("task1_academic")}
                className="group hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors cursor-pointer"
              >
                <BarChart2 className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-colors" />
                <span>50 Task 1 Charts</span>
              </button>

              <button
                onClick={() => handleOpenLearn("rubric")}
                className="group hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-colors" />
                <span>Public Descriptors</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Expansive Container */}
      <main id="diagnostic-studio" className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 xl:px-12 py-6 pb-12">

        {/* Tab Content */}
        {category === "practice" && practiceTab === "writing" && (
          <WritingStudio apiKey={apiKey} initialTaskType={writingTaskType} />
        )}
        {category === "practice" && practiceTab === "speaking" && (
          <SpeakingStudio apiKey={apiKey} />
        )}
        {category === "learn" && learnTab === "collocations" && <CollocationsStudio />}
        {category === "learn" && learnTab === "vocabulary" && <VocabularyStudio />}
        {category === "learn" && learnTab === "rubric" && <RubricViewer />}
      </main>

      {/* Footer: Simple, quiet line */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 bg-transparent mt-12 text-xs text-neutral-400 dark:text-neutral-600">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 xl:px-12 flex items-center justify-between">
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="group inline-flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500/80 fill-rose-500/20 group-hover:scale-110 transition-transform" />
            <span>Support me</span>
          </button>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-500">
            Le Tuan Minh K67 FDA NEU
          </div>
        </div>
      </footer>

      {/* Text Selection Toolbar (Oxford Dictionary + Cursor Highlighter) */}
      <SelectionToolbar />

      {/* API Key Modal for workbench view */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={setApiKey}
      />

      {/* Support Modal for workbench view */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
}
