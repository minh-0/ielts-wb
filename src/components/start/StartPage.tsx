"use client";

import React from "react";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";
import {
  PenTool,
  Mic,
  BookText,
  BookA,
  BarChart2,
  Sparkles,
  CheckCircle2,
  Volume2,
} from "lucide-react";
import { TaskType } from "@/types/ielts";

interface StartPageProps {
  onStartWriting: (taskType?: TaskType) => void;
  onStartSpeaking: () => void;
  onOpenLearn: (subTab: "collocations" | "vocabulary" | "rubric") => void;
}

const COLLOCATIONS_ROW_1 = [
  { phrase: "profound impact", type: "Verb + Noun", band: "8.5" },
  { phrase: "substantially increase", type: "Adv + Verb", band: "8.0" },
  { phrase: "bear resemblance", type: "Idiomatic", band: "9.0" },
  { phrase: "spark controversy", type: "Topic Phrasal", band: "8.0" },
  { phrase: "compelling evidence", type: "Adj + Noun", band: "8.5" },
];

const COLLOCATIONS_ROW_2 = [
  { phrase: "striking contrast", type: "Adj + Noun", band: "8.5" },
  { phrase: "gravely concerned", type: "Adv + Adj", band: "9.0" },
  { phrase: "incur expenditure", type: "Formal Academic", band: "8.5" },
  { phrase: "mitigate adverse effects", type: "Verb + Noun", band: "9.0" },
  { phrase: "heavily reliant", type: "Adv + Adj", band: "8.0" },
];

const VOCAB_ROW_1 = [
  { word: "exacerbate", level: "C1", def: "make a problem worse" },
  { word: "ubiquitous", level: "C2", def: "present everywhere" },
  { word: "mitigate", level: "C1", def: "make less severe" },
  { word: "paradigm", level: "C2", def: "a typical pattern" },
  { word: "salient", level: "C1", def: "most noticeable" },
];

const VOCAB_ROW_2 = [
  { word: "detrimental", level: "B2", def: "tending to cause harm" },
  { word: "plausible", level: "B2", def: "reasonable or probable" },
  { word: "scrutinize", level: "C1", def: "examine closely" },
  { word: "ambiguity", level: "C1", def: "uncertainty of meaning" },
  { word: "exponential", level: "C2", def: "rapidly accelerating" },
];

