"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-900" />
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" ? (
        <Sun className="w-4 h-4 text-zinc-50 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-950 transition-transform duration-300" />
      )}
    </button>
  );
}
