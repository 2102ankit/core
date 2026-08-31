"use client";

import { ThemeToggle } from "@/components/theme-toggle";

const VARIANTS = [
  { size: "sm" as const, label: "sm · 32px" },
  { size: "md" as const, label: "md · 40px" },
  { size: "lg" as const, label: "lg · 56px" },
];

export function GooeyThemeToggleDemo() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-10">
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        {VARIANTS.map(({ size, label }) => (
          <div key={size} className="flex flex-col items-center gap-4">
            <ThemeToggle size={size} enableHotkey={false} />
            <span className="text-caption text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-3 text-callout text-muted-foreground sm:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          <p className="font-medium text-foreground mb-1">Gooey morph</p>
          <p>
            An SVG blur + alpha-contrast filter melts the rays into the core,
            while a masked bite carves the crescent.
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="font-medium text-foreground mb-1">Keyboard</p>
          <p>
            Press{" "}
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-caption font-mono">
              d
            </kbd>{" "}
            anywhere to flip the theme (handled by the toggle in the nav).
          </p>
        </div>
      </div>

      <p className="mt-6 text-caption text-muted-foreground text-center">
        Tap the icons above — or the one in the navigation bar — to watch the
        sun collapse and the moon bite out of it.
      </p>
    </div>
  );
}

export default GooeyThemeToggleDemo;
