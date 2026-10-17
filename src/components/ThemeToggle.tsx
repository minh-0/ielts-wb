"use client";

import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "./magicui/animated-theme-toggler";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const initial = saved || "dark";
    setTheme(initial);
    if (initial === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-transparent" />
    );
  }

  return (
    <AnimatedThemeToggler
      theme={theme}
      onThemeChange={(nextTheme) => {
        setTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
      }}
      variant="circle"
      duration={450}
      className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    />
  );
}
