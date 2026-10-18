import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type FC,
} from "react";
import { cn } from "@/lib/utils";

export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400",
        // Shine effect
        "animate-shiny-text bg-clip-text [background-size:var(--shiny-width)_100%] bg-no-repeat",
        // Shine gradient
        "bg-gradient-to-r from-transparent via-neutral-900 via-50% to-transparent dark:via-neutral-100",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
