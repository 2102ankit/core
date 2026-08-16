"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      clickSoundRef.current = new Audio("/sounds/click.wav");
      clickSoundRef.current.volume = 0.4;
      clickSoundRef.current.preload = "auto";
    }
  }, []);

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  };

  const toggleTheme = () => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    setTheme(currentTheme === "dark" ? "light" : "dark");
    playClickSound();
  };

  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (e.key === "d" && !isInputField) {
        toggleTheme();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mounted, theme, systemTheme, setTheme]);

  if (!mounted) {
    return <div className="size-9 rounded-lg bg-muted" />;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={toggleTheme}
      className="size-9 rounded-lg bg-muted flex items-center justify-center hover:bg-accent transition-fast"
      aria-label="Toggle theme (or press 'd')"
    >
      {currentTheme === "dark" ? (
        <HugeiconsIcon icon={Sun03Icon} className="size-4 text-foreground" />
      ) : (
        <HugeiconsIcon icon={Moon02Icon} className="size-4 text-foreground" />
      )}
    </button>
  );
}
