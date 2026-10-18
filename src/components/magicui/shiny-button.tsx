"use client";

import React from "react";
import { motion, type MotionProps } from "motion/react";
import { cn } from "@/lib/utils";

const animationProps: MotionProps = {
  initial: { "--x": "100%", scale: 1 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.97 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1.5,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 10,
      mass: 0.5,
    },
  },
};

interface ShinyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps>,
    MotionProps {
  children: React.ReactNode;
  className?: string;
}

export const ShinyButton = React.forwardRef<
  HTMLButtonElement,
  ShinyButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      className={cn(
        "relative cursor-pointer rounded-lg border px-3.5 py-2 font-medium backdrop-blur-xl transition-all duration-300 ease-in-out hover:shadow-xs",
        "border-neutral-200/90 dark:border-neutral-800/90",
        "bg-gradient-to-b from-white to-neutral-50/80 hover:to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 dark:hover:from-neutral-800 dark:hover:to-neutral-900",
        "text-neutral-800 dark:text-neutral-200 text-xs",
        className
      )}
      {...animationProps}
      {...props}
    >
      <span
        className="relative inline-flex items-center gap-2 size-full"
        style={{
          maskImage:
            "linear-gradient(-75deg,rgba(0,0,0,1) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),rgba(0,0,0,1) calc(var(--x) + 100%))",
          WebkitMaskImage:
            "linear-gradient(-75deg,rgba(0,0,0,1) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),rgba(0,0,0,1) calc(var(--x) + 100%))",
        }}
      >
        {children}
      </span>
      <span
        style={{
          mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
          WebkitMask:
            "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
          backgroundImage:
            "linear-gradient(-75deg,rgba(150,150,150,0.1) calc(var(--x)+20%),rgba(150,150,150,0.4) calc(var(--x)+25%),rgba(150,150,150,0.1) calc(var(--x)+100%))",
        }}
        className="absolute inset-0 z-10 block rounded-[inherit] p-px pointer-events-none"
      />
    </motion.button>
  );
});

ShinyButton.displayName = "ShinyButton";
