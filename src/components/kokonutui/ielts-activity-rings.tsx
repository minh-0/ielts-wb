"use client";

import React, { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface CriteriaRingData {
  key: "tr" | "cc" | "lr" | "gra";
  label: string;
  fullName: string;
  score: number;
  maxScore?: number;
  color: string;
  colorEnd: string;
  size: number;
}

export interface IeltsActivityRingsProps {
  overallScore: number;
  taskResponseScore: number;
  coherenceScore: number;
  lexicalScore: number;
  grammarScore: number;
  isTask1?: boolean;
  className?: string;
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

interface SingleRingProps {
  data: CriteriaRingData;
  index: number;
  strokeWidth: number;
  reduceMotion: boolean;
}

function SingleRing({ data, index, strokeWidth, reduceMotion }: SingleRingProps) {
  const radius = (data.size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const max = data.maxScore || 9;
  const percent = Math.min(Math.max(data.score / max, 0), 1);
  const strokeDashoffset = circumference - percent * circumference;

  const gradientId = useId();

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg
        className="-rotate-90"
        height={data.size}
        width={data.size}
        viewBox={`0 0 ${data.size} ${data.size}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={data.color} />
            <stop offset="100%" stopColor={data.colorEnd} />
          </linearGradient>
        </defs>

        {/* Background track circle */}
        <circle
          cx={data.size / 2}
          cy={data.size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-neutral-200/50 dark:text-neutral-800/60"
        />

        {/* Animated score ring */}
        <motion.circle
          cx={data.size / 2}
          cy={data.size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 1.1, delay: index * 0.15, ease: EASE_OUT }
          }
        />
      </svg>
    </div>
  );
}

export function IeltsActivityRings({
  overallScore,
  taskResponseScore,
  coherenceScore,
  lexicalScore,
  grammarScore,
  isTask1 = false,
  className,
}: IeltsActivityRingsProps) {
  const reduceMotion = useReducedMotion() ?? false;

  const rings: CriteriaRingData[] = [
    {
      key: "tr",
      label: isTask1 ? "TA" : "TR",
      fullName: isTask1 ? "Task Achievement" : "Task Response",
      score: taskResponseScore,
      maxScore: 9,
      color: "#F43F5E",
      colorEnd: "#FB7185",
      size: 164,
    },
    {
      key: "cc",
      label: "CC",
      fullName: "Coherence & Cohesion",
      score: coherenceScore,
      maxScore: 9,
      color: "#F59E0B",
      colorEnd: "#FBBF24",
      size: 136,
    },
    {
      key: "lr",
      label: "LR",
      fullName: "Lexical Resource",
      score: lexicalScore,
      maxScore: 9,
      color: "#10B981",
      colorEnd: "#34D399",
      size: 108,
    },
    {
      key: "gra",
      label: "GRA",
      fullName: "Grammatical Range",
      score: grammarScore,
      maxScore: 9,
      color: "#3B82F6",
      colorEnd: "#60A5FA",
      size: 80,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30",
        className
      )}
    >
      {/* Concentric Rings with Overall Score in the Center */}
      <div className="relative shrink-0 w-[164px] h-[164px] flex items-center justify-center">
        {rings.map((ring, idx) => (
          <SingleRing
            key={ring.key}
            data={ring}
            index={idx}
            strokeWidth={10}
            reduceMotion={reduceMotion}
          />
        ))}

        <div className="relative z-10 text-center flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
            Overall
          </span>
          <span className="text-xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-100 leading-none">
            {overallScore.toFixed(1)}
          </span>
          <span className="text-[10px] text-neutral-400">Band</span>
        </div>
      </div>

      {/* 4 Criteria Pills Grid */}
      <div className="flex-1 grid grid-cols-2 gap-2.5 w-full text-xs">
        {rings.map((ring) => (
          <div
            key={ring.key}
            className="p-2.5 rounded-lg border border-neutral-200/70 dark:border-neutral-800/70 bg-white/70 dark:bg-neutral-950/50 space-y-0.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: ring.color }}
                />
                <span>{ring.label}</span>
              </span>
              <span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
                {ring.score.toFixed(1)}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 truncate" title={ring.fullName}>
              {ring.fullName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IeltsActivityRings;
