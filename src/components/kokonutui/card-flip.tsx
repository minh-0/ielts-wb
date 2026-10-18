"use client";

import React, { useState } from "react";
import { Volume2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CollocationCardFlipProps {
  category: string;
  basicPhrase: string;
  upgradedCollocation: string;
  registerLevel: string;
  definition: string;
  exampleSentence: string;
  onPlayAudio?: () => void;
  className?: string;
}

export function CardFlip({
  category,
  basicPhrase,
  upgradedCollocation,
  registerLevel,
  definition,
  exampleSentence,
  onPlayAudio,
  className,
}: CollocationCardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      className={cn(
        "group relative min-h-[220px] w-full max-w-xl mx-auto cursor-pointer select-none [perspective:1400px]",
        className
      )}
    >
      <div
        className={cn(
          "relative h-full w-full min-h-[220px] rounded-xl transition-transform duration-200 ease-out [transform-style:preserve-3d]",
          isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
        )}
      >
        {/* FRONT FACE (Candidate Cliché) */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full rounded-xl p-6 sm:p-7 flex flex-col justify-between",
            "border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors",
            "[backface-visibility:hidden]"
          )}
        >
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium text-neutral-500 dark:text-neutral-400">
              {category}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
              <RotateCcw className="w-3 h-3" />
              <span>Tap to flip</span>
            </span>
          </div>

          <div className="text-center py-4 space-y-1.5">
            <span className="text-xs text-neutral-400 block font-sans">
              Common Candidate Cliché:
            </span>
            <div className="text-xl sm:text-2xl font-serif text-neutral-900 dark:text-neutral-100">
              &ldquo;{basicPhrase}&rdquo;
            </div>
            <span className="text-xs text-neutral-400 block pt-1 font-sans">
              (Tap to reveal Band 8+ upgrade)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-900">
            <span>Basic Phrase</span>
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">Click card</span>
          </div>
        </div>

        {/* BACK FACE (Band 8+ Collocation Upgrade) */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full rounded-xl p-6 sm:p-7 flex flex-col justify-between",
            "border border-emerald-500/40 dark:border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20",
            "[transform:rotateY(180deg)] [backface-visibility:hidden]"
          )}
        >
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
              {registerLevel} Spoken Upgrade
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
              <RotateCcw className="w-3 h-3" />
              <span>Tap to flip</span>
            </span>
          </div>

          <div className="text-center py-2 space-y-1.5">
            <div className="text-xl sm:text-2xl font-serif font-medium text-emerald-800 dark:text-emerald-200">
              &ldquo;{upgradedCollocation}&rdquo;
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
              {definition}
            </p>
            <p className="text-xs italic font-serif text-neutral-800 dark:text-neutral-200 pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
              &ldquo;{exampleSentence}&rdquo;
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50">
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">Band 8.5+ Precision</span>
            {onPlayAudio && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayAudio();
                }}
                className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-medium hover:underline cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear in sentence</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface FlipCard3DProps {
  isFlipped: boolean;
  onFlip?: () => void;
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  frontClassName?: string;
  backClassName?: string;
  minHeight?: string;
}

export function FlipCard3D({
  isFlipped,
  onFlip,
  front,
  back,
  className,
  frontClassName,
  backClassName,
  minHeight = "min-h-[280px]",
}: FlipCard3DProps) {
  return (
    <div
      onClick={onFlip}
      className={cn(
        "group relative w-full cursor-pointer select-none [perspective:1400px]",
        minHeight,
        className
      )}
    >
      <div
        className={cn(
          "relative h-full w-full rounded-2xl transition-transform duration-200 ease-out [transform-style:preserve-3d]",
          minHeight,
          isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
        )}
      >
        {/* FRONT FACE */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full rounded-2xl [backface-visibility:hidden] flex flex-col justify-between",
            "border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950",
            "hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-xs p-6 sm:p-8",
            frontClassName
          )}
        >
          {front}
        </div>

        {/* BACK FACE */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full rounded-2xl [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-between",
            "border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950",
            "hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-xs p-6 sm:p-8",
            backClassName
          )}
        >
          {back}
        </div>
      </div>
    </div>
  );
}

export default CardFlip;
