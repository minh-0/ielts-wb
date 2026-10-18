"use client";

import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: React.ComponentType<{ className?: string }>;
  description: string;
  href?: string;
  cta?: string;
  badge?: string;
  onClick?: () => void;
}

export const BentoGrid = ({
  children,
  className,
  ...props
}: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[20rem] sm:auto-rows-[22rem] lg:auto-rows-[23rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4",
        className
      )}
      {...props}
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
  cta = "Enter",
  badge,
  onClick,
  ...props
}: BentoCardProps) => {
  return (
    <div
      key={name}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl select-none text-left w-full",
        // Magic UI signature light depth
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.04),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.04)]",
        // Magic UI signature dark depth & inset glow
        "dark:bg-neutral-900/40 transform-gpu dark:[box-shadow:0_-20px_80px_-20px_#ffffff14_inset] dark:border dark:border-white/10",
        // Interactive styling
        onClick ? "cursor-pointer active:scale-[0.99] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600" : "",
        className
      )}
      {...props}
    >
      {/* Background illustration layer at top */}
      {background && (
        <div className="absolute inset-x-0 top-0 h-[58%] sm:h-[62%] pointer-events-none overflow-hidden">
          {background}
        </div>
      )}

      {/* Top right pill badge if supplied */}
      {badge && (
        <div className="absolute top-4 right-4 z-20 pointer-events-none">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-tight bg-white/90 dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/80 text-neutral-600 dark:text-neutral-300 backdrop-blur-xs shadow-2xs">
            {badge}
          </span>
        </div>
      )}

      {/* Empty top flex spacer to naturally anchor the text and icon to the bottom */}
      <div className="pointer-events-none flex-1 min-h-[6rem] sm:min-h-[7rem]" />

      {/* Bottom Content block: Icon, Title, Description moved down */}
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-5 sm:p-6 transition-all duration-300 lg:group-hover:-translate-y-10">
        {Icon && (
          <Icon className="h-9 w-9 origin-left transform-gpu text-neutral-800 dark:text-neutral-200 transition-all duration-300 ease-in-out group-hover:scale-75 mb-1" />
        )}
        <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {name}
        </h3>
        <p className="max-w-md text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Desktop Sliding Action CTA: hidden at rest, slides up and fades in on hover at bottom */}
      <div
        className={cn(
          "pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center px-6 pb-5 pt-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex"
        )}
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-red-700 dark:group-hover:text-emerald-400 transition-colors">
          {cta}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>

      {/* Subtle hover backdrop wash */}
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[0.02] group-hover:dark:bg-white/[0.03]" />
    </div>
  );
};
