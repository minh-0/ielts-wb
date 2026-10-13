"use client";

import React, {
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ParticleButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  onSuccess?: () => void;
  successDuration?: number;
  icon?: ReactNode;
}

interface Particle {
  x: number;
  y: number;
  color?: string;
}

interface Burst {
  id: number;
  particles: Particle[];
}

const PARTICLE_COUNT = 8;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const PARTICLE_COLORS = [
  "bg-red-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-rose-500",
];

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    x: (i % 2 === 0 ? 1 : -1) * (Math.random() * 45 + 16),
    y: -(Math.random() * 40 + 18),
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
  }));
}

function SuccessParticles({ particles }: { particles: Particle[] }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-visible"
    >
      {particles.map((particle, i) => (
        <motion.span
          key={i}
          animate={{
            opacity: [1, 1, 0],
            scale: [0.5, 1.2, 0.4],
            x: particle.x,
            y: particle.y,
          }}
          className={cn(
            "absolute top-0 left-1/2 -mt-0.5 -ml-0.5 size-1.5 rounded-full",
            particle.color || "bg-neutral-900 dark:bg-neutral-100"
          )}
          initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
          transition={{
            duration: 0.5,
            delay: i * 0.02,
            ease: EASE_OUT,
          }}
        />
      ))}
    </span>
  );
}

export function ParticleButton({
  children,
  onClick,
  onSuccess,
  successDuration = 650,
  icon,
  className,
  disabled,
  ...props
}: ParticleButtonProps) {
  const [burst, setBurst] = useState<Burst | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const burstIdRef = useRef(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || disabled) {
      return;
    }

    if (!shouldReduceMotion) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      burstIdRef.current += 1;
      setBurst({ id: burstIdRef.current, particles: createParticles() });
      timeoutRef.current = setTimeout(() => {
        setBurst(null);
        timeoutRef.current = null;
      }, successDuration);
    }

    onSuccess?.();
  };

  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center gap-2 cursor-pointer select-none",
        "transition-[scale,background-color,color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      disabled={disabled}
      onClick={handleClick}
      type="button"
      {...props}
    >
      {burst && <SuccessParticles key={burst.id} particles={burst.particles} />}
      {children}
      {icon}
    </button>
  );
}

export default ParticleButton;