export function StartPage({
  onStartWriting,
  onStartSpeaking,
  onOpenLearn,
}: StartPageProps) {
  return (
    <div className="space-y-6 sm:space-y-8 py-2 sm:py-4 animate-in fade-in duration-300 max-w-5xl mx-auto w-full">
      {/* Super Clean Big Welcome Heading */}
      <div className="space-y-1.5">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal tracking-tight text-neutral-900 dark:text-neutral-100">
          Welcome.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500">
          Examiner-calibrated IELTS workbench. Choose a studio to begin.
        </p>
      </div>

      {/* Magic UI Bento Grid */}
      <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* CARD 1: Writing Studio (spans 2 cols on desktop) */}
        <BentoCard
          name="Writing Studio"
          className="col-span-1 md:col-span-2 lg:col-span-2 min-h-[19rem] sm:min-h-[22rem]"
          Icon={PenTool}
          description="Task 1 visual charts & Task 2 essays with instant British Council rubric scoring and Band 8.5+ lexical suggestions."
          cta="Launch Writing Workbench"
          badge="Task 1 & Task 2"
          onClick={() => onStartWriting("task2")}
          background={
            <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-end [mask-image:linear-gradient(to_top,transparent_10%,#000_85%)] opacity-35 dark:opacity-25 group-hover:opacity-70 dark:group-hover:opacity-55 transition-all duration-500 scale-[0.98] group-hover:scale-100">
              <div className="rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/90 p-4 shadow-sm space-y-3">
                {/* Simulated Header Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/80 text-[11px]">
                  <span className="font-mono text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    284 Words • 38:12 Left
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-[10px]">
                    Band 8.5 Predicted
                  </span>
                </div>

                {/* Simulated Paragraph with lexical upgrades */}
                <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 font-serif">
                  The <span className="bg-red-500/15 dark:bg-emerald-400/20 text-red-900 dark:text-emerald-200 px-1 py-0.5 rounded font-mono text-[11px]">unprecedented surge</span> in urban density has necessitated a <span className="bg-red-500/15 dark:bg-emerald-400/20 text-red-900 dark:text-emerald-200 px-1 py-0.5 rounded font-mono text-[11px]">profound re-evaluation</span> of transport networks, thereby mitigating long-term ecological strain.
                </p>

                {/* Score breakdown metrics */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { label: "TR", score: "8.5" },
                    { label: "CC", score: "8.0" },
                    { label: "LR", score: "9.0" },
                    { label: "GRA", score: "8.5" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg bg-neutral-50 dark:bg-neutral-900/80 p-1.5 text-center border border-neutral-200/50 dark:border-neutral-800/60"
                    >
                      <div className="text-[9px] text-neutral-400 font-medium">{item.label}</div>
                      <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 font-mono">
                        {item.score}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        />

        {/* CARD 2: Speaking Studio */}
        <BentoCard
          name="Speaking Studio"
          className="col-span-1 md:col-span-1 lg:col-span-1 min-h-[19rem] sm:min-h-[22rem]"
          Icon={Mic}
          description="Part 2 cue cards, 2-minute pacer, and Cambridge Band 9 native audio shadowing."
          cta="Start Speaking Practice"
          badge="Real Cambridge Tests"
          onClick={onStartSpeaking}
          background={
            <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end [mask-image:linear-gradient(to_top,transparent_15%,#000_85%)] opacity-40 dark:opacity-25 group-hover:opacity-75 dark:group-hover:opacity-60 transition-all duration-500">
              <div className="rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/90 p-3.5 shadow-sm space-y-3">
                {/* Audio Status Pill */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 font-mono text-[10px]">
                    <Volume2 className="w-3 h-3 text-red-500 dark:text-emerald-400 animate-pulse" />
                    Part 2 • 2:00 Pacer
                  </span>
                  <span className="font-mono text-[10px] text-neutral-400">Band 9 Audio</span>
                </div>

                {/* Animated Soundwave Visualizer Bars */}
                <div className="h-10 flex items-center justify-center gap-1.5 px-2">
                  {[24, 38, 18, 44, 28, 12, 34, 46, 22, 36, 16, 40, 26, 14, 32].map((height, idx) => (
                    <span
                      key={idx}
                      className="w-1 bg-gradient-to-t from-red-600 to-rose-400 dark:from-emerald-500 dark:to-cyan-400 rounded-full animate-soundwave"
                      style={{
                        height: `${height}px`,
                        animationDelay: `${idx * 0.08}s`,
                        animationDuration: `${0.9 + (idx % 4) * 0.2}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Shadowing prompt badge */}
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900 rounded-md p-1.5 text-center truncate font-mono">
                  &ldquo;Describe an environmental initiative...&rdquo;
                </div>
              </div>
            </div>
          }
        />

        {/* CARD 3: Collocations */}
        <BentoCard
          name="Collocations"
          className="col-span-1 md:col-span-1 lg:col-span-1 min-h-[19rem] sm:min-h-[22rem]"
          Icon={BookText}
          description="500+ advanced academic collocations categorized by Band 7.5 to 9.0 usage."
          cta="Browse Collocations"
          badge="Cambridge In Use"
          onClick={() => onOpenLearn("collocations")}
          background={
            <div className="absolute inset-0 flex flex-col justify-end pb-3 [mask-image:linear-gradient(to_top,transparent_20%,#000_85%)] opacity-45 dark:opacity-30 group-hover:opacity-85 dark:group-hover:opacity-75 transition-all duration-500">
              <Marquee pauseOnHover className="[--duration:26s] [--gap:0.5rem] py-1">
                {COLLOCATIONS_ROW_1.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 shadow-2xs whitespace-nowrap"
                  >
                    <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 font-serif">
                      {item.phrase}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                      Band {item.band}
                    </span>
                  </div>
                ))}
              </Marquee>

              <Marquee reverse pauseOnHover className="[--duration:30s] [--gap:0.5rem] py-1">
                {COLLOCATIONS_ROW_2.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 shadow-2xs whitespace-nowrap"
                  >
                    <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 font-serif">
                      {item.phrase}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-red-50 dark:bg-emerald-950/40 text-red-700 dark:text-emerald-400 font-mono">
                      {item.type}
                    </span>
                  </div>
                ))}
              </Marquee>
            </div>
          }
        />

        {/* CARD 4: Vocabulary */}
        <BentoCard
          name="Vocabulary"
          className="col-span-1 md:col-span-1 lg:col-span-1 min-h-[19rem] sm:min-h-[22rem]"
          Icon={BookA}
          description="Oxford 3000 & 5000 academic headwords classified by CEFR tier (B2, C1, C2)."
          cta="Explore Vocabulary"
          badge="Oxford 3000/5000"
          onClick={() => onOpenLearn("vocabulary")}
          background={
            <div className="absolute inset-0 flex flex-col justify-end pb-3 [mask-image:linear-gradient(to_top,transparent_20%,#000_85%)] opacity-45 dark:opacity-30 group-hover:opacity-85 dark:group-hover:opacity-75 transition-all duration-500">
              <Marquee pauseOnHover className="[--duration:24s] [--gap:0.5rem] py-1">
                {VOCAB_ROW_1.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 shadow-2xs whitespace-nowrap"
                  >
                    <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 font-serif">
                      {item.word}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1 py-0.2 rounded font-semibold ${
                        item.level === "C2"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                      }`}
                    >
                      {item.level}
                    </span>
                  </div>
                ))}
              </Marquee>

              <Marquee reverse pauseOnHover className="[--duration:28s] [--gap:0.5rem] py-1">
                {VOCAB_ROW_2.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 shadow-2xs whitespace-nowrap"
                  >
                    <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 font-serif">
                      {item.word}
                    </span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                      {item.level}
                    </span>
                  </div>
                ))}
              </Marquee>
            </div>
          }
        />

        {/* CARD 5: Band Descriptors */}
        <BentoCard
          name="Band Descriptors"
          className="col-span-1 md:col-span-1 lg:col-span-1 min-h-[19rem] sm:min-h-[22rem]"
          Icon={BarChart2}
          description="Official British Council & IDP public scoring descriptors for Writing and Speaking."
          cta="View Official Descriptors"
          badge="Official Rubric"
          onClick={() => onOpenLearn("rubric")}
          background={
            <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end [mask-image:linear-gradient(to_top,transparent_15%,#000_85%)] opacity-40 dark:opacity-25 group-hover:opacity-75 dark:group-hover:opacity-60 transition-all duration-500">
              <div className="rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/90 p-3.5 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono text-neutral-500 dark:text-neutral-400">Public Descriptors</span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Band 7.0 – 9.0</span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  {[
                    { label: "TR", desc: "Fully addresses all parts of prompt" },
                    { label: "CC", desc: "Sequences information coherently" },
                    { label: "LR", desc: "Wide vocabulary, rare inaccuracies" },
                    { label: "GRA", desc: "Full flexibility & structural range" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-[9px] w-6 shrink-0 text-red-700 dark:text-emerald-400">
                        {row.label}
                      </span>
                      <span className="truncate text-neutral-500 dark:text-neutral-400 text-[10px]">
                        {row.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        />
      </BentoGrid>
    </div>
  );
}
