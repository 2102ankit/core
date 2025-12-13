"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);

    // Preload the click sound (client-side only)
    if (typeof window !== "undefined") {
      clickSoundRef.current = new Audio("/sounds/click.wav"); // Path from /public
      clickSoundRef.current.volume = 0.4; // Adjust volume (0-1); keep subtle
      clickSoundRef.current.preload = "auto";
    }
  }, []);

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0; // Reset for rapid toggles
      clickSoundRef.current.play().catch((e) => {
        console.warn("Click sound play failed:", e); // Rare, but handles any edge cases
      });
    }
  };

  const toggleTheme = () => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    setTheme(currentTheme === "dark" ? "light" : "dark");
    playClickSound();
  };

  // Keyboard shortcut for 'd' key
  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "d" || e.key === "D") {
        toggleTheme();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mounted, theme, systemTheme, setTheme]);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-900" />
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Toggle theme (or press 'd')"
    >
      {currentTheme === "dark" ? (
        <Sun className="w-4 h-4 text-zinc-50 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-950 transition-transform duration-300" />
      )}
    </button>
  );
}
