"use client";

import { motion } from "framer-motion";
import { useId } from "react";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

export type SegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  size?: "sm" | "md";
  className?: string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "md",
  className = "",
}: SegmentedControlProps<T>) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const layoutId = `segmented-pill-${uid}`;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex items-stretch rounded-lg border border-border bg-muted/50 p-0.5 ${className}`}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`relative rounded-md font-medium transition-fast cursor-pointer whitespace-nowrap ${
              size === "sm" ? "px-3 py-1 text-caption" : "px-4 py-1.5 text-callout"
            } ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                aria-hidden="true"
                className="absolute inset-0 rounded-md bg-background shadow-sm"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
