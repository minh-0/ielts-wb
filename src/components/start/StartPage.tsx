"use client";

import React from "react";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import { NumberTicker } from "@/components/magicui/number-ticker";
import {
  PenTool,
  Mic,
  BookText,
  BookA,
  BarChart2,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
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
    <div className="space-y-10 py-2 sm:py-4 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
            Diagnostic Workbench
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Choose your preparation mode
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-xl">
            Direct access to official Cambridge criteria evaluation, live voice practice, and academic vocabulary suites.
          </p>
        </div>

        {/* Quick Platform Metrics */}
        <div className="flex items-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
          <div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
              <NumberTicker value={150} decimalPlaces={0} />+
            </span>
            <span className="block text-[11px]">Exam Prompts</span>
          </div>
          <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800" />
          <div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
              <NumberTicker value={200} decimalPlaces={0} />+
            </span>
            <span className="block text-[11px]">C1/C2 Collocations</span>
          </div>
          <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800" />
          <div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
              Band 9.0
            </span>
            <span className="block text-[11px]">Descriptor Calibration</span>
          </div>
        </div>
      </div>

      {/* Magic UI Bento Grid */}
      <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* CARD 1: Writing Studio (Hero Card - Spans 2 columns on large screens) */}
        <BentoCard
          name="Writing Studio & Examiner AI"
          className="col-span-1 md:col-span-2 lg:col-span-2"
          Icon={PenTool}
          description="Simulate authentic IELTS Task 1 & Task 2 tests. Evaluates Task Response, Coherence & Cohesion, Lexical Resource, and Grammatical Range with contextual C1/C2 academic upgrades."
          cta="Launch Writing Studio"
          onClick={() => onStartWriting("task2")}
          background={
            <div className="absolute right-0 top-0 w-full h-full pointer-events-none overflow-hidden opacity-40 dark:opacity-30">
              <div className="absolute -right-12 -top-12 w-80 h-80 rounded-full bg-gradient-to-br from-red-500/10 via-rose-500/5 to-transparent blur-2xl" />
              <div className="absolute right-6 top-8 hidden sm:flex flex-col gap-2.5 w-64 p-3.5 border border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                  <span className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">
                    Band 8.0 Evaluated
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    +0.5 Upgrade
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 font-mono space-y-1">
                  <div className="text-emerald-600 dark:text-emerald-400 font-sans">
                    ✓ &ldquo;systematically mitigates&rdquo;
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-sans">
                    ✓ &ldquo;palpable dividends&rdquo;
                  </div>
                  <div className="text-neutral-400 text-[10px]">
                    4 criteria calibrated to Cambridge standards
                  </div>
                </div>
              </div>
            </div>
          }
        />

        {/* CARD 2: Speaking Studio */}
        <BentoCard
          name="Speaking Studio"
          className="col-span-1 md:col-span-1 lg:col-span-1"
          Icon={Mic}
          description="Interactive IELTS Speaking practice across Part 1, Part 2 cue cards, and Part 3 abstract discussions. Features audio playback, time pacing, and targeted fluency guidance."
          cta="Simulate Speaking Test"
          onClick={onStartSpeaking}
          background={
            <div className="absolute right-0 top-0 w-full h-full pointer-events-none overflow-hidden opacity-40 dark:opacity-30">
              <div className="absolute -right-8 -bottom-8 w-60 h-60 rounded-full bg-gradient-to-tl from-sky-500/10 via-indigo-500/5 to-transparent blur-2xl" />
              <div className="absolute right-6 bottom-6 hidden sm:flex items-center gap-1.5">
                {[20, 36, 16, 44, 28, 52, 32, 18].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1 bg-neutral-300 dark:bg-neutral-700"
                  />
                ))}
              </div>
            </div>
          }
        />

        {/* CARD 3: Cambridge Collocations in Use */}
        <BentoCard
          name="High-Yield Collocations"
          className="col-span-1 md:col-span-1 lg:col-span-1"
          Icon={BookText}
          description="Master 200+ authentic C1/C2 collocations from official Cambridge In Use books to systematically boost your Lexical Resource score."
          cta="Browse Collocations"
          onClick={() => onOpenLearn("collocations")}
          background={
            <div className="absolute right-0 top-0 w-full h-full pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
              <div className="absolute right-4 top-8 flex flex-col gap-2">
                <span className="text-[10px] font-mono text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-0.5">
                  formidable barrier
                </span>
                <span className="text-[10px] font-mono text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-0.5">
                  contingent upon
                </span>
                <span className="text-[10px] font-mono text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-0.5">
                  tangible boon
                </span>
              </div>
            </div>
          }
        />

        {/* CARD 4: Oxford 3000/5000 Vocabulary */}
        <BentoCard
          name="Vocabulary Vault"
          className="col-span-1 md:col-span-1 lg:col-span-1"
          Icon={BookA}
          description="Essential academic words classified by CEFR B2 & C1 tiers with phonetic transcriptions, grammatical forms, and exam usage examples."
          cta="Explore Vocabulary"
          onClick={() => onOpenLearn("vocabulary")}
          background={
            <div className="absolute right-0 top-0 w-full h-full pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
              <div className="absolute right-4 bottom-6 flex flex-col gap-1.5 font-mono text-[11px] text-right text-neutral-400">
                <span>/ˌpælpəbəl/ adj.</span>
                <span>/ɪnˈhɪərənt/ adj.</span>
                <span>/ˈmɪtɪɡeɪt/ v.</span>
              </div>
            </div>
          }
        />

        {/* CARD 5: Official Cambridge Public Band Descriptors */}
        <BentoCard
          name="Examiner Rubric & Descriptors"
          className="col-span-1 md:col-span-1 lg:col-span-1"
          Icon={BarChart2}
          description="Inspect official British Council & IDP public scoring descriptors for Band 5.0 through Band 9.0 to understand exactly what examiners reward."
          cta="View Public Rubric"
          onClick={() => onOpenLearn("rubric")}
          background={
            <div className="absolute right-0 top-0 w-full h-full pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
              <div className="absolute right-4 top-8 flex flex-col gap-1.5 text-[10px] font-mono text-neutral-400">
                <span className="border-b border-neutral-200 dark:border-neutral-800 pb-1">
                  Band 9.0: Full Flexibility
                </span>
                <span className="border-b border-neutral-200 dark:border-neutral-800 pb-1">
                  Band 8.0: Rare Inversions
                </span>
                <span>Band 7.0: Extended Ideas</span>
              </div>
            </div>
          }
        />
      </BentoGrid>

      {/* Bottom Features Strip: Unboxed hairline divided row */}
      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 dark:divide-neutral-800 border-y border-neutral-200 dark:border-neutral-800 py-3 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2.5 sm:px-4 py-2 sm:py-0">
            <Award className="w-4 h-4 text-neutral-900 dark:text-neutral-100 shrink-0" />
            <span>Calibrated against authentic Cambridge & IDP criteria</span>
          </div>
          <div className="flex items-center gap-2.5 sm:px-4 py-2 sm:py-0">
            <ShieldCheck className="w-4 h-4 text-neutral-900 dark:text-neutral-100 shrink-0" />
            <span>Zero data retention: completely client-side & private</span>
          </div>
          <div className="flex items-center gap-2.5 sm:px-4 py-2 sm:py-0">
            <Zap className="w-4 h-4 text-neutral-900 dark:text-neutral-100 shrink-0" />
            <span>Instant scoring with progressive C1/C2 syntactic elevators</span>
          </div>
        </div>
      </div>
    </div>
  );
}
