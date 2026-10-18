import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function InteractiveHoverButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-lg border border-neutral-200/90 dark:border-neutral-800/90 bg-white dark:bg-neutral-900 px-3.5 py-2 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-all",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-emerald-400 transition-all duration-300 group-hover:scale-[35]" />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-1.5 text-white dark:text-neutral-950 opacity-0 transition-all duration-300 group-hover:-translate-x-4 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </button>
  );
}
