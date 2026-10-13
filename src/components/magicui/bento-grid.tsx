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
        "grid w-full auto-rows-[13rem] sm:auto-rows-[14rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4",
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
      "border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 backdrop-blur-xs hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 shadow-2xs",
      onClick ? "cursor-pointer" : "",
      className,
    )}
  >
    {background && <div className="absolute inset-0 z-0 overflow-hidden">{background}</div>}

    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-2.5 p-6 transition-all duration-300 group-hover:-translate-y-4">
      {Icon && (
        <div className="w-9 h-9 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-center bg-white dark:bg-neutral-900 transition-colors duration-300 group-hover:border-neutral-400 dark:group-hover:border-neutral-600">
          <Icon className="h-4 w-4 text-neutral-800 dark:text-neutral-200" />
        </div>
      )}
      <h3 className="text-lg font-serif font-normal tracking-tight text-neutral-900 dark:text-neutral-100 mt-0.5">
        {name}
      </h3>
      <p className="max-w-md text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
        {description}
      </p>
    </div>

    <div
      className={cn(
        "pointer-events-none z-10 flex w-full translate-y-6 transform-gpu flex-row items-center px-6 pb-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-900 dark:text-neutral-100">
        {cta || "Enter"}
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </div>
  </div>
);
