"use client";

import React from "react";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import {
  PenTool,
  Mic,
  BookText,
  BookA,
  BarChart2,
} from "lucide-react";
import { TaskType } from "@/types/ielts";

interface StartPageProps {
  onStartWriting: (taskType?: TaskType) => void;
  onStartSpeaking: () => void;
  onOpenLearn: (subTab: "collocations" | "vocabulary" | "rubric") => void;
}

export function StartPage({
  onStartWriting,
  onStartSpeaking,
  onOpenLearn,
}: StartPageProps) {
  return (
    <div className="space-y-8 py-4 sm:py-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Ultra-Minimalist Editorial Header */}
      <div className="space-y-2 pb-5 border-b border-neutral-200 dark:border-neutral-800">
        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          First-Time Entrance
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-neutral-900 dark:text-neutral-100">
          Select your preparation mode
        </h2>
        <p className="text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400 max-w-lg leading-relaxed">
          Choose a starting tool to enter the diagnostic workbench. This guide is only shown once on your first visit.
        </p>
      </div>

      {/* Ultra-Minimalist Bento Grid */}
      <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* CARD 1: Writing Studio (Spans 2 columns on desktop) */}
        <BentoCard
          name="Writing Studio"
          className="col-span-1 md:col-span-2 lg:col-span-2"
          Icon={PenTool}
          description="Simulate authentic IELTS Task 1 & Task 2 tests. Instant evaluation of Task Response, Cohesion, Lexical Resource, and Grammatical Range with contextual C1/C2 upgrades."
          cta="Launch Writing Studio"
          onClick={() => onStartWriting("task2")}
        />

        {/* CARD 2: Speaking Studio */}
        <BentoCard
          name="Speaking Studio"
          className="col-span-1 md:col-span-1 lg:col-span-1"
          Icon={Mic}
          description="Part 2 cue card practice with a 2-minute pacer, 1-minute prep planner, and Band 9 shadowing gym."
          cta="Launch Speaking Studio"
          onClick={onStartSpeaking}
        />

        {/* CARD 3: Cambridge Collocations in Use */}
        <BentoCard
          name="High-Yield Collocations"
          className="col-span-1 md:col-span-1 lg:col-span-1"
          Icon={BookText}
          description="500+ authentic C1/C2 collocations from official Cambridge In Use books to systematically boost your Lexical Resource score."
          cta="Browse Collocations"
          onClick={() => onOpenLearn("collocations")}
        />

        {/* CARD 4: Oxford 3000/5000 Vocabulary */}
        <BentoCard
          name="Vocabulary Vault"
          className="col-span-1 md:col-span-1 lg:col-span-1"
          Icon={BookA}
          description="Essential academic headwords classified by CEFR B2 & C1 tiers with phonetic transcriptions and exam context."
          cta="Explore Vocabulary"
          onClick={() => onOpenLearn("vocabulary")}
        />

        {/* CARD 5: Official Cambridge Public Band Descriptors */}
        <BentoCard
          name="Examiner Rubric & Descriptors"
          className="col-span-1 md:col-span-1 lg:col-span-1"
          Icon={BarChart2}
          description="Inspect official British Council & IDP public scoring descriptors for Band 5.0 through Band 9.0."
          cta="View Public Rubric"
          onClick={() => onOpenLearn("rubric")}
        />
      </BentoGrid>

      {/* Quiet Minimalist Footnote */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
        <span>British Council & IDP criteria calibration</span>
        <span>100% client-side • Zero data retention</span>
      </div>
    </div>
  );
}
