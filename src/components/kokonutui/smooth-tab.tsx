"use client";

import React, { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface SmoothTabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export interface SmoothTabProps<T extends string = string> {
  items: SmoothTabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
  variant?: "underline" | "pill";
  layoutId?: string;
}

export function SmoothTab<T extends string = string>({
  items,
  value,
  onChange,
  className,
  variant = "underline",
  layoutId: customLayoutId,
}: SmoothTabProps<T>) {
  const autoLayoutId = useId();
  const layoutId = customLayoutId || autoLayoutId;
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      role="tablist"
      className={cn(
        "relative flex items-center gap-5 text-xs select-none",
        className
      )}
    >
      {items.map((item) => {
        const isSelected = value === item.id;

        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isSelected}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "relative py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 font-medium outline-none",
              isSelected
                ? "text-neutral-950 dark:text-neutral-50 font-semibold"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            )}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge}

            {/* Underline Indicator with Motion layoutId */}
            {isSelected && variant === "underline" && (
              <motion.div
                layoutId={`${layoutId}-underline`}
                className="absolute -bottom-px left-0 right-0 h-0.5 bg-neutral-900 dark:bg-neutral-100"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 450, damping: 35 }
                }
              />
            )}

            {/* Pill Indicator with Motion layoutId */}
            {isSelected && variant === "pill" && (
              <motion.div
                layoutId={`${layoutId}-pill`}
                className="absolute inset-0 -z-10 rounded-md bg-neutral-100 dark:bg-neutral-900"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 450, damping: 35 }
                }
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default SmoothTab;
