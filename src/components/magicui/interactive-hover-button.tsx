import React from "react";
import { PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  Icon?: React.ComponentType<{ className?: string }>;
}

export function InteractiveHoverButton({
  children,
  className,
  Icon = PenTool,
  ...props
}: InteractiveHoverButtonProps) {
  return (
    <button
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-lg border border-neutral-200/90 dark:border-neutral-800/90 bg-white dark:bg-neutral-900 px-3.5 py-2 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-all shadow-xs",
        className
      )}
      {...props}
    >
      {/* Expanding radial flood origin: blossoms smoothly outward from the pen icon position on hover */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-neutral-900 dark:bg-neutral-100 transition-transform duration-500 ease-out scale-0 group-hover:scale-[100] pointer-events-none" />

      {/* Layer 1: Rest state with pen icon and text */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 transition-all duration-300 group-hover:translate-x-8 group-hover:opacity-0">
        {Icon && (
          <Icon className="w-3.5 h-3.5 shrink-0 text-neutral-500 dark:text-neutral-400 group-hover:text-white dark:group-hover:text-neutral-950 transition-colors" />
        )}
        <span className="inline-flex items-center gap-1.5">{children}</span>
      </div>

      {/* Layer 2: Hovered state with pen icon and text sliding in with inverted contrast */}
      <div className="absolute inset-0 z-20 flex items-center justify-center gap-1.5 text-white dark:text-neutral-950 -translate-x-8 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 font-medium">
        {Icon && (
          <Icon className="w-3.5 h-3.5 shrink-0 text-white dark:text-neutral-950" />
        )}
        <span className="inline-flex items-center gap-1.5">{children}</span>
      </div>
    </button>
  );
}
