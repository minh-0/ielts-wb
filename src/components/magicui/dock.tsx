"use client";

import React, { createContext, useContext, useRef } from "react";
import {
  motion,
  type MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface DockProps {
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  iconDistance?: number;
  direction?: "top" | "middle" | "bottom";
  children: React.ReactNode;
}

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 58;
const DEFAULT_DISTANCE = 130;

interface DockContextType {
  mouseX: MotionValue<number>;
  iconSize: number;
  iconMagnification: number;
  iconDistance: number;
}

const DockContext = createContext<DockContextType | null>(null);

export function Dock({
  children,
  className,
  iconSize = DEFAULT_SIZE,
  iconMagnification = DEFAULT_MAGNIFICATION,
  iconDistance = DEFAULT_DISTANCE,
  direction = "middle",
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <DockContext.Provider
      value={{ mouseX, iconSize, iconMagnification, iconDistance }}
    >
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        onTouchMove={(e) => {
          if (e.touches[0]) mouseX.set(e.touches[0].clientX);
        }}
        onTouchEnd={() => mouseX.set(Infinity)}
        className={cn(
          "mx-auto flex h-14 sm:h-16 items-center gap-1 sm:gap-2 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/85 dark:bg-neutral-950/85 px-2 sm:px-3 backdrop-blur-xl shadow-xl shadow-black/8 dark:shadow-black/50 select-none",
          {
            "items-start": direction === "top",
            "items-center": direction === "middle",
            "items-end": direction === "bottom",
          },
          className,
        )}
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  );
}

export interface DockIconProps {
  size?: number;
  magnification?: number;
  distance?: number;
  mouseX?: MotionValue<number>;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  title?: string;
  isActive?: boolean;
}

export function DockIcon({
  size,
  magnification,
  distance,
  mouseX: customMouseX,
  className,
  children,
  onClick,
  title,
  isActive = false,
}: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const context = useContext(DockContext);

  const effectiveMouseX = customMouseX ?? context?.mouseX;
  const effectiveSize = size ?? context?.iconSize ?? DEFAULT_SIZE;
  const effectiveMagnification =
    magnification ?? context?.iconMagnification ?? DEFAULT_MAGNIFICATION;
  const effectiveDistance =
    distance ?? context?.iconDistance ?? DEFAULT_DISTANCE;

  const fallbackMouseX = useMotionValue(Infinity);
  const mouseX = effectiveMouseX ?? fallbackMouseX;

  const distanceCalculated = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distanceCalculated,
    [-effectiveDistance, 0, effectiveDistance],
    [effectiveSize, effectiveMagnification, effectiveSize],
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 160,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onClick={onClick}
      className={cn(
        "flex aspect-square shrink-0 cursor-pointer items-center justify-center rounded-xl relative group transition-colors",
        isActive
          ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 font-medium"
          : "hover:bg-neutral-100/70 dark:hover:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100",
        className,
      )}
    >
      {/* Tooltip on hover */}
      {title && (
        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 dark:bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-white dark:text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md z-30">
          {title}
        </span>
      )}

      {children}

      {/* Active running indicator dot */}
      {isActive && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neutral-900 dark:bg-neutral-100 transition-transform" />
      )}
    </motion.div>
  );
}
