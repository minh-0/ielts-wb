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
    <div className="space-y-5 sm:space-y-8 py-1 sm:py-2 animate-in fade-in duration-300 max-w-4xl mx-auto w-full">
      {/* Super Short Big Welcome Message */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal tracking-tight text-neutral-900 dark:text-neutral-100">
          Welcome.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500">
          Choose a studio to begin.
        </p>
      </div>

      {/* Minimalist Bento Grid with Rounded Boxes */}
      <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* CARD 1: Writing Studio (spans 2 cols on tablet/desktop) */}
        <BentoCard
          name="Writing Studio"
          className="col-span-1 md:col-span-2"
          Icon={PenTool}
          description="Task 1 & Task 2 practice with instant examiner scoring and Band 8.0+ lexical upgrades."
          cta="Enter Writing"
          onClick={() => onStartWriting("task2")}
        />

        {/* CARD 2: Speaking Studio */}
        <BentoCard
          name="Speaking Studio"
          className="col-span-1 md:col-span-1 lg:col-span-1"
          Icon={Mic}
          description="Part 2 cue cards, 2-minute pacer, and Band 9 shadowing."
          cta="Enter Speaking"
          onClick={onStartSpeaking}
        />

        {/* CARD 3: Collocations */}
        <BentoCard
          name="Collocations"
          className="col-span-1 md:col-span-1 lg:col-span-1"
          Icon={BookText}
          description="500+ advanced academic collocations from official Cambridge In Use books."
          cta="Browse Collocations"
          onClick={() => onOpenLearn("collocations")}
        />

        {/* CARD 4: Vocabulary */}
        <BentoCard
          name="Vocabulary"
          className="col-span-1 md:col-span-1 lg:col-span-1"
          Icon={BookA}
          description="Oxford 3000 & 5000 academic headwords classified by CEFR tier."
          cta="Explore Vocabulary"
          onClick={() => onOpenLearn("vocabulary")}
        />

        {/* CARD 5: Band Descriptors */}
        <BentoCard
          name="Band Descriptors"
          className="col-span-1 md:col-span-1 lg:col-span-1"
          Icon={BarChart2}
          description="Official British Council & IDP public scoring criteria."
          cta="View Rubric"
          onClick={() => onOpenLearn("rubric")}
        />
      </BentoGrid>
    </div>
  );
}
