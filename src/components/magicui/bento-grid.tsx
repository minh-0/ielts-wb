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
      "group relative col-span-3 flex flex-col justify-between overflow-hidden border transition-colors duration-200 select-none",
      // Editorial hairline styling
      "border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-950/40 hover:border-neutral-400 dark:hover:border-neutral-600",
      onClick ? "cursor-pointer" : "",
      className,
    )}
  >
    <div className="absolute inset-0 z-0 overflow-hidden">{background}</div>

    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-2.5 p-6 sm:p-7 transition-all duration-300 group-hover:-translate-y-7 sm:group-hover:-translate-y-8">
      {Icon && (
        <div className="w-9 h-9 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center bg-transparent transition-colors duration-200 group-hover:border-neutral-900 dark:group-hover:border-neutral-100">
          <Icon className="h-4.5 w-4.5 text-neutral-800 dark:text-neutral-200" />
        </div>
      )}
      <h3 className="text-lg font-serif font-normal tracking-tight text-neutral-900 dark:text-neutral-100 mt-0.5">
        {name}
      </h3>
      <p className="max-w-md text-xs sm:text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
        {description}
      </p>
    </div>

    <div
      className={cn(
        "pointer-events-none z-10 flex w-full translate-y-8 transform-gpu flex-row items-center p-6 sm:p-7 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100 border-b border-neutral-900 dark:border-neutral-100 pb-0.5">
        {cta || "Launch studio"}
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </div>

    {/* Subtle interactive hover highlight layer */}
    <div className="pointer-events-none absolute inset-0 transition-opacity duration-200 group-hover:bg-neutral-900/[0.015] group-hover:dark:bg-white/[0.015]" />
  </div>
);
