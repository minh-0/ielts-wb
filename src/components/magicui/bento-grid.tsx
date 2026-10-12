"use client";

import React, { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[20rem] sm:auto-rows-[22rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-6",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  onClick,
}: {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: React.ComponentType<{ className?: string }>;
  description: string;
  href?: string;
  cta?: string;
  onClick?: () => void;
}) => (
  <div
    key={name}
    onClick={onClick}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 select-none",
      // Light mode styling
      "border-neutral-200/80 bg-white/80 backdrop-blur-xs hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-900/5",
      // Dark mode styling
      "transform-gpu dark:border-neutral-800/80 dark:bg-neutral-950/70 dark:hover:border-neutral-700 dark:hover:shadow-2xl dark:hover:shadow-black/70",
      onClick ? "cursor-pointer" : "",
      className,
    )}
  >
    <div className="absolute inset-0 z-0 overflow-hidden">{background}</div>

    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-2 p-6 sm:p-7 transition-all duration-300 group-hover:-translate-y-8 sm:group-hover:-translate-y-10">
      {Icon && (
        <div className="w-11 h-11 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-100/90 dark:bg-neutral-900/90 flex items-center justify-center transform-gpu transition-all duration-300 ease-in-out group-hover:scale-95 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black shadow-xs">
          <Icon className="h-5 w-5 text-neutral-800 dark:text-neutral-200 transition-colors duration-200 group-hover:text-inherit" />
        </div>
      )}
      <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mt-1">
        {name}
      </h3>
      <p className="max-w-md text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
        {description}
      </p>
    </div>

    <div
      className={cn(
        "pointer-events-none z-10 flex w-full translate-y-10 transform-gpu flex-row items-center p-6 sm:p-7 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100 underline-offset-4 group-hover:underline">
        {cta || "Launch studio"}
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </div>

    {/* Subtle interactive hover highlight layer */}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-neutral-900/[0.02] group-hover:dark:bg-white/[0.02]" />
  </div>
);
