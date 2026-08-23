"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useId, useRef, useState } from "react";

const TOGGLE_SIZES = {
  sm: { button: "size-8", icon: 16 },
  md: { button: "size-10", icon: 20 },
  lg: { button: "size-14", icon: 28 },
} as const;

type ToggleSize = keyof typeof TOGGLE_SIZES;

// Crisp feather-style crescent, scaled to sit centred in the 24×24 box
const MOON_PATH =
  "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z";
const MOON_TRANSFORM = "translate(2.4 2.4) scale(0.8)";

// 8 straight rays radiating outward
const RAY_ANGLES = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);

function GooeySunMoon({ isDark, size }: { isDark: boolean; size: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const filterId = `goo-${uid}`;

  // Goo intensity: 0 = crisp shapes, 1 = full melt. Pulsed only during the
  // morph so the resting icons stay perfectly sharp.
  const goo = useMotionValue(0);
  const groupRef = useRef<SVGGElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const mountedRef = useRef(false);

  useMotionValueEvent(goo, "change", (v) => {
    blurRef.current?.setAttribute("stdDeviation", (v * 1.15).toFixed(3));
    // Only pay for the filter while there's actual melting to do
    groupRef.current?.setAttribute(
      "filter",
      v > 0.001 ? `url(#${filterId})` : "",
    );
  });

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    const controls = animate(goo, [0, 1, 0], {
      duration: 0.6,
      times: [0, 0.45, 1],
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [isDark, goo]);

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <defs>
        <filter
          id={filterId}
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          
          <feGaussianBlur ref={blurRef} stdDeviation="0" result="blur" />
          
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
          />
        </filter>
      </defs>

      <g ref={groupRef} fill="currentColor">
        
        <motion.g
          initial={false}
          animate={
            isDark
              ? { opacity: 1, scale: 1, rotate: 0 }
              : { opacity: 0, scale: 0.4, rotate: 135 }
          }
          transition={{ type: "spring", stiffness: 240, damping: 19 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle cx="12" cy="12" r="4.4" />

          {RAY_ANGLES.map((angle) => (
            <line
              key={angle}
              x1={12 + Math.cos(angle) * 6.7}
              y1={12 + Math.sin(angle) * 6.7}
              x2={12 + Math.cos(angle) * 9.2}
              y2={12 + Math.sin(angle) * 9.2}
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          ))}
        </motion.g>

        
        <motion.g
          initial={false}
          animate={
            isDark
              ? { opacity: 0, scale: 0.4, rotate: -60 }
              : { opacity: 1, scale: 1, rotate: 0 }
          }
          transition={{ type: "spring", stiffness: 240, damping: 19 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <path d={MOON_PATH} transform={MOON_TRANSFORM} />
        </motion.g>
      </g>
    </motion.svg>
  );
}

export function ThemeToggle({
  size = "md",
  enableHotkey = true,
}: {
  size?: ToggleSize;
  enableHotkey?: boolean;
}) {
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
    if (!mounted || !enableHotkey) return;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, enableHotkey, theme, systemTheme, setTheme]);

  const { button, icon } = TOGGLE_SIZES[size];

  if (!mounted) {
    return <div className={`${button} rounded-full bg-muted`} />;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={toggleTheme}
      className={`${button} rounded-full bg-muted flex items-center justify-center hover:bg-accent active:bg-accent`}
      aria-label="Toggle theme (or press 'd')"
    >
      <GooeySunMoon isDark={isDark} size={icon} />
    </motion.button>
  );
}
