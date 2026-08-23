import { motion } from "framer-motion";
import { useId } from "react";
// import type { LucideIcon } from "lucide-react";

/**
 * SegmentedControl
 * -----------------
 * A generic, reusable segmented control (iOS-style tab switcher).
 *
 * Versatility additions over the original:
 *  - Generic option shape with optional icon, disabled per-option, and description
 *  - `size` prop: "sm" | "md" | "lg"
 *  - `variant` prop: "default" (muted track) | "outline" (bordered, no fill track)
 *  - `orientation`: "horizontal" | "vertical"
 *  - `fullWidth` to stretch segments to fill the parent
 *  - `disabled` to disable the whole control
 *  - Works with any value type via generics (string/number/enum-like)
 *  - Auto-generates a unique layoutId per instance so multiple controls
 *    on the same page never collide (previously relied on ariaLabel uniqueness)
 *  - Icon-only mode (label optional, falls back to aria-label per option)
 */

type SegmentedControlOption<T extends string> = {
  id: T;
  label?: string;
  //   icon?: LucideIcon;
  disabled?: boolean;
  "aria-label"?: string;
};

type SegmentedControlSize = "sm" | "md" | "lg";
type SegmentedControlVariant = "default" | "outline";
type SegmentedControlOrientation = "horizontal" | "vertical";

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: SegmentedControlSize;
  variant?: SegmentedControlVariant;
  orientation?: SegmentedControlOrientation;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

const sizeStyles: Record<SegmentedControlSize, string> = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-4.5 py-1.5 text-sm",
  lg: "px-4.5 py-2 text-base",
  // sm: "px-2.5 py-1 text-xs gap-1.5",
  // md: "px-3.5 py-1.5 text-sm gap-1.5",
  // lg: "px-4.5 py-2 text-base gap-2",
};

const iconSizeStyles: Record<SegmentedControlSize, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-4.5",
};

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "md",
  variant = "default",
  orientation = "horizontal",
  fullWidth = false,
  disabled = false,
  className = "",
}: SegmentedControlProps<T>) {
  // Unique per-instance id so layoutId never collides across multiple
  // controls rendered at once (even ones sharing the same ariaLabel).
  const instanceId = useId();

  const trackStyles =
    variant === "default"
      ? "border border-border bg-muted/50"
      : "border border-border bg-transparent";

  const pillStyles =
    variant === "default"
      ? "bg-background shadow-elevation-1"
      : "bg-foreground/10";

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={`inline-flex rounded-lg p-0.5 ${trackStyles} ${
        orientation === "vertical" ? "flex-col" : "flex-row"
      } ${fullWidth ? "w-full" : ""} ${
        disabled ? "opacity-50 pointer-events-none" : ""
      } ${className}`}
    >
      {options.map((opt) => {
        const active = opt.id === value;
        const isDisabled = disabled || opt.disabled;
        // const Icon = opt.icon;

        return (
          <motion.button
            key={opt.id}
            type="button"
            onClick={() => !isDisabled && onChange(opt.id)}
            disabled={isDisabled}
            aria-pressed={active}
            aria-label={opt["aria-label"] ?? opt.label}
            transition={{ type: "spring", stiffness: 1000, damping: 25 }}
            className={`relative flex items-center justify-center font-medium rounded-md transition-colors
            
              ${
              sizeStyles[size]
            } ${fullWidth ? "flex-1" : ""} ${
              isDisabled
                ? "cursor-not-allowed text-muted-foreground"
                : active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {active && !isDisabled && (
              <motion.div
                layoutId={`segmented-control-pill-${instanceId}`}
                className={`absolute inset-0 rounded-md ${pillStyles}`}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <motion.span
              className="relative z-10 flex items-center gap-1.5 whitespace-nowrap"
              whileTap={isDisabled ? undefined : { scale: 0.94 }}
            >
              {/* {Icon && <Icon className={iconSizeStyles[size]} />} */}
              {opt.label}
            </motion.span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
