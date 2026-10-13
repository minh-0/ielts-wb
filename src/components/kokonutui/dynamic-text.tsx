"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface DynamicTextProps {
  words?: string[];
  interval?: number;
  className?: string;
  gradientClassName?: string;
  prefix?: string;
}

const DEFAULT_WORDS = [
  "Task 2 Essays",
  "Task 1 Charts",
  "Part 2 Cue Cards",
  "Cambridge Collocations",
  "Oxford 3000/5000 Words",
];

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export function DynamicText({
  words = DEFAULT_WORDS,
  interval = 2600,
  className,
  gradientClassName,
  prefix,
}: DynamicTextProps) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (words.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  const currentWord = words[index] || words[0];

  return (
    <span className={cn("inline-flex items-baseline gap-1.5 align-baseline", className)}>
      {prefix && <span>{prefix}</span>}
      <span className="relative inline-block overflow-hidden align-baseline min-w-[170px] sm:min-w-[240px] text-left">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={index}
            initial={shouldReduceMotion ? { opacity: 0 } : { y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { y: -18, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className={cn(
              "inline-block whitespace-nowrap bg-gradient-to-r from-red-700 via-rose-700 to-red-800 dark:from-rose-300 dark:via-red-300 dark:to-rose-200 bg-clip-text text-transparent font-serif",
              gradientClassName
            )}
          >
            {currentWord}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

export default DynamicText;
