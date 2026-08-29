"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { CheckIcon, Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";

export type HslColor = {
  h: number;
  s: number;
  l: number;
};

export type RgbColor = {
  r: number;
  g: number;
  b: number;
};

export type ColorValue = {
  hex: string;
  rgba: string;
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
};

export type ColorPickerProps = {
  defaultHex?: string;
  onChange?: (color: ColorValue) => void;
  className?: string;
};

type PetalCell = HslColor & { angle: number };
type PetalCoord = { layer: number; index: number };

function hexToHsl(hex: string): HslColor {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): RgbColor {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

const CORE_SIZE = 68;
const PETAL_SIZES = [38, 34] as const;
const RING_OVERLAP = 0.8;

function packRing(targetRadius: number, r: number) {
  const raw = Math.PI / Math.asin(Math.min(0.98, r / targetRadius));
  const count = Math.max(3, Math.round(raw));
  const radius = r / Math.sin(Math.PI / count);
  return { count, radius };
}

function buildLayers() {
  const [r1, r2] = PETAL_SIZES.map((s) => s / 2);
  const ring1 = packRing(CORE_SIZE / 2 + r1, r1);
  const ring2 = packRing(ring1.radius + (r1 + r2) * RING_OVERLAP, r2);
  const radii = [ring1.radius - 8, ring2.radius - 12];
  const counts = [ring1.count, ring2.count];
  const rotations = [0, 360 / ring1.count / 2];

  const layers: PetalCell[][] = counts.map((count, i) => {
    const rotation = rotations[i];
    const sat = i === 0 ? 62 : 88;
    const light = i === 0 ? 82 : 52;
    return Array.from({ length: count }, (_, idx) => {
      const angle = (idx / count) * 360 + rotation;
      return { h: ((angle % 360) + 360) % 360, s: sat, l: light, angle };
    });
  });

  return { layers, radii };
}

const { layers: LAYERS, radii: LAYER_RADII } = buildLayers();
const OUTER_RADIUS =
  LAYER_RADII[LAYER_RADII.length - 1] + PETAL_SIZES[PETAL_SIZES.length - 1] / 2;
const STAGE = Math.ceil(OUTER_RADIUS * 2 + 8);
const STAGE_CENTER = STAGE / 2;

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const PANEL_PAD_X = 22;
const PANEL_PAD_TOP = 20;
const HEADER_H = 22;
const HEADER_MARGIN = 10;
const PANEL_WIDTH = STAGE + PANEL_PAD_X * 2;
const RING_CENTER_OFFSET_Y =
  PANEL_PAD_TOP + HEADER_H + HEADER_MARGIN + STAGE_CENTER;

function useClientReady() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return { mounted, reducedMotion };
}

function haptic(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Vibration API is optional; iOS Safari has no equivalent.
  }
}

const TICK_STEP = 2;
const TICK_MAJOR_EVERY = 5;
const TICKS = Array.from(
  { length: 100 / TICK_STEP + 1 },
  (_, i) => i * TICK_STEP,
);

type SliderProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onCommit?: () => void;
  trackStyle: CSSProperties;
  thumbColor: string;
  checker?: boolean;
};

function Slider({
  label,
  value,
  onChange,
  onCommit,
  trackStyle,
  thumbColor,
  checker,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [interacting, setInteracting] = useState(false);
  const settleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTickBucket = useRef(Math.round(value / TICK_STEP));

  const valueFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return value;
      const rect = el.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      return Math.max(0, Math.min(100, Math.round(pct)));
    },
    [value],
  );

  const emitAndTick = (next: number) => {
    const bucket = Math.round(next / TICK_STEP);
    if (bucket !== lastTickBucket.current) {
      lastTickBucket.current = bucket;
      haptic(3);
    }
    onChange(next);
  };

  const beginInteracting = () => {
    if (settleTimeout.current) clearTimeout(settleTimeout.current);
    setInteracting(true);
  };
  const endInteracting = () => {
    settleTimeout.current = setTimeout(() => setInteracting(false), 200);
  };

  const onPointerMove = (e: globalThis.PointerEvent) => {
    if (!dragging.current) return;
    emitAndTick(valueFromClientX(e.clientX));
  };
  const onPointerUp = () => {
    dragging.current = false;
    haptic(10);
    onCommit?.();
    endInteracting();
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    beginInteracting();
    emitAndTick(valueFromClientX(e.clientX));
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp")
      next = Math.min(100, value + step);
    if (e.key === "ArrowLeft" || e.key === "ArrowDown")
      next = Math.max(0, value - step);
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = 100;
    if (next !== null) {
      e.preventDefault();
      beginInteracting();
      emitAndTick(next);
      haptic(10);
      onCommit?.();
      endInteracting();
    }
  };

  useEffect(
    () => () => {
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    },
    // Handlers are recreated each render; cleanup only needs the last pair.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className="w-full">
      <div className="relative h-5 mb-0.5">
        {TICKS.map((t) => {
          const isMajor = (t / TICK_STEP) % TICK_MAJOR_EVERY === 0;
          let boost = 0;
          if (interacting) {
            const dist = Math.abs(t - value);
            const falloff = Math.max(0, 1 - dist / 13);
            boost = Math.pow(falloff, 1.7) * 9;
          }
          const h = 5 + boost;
          return (
            <div
              key={t}
              style={{
                position: "absolute",
                bottom: 0,
                left: `${t}%`,
                width: isMajor ? 1.6 : 1,
                height: h,
                marginLeft: isMajor ? -0.8 : -0.5,
                borderRadius: 1,
                background:
                  boost > 0.6
                    ? thumbColor
                    : isMajor
                      ? "color-mix(in oklab, var(--foreground) 32%, transparent)"
                      : "color-mix(in oklab, var(--foreground) 16%, transparent)",
                transition: `height 170ms ${EASE}, background 170ms ${EASE}`,
              }}
            />
          );
        })}
      </div>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        className="relative h-2 rounded-[5px] cursor-pointer touch-none"
        style={
          checker
            ? {
                backgroundImage:
                  "repeating-conic-gradient(#e5e5ea 0% 25%, #ffffff 0% 50%)",
                backgroundSize: "8px 8px",
              }
            : undefined
        }
      >
        <div
          className="absolute inset-0 rounded-[5px]"
          style={trackStyle}
        />
        <div
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(value)}
          onKeyDown={onKeyDown}
          onFocus={beginInteracting}
          onBlur={endInteracting}
          style={{
            position: "absolute",
            top: "50%",
            left: `${value}%`,
            width: 16,
            height: 16,
            marginLeft: -10,
            transform: "translateY(-50%)",
            borderRadius: "50%",
            background: thumbColor,
            border: "2.5px solid var(--background)",
            boxShadow:
              "0 1px 4px color-mix(in oklab, var(--foreground) 35%, transparent), 0 0 0 0.5px color-mix(in oklab, var(--foreground) 8%, transparent)",
            transition: dragging.current ? "none" : `left 120ms ${EASE}`,
          }}
        />
      </div>
    </div>
  );
}

export function ColorPicker({
  defaultHex = "#007AFF",
  onChange,
  className = "",
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const start = hexToHsl(defaultHex);
  const [hue, setHue] = useState(start.h);
  const [sat, setSat] = useState(start.s);
  const [light, setLight] = useState(start.l);
  const [alpha, setAlpha] = useState(100);
  const [selected, setSelected] = useState<PetalCoord | null>(null);
  const [hovered, setHovered] = useState<PetalCoord | null>(null);
  const [copied, setCopied] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const { mounted, reducedMotion } = useClientReady();
  const duration = reducedMotion ? 0 : 460;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: globalThis.PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const rgb = useMemo(() => hslToRgb(hue, sat, light), [hue, sat, light]);
  const hex = useMemo(() => rgbToHex(rgb.r, rgb.g, rgb.b), [rgb]);
  const rgbaString = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(alpha / 100).toFixed(2)})`;
  const solidHsl = `hsl(${hue}, ${sat}%, ${light}%)`;

  useEffect(() => {
    onChange?.({
      hex,
      rgba: rgbaString,
      hue,
      saturation: sat,
      lightness: light,
      alpha,
    });
  }, [hex, rgbaString, hue, sat, light, alpha, onChange]);

  const selectCell = (layerIdx: number, idx: number, cell: PetalCell) => {
    setSelected({ layer: layerIdx, index: idx });
    setHue(cell.h);
    setSat(cell.s);
    setLight(cell.l);
    haptic(12);
  };

  const copyHex = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard can fail in insecure contexts.
    }
  };

  return (
    <div
      ref={rootRef}
      className={`relative inline-block ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close color picker" : "Open color picker"}
        aria-expanded={open}
        className="relative size-[52px] rounded-full border-0 p-0 cursor-pointer"
        style={{
          background: solidHsl,
          boxShadow: open
            ? "0 0 0 2px color-mix(in oklab, var(--foreground) 6%, transparent)"
            : "0 2px 8px color-mix(in oklab, var(--foreground) 18%, transparent), inset 0 0 0 1px rgba(255,255,255,0.35)",
          opacity: open ? 0 : 1,
          transition: `opacity 160ms ${EASE}, box-shadow 200ms ${EASE}`,
        }}
      />

      {mounted ? (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: PANEL_WIDTH,
          transformOrigin: `50% ${RING_CENTER_OFFSET_Y}px`,
          transform: `translate(-50%, -${RING_CENTER_OFFSET_Y}px) scale(${open ? 1 : 0.38})`,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: `transform ${duration}ms ${SPRING}, opacity ${Math.min(duration, 240)}ms ${EASE}`,
          zIndex: 60,
        }}
      >
        <div
          className="rounded-[26px] bg-card/90 backdrop-blur-xl saturate-150 shadow-elevation-2"
          style={{
            boxShadow:
              "0 1px 1px color-mix(in oklab, var(--foreground) 4%, transparent), 0 24px 48px color-mix(in oklab, var(--foreground) 18%, transparent), 0 0 0 1px color-mix(in oklab, var(--foreground) 6%, transparent)",
            padding: `${PANEL_PAD_TOP}px ${PANEL_PAD_X}px 22px`,
          }}
        >
          <div
            className="flex items-center justify-between"
            style={{ height: HEADER_H, marginBottom: HEADER_MARGIN }}
          >
            <span className="text-[13px] font-semibold text-foreground tracking-[0.1px]">
              Color
            </span>
          </div>

          <div
            className="relative mx-auto"
            style={{ width: STAGE, height: STAGE }}
          >
            {LAYERS.map((layerColors, layerIdx) => {
              const radius = LAYER_RADII[layerIdx];
              const petalSize = PETAL_SIZES[layerIdx];
              const baseZ = (LAYERS.length - layerIdx) * 100;
              return layerColors.map((cell, idx) => {
                const rad = ((cell.angle - 90) * Math.PI) / 180;
                const x = Math.round(
                  (STAGE_CENTER + radius * Math.cos(rad) - petalSize / 2) * 100,
                ) / 100;
                const y = Math.round(
                  (STAGE_CENTER + radius * Math.sin(rad) - petalSize / 2) * 100,
                ) / 100;
                const isSelected =
                  selected?.layer === layerIdx && selected?.index === idx;
                const isHovered =
                  hovered?.layer === layerIdx && hovered?.index === idx;
                const delay = open
                  ? (LAYERS.length - layerIdx - 1) * 60 + idx * 10
                  : 0;
                const cellColor = `hsl(${cell.h}, ${cell.s}%, ${cell.l}%)`;
                return (
                  <button
                    key={`${layerIdx}-${idx}`}
                    type="button"
                    onClick={() => selectCell(layerIdx, idx, cell)}
                    onMouseEnter={() =>
                      setHovered({ layer: layerIdx, index: idx })
                    }
                    onMouseLeave={() => setHovered(null)}
                    aria-label={`Hue ${Math.round(cell.h)}`}
                    aria-pressed={isSelected}
                    style={{
                      position: "absolute",
                      left: `${x}px`,
                      top: `${y}px`,
                      width: `${petalSize}px`,
                      height: `${petalSize}px`,
                      borderRadius: "50%",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      background: cellColor,
                      transform: open
                        ? `scale(${isHovered ? 1.18 : isSelected ? 1.1 : 1})`
                        : "scale(0.25)",
                      opacity: open ? "1" : "0",
                      zIndex: isHovered ? 999 : baseZ + idx,
                      boxShadow: isSelected
                        ? "0 0 0 2.5px var(--background), 0 4px 10px color-mix(in oklab, var(--foreground) 22%, transparent)"
                        : isHovered
                          ? "0 4px 12px color-mix(in oklab, var(--foreground) 20%, transparent)"
                          : "0 1px 3px color-mix(in oklab, var(--foreground) 14%, transparent)",
                      transition: `transform ${duration}ms ${SPRING} ${delay}ms, opacity ${Math.min(duration, 260)}ms ${EASE} ${delay}ms, box-shadow 150ms ${EASE}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isSelected ? (
                      <HugeiconsIcon
                        icon={CheckIcon}
                        size={12}
                        color="white"
                        strokeWidth={3}
                        style={{
                          filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.35))",
                        }}
                      />
                    ) : null}
                  </button>
                );
              });
            })}

            <div
              style={{
                position: "absolute",
                left: STAGE_CENTER - CORE_SIZE / 2,
                top: STAGE_CENTER - CORE_SIZE / 2,
                width: CORE_SIZE,
                height: CORE_SIZE,
                borderRadius: "50%",
                background: solidHsl,
                zIndex: 1000,
                boxShadow:
                  "0 0 0 1px color-mix(in oklab, var(--foreground) 6%, transparent), 0 2px 6px color-mix(in oklab, var(--foreground) 12%, transparent), inset 0 0 0 1px rgba(255,255,255,0.4)",
                transition: `background 120ms ${EASE}`,
              }}
            />
          </div>

          <div className="mt-4 flex flex-col gap-3.5">
            <Slider
              label="Lightness"
              value={light}
              onChange={setLight}
              thumbColor={`hsl(${hue}, ${sat}%, ${light}%)`}
              trackStyle={{
                background: `linear-gradient(to right, hsl(${hue},${sat}%,4%), hsl(${hue},${sat}%,50%), hsl(${hue},${sat}%,96%))`,
              }}
            />
            <Slider
              label="Opacity"
              value={alpha}
              onChange={setAlpha}
              thumbColor={rgbaString}
              checker
              trackStyle={{
                background: `linear-gradient(to right, hsla(${hue},${sat}%,${light}%,0), hsl(${hue},${sat}%,${light}%))`,
              }}
            />
          </div>

          <div className="mt-4 flex items-center gap-2.5 pt-3.5 border-t border-border">
            <div
              className="relative size-[30px] rounded-[9px] shrink-0 overflow-hidden"
              style={{
                backgroundImage:
                  "repeating-conic-gradient(#e5e5ea 0% 25%, #ffffff 0% 50%)",
                backgroundSize: "8px 8px",
                boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--foreground) 8%, transparent)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{ background: solidHsl, opacity: alpha / 100 }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-foreground tabular-nums font-mono">
                {hex}
              </div>
              <div className="text-[11px] text-muted-foreground font-mono">
                {alpha}% opacity
              </div>
            </div>
            <button
              type="button"
              onClick={copyHex}
              aria-label="Copy hex value"
              className="size-[30px] rounded-[9px] flex items-center justify-center cursor-pointer"
              style={{
                border: "none",
                background: copied
                  ? "#34C759"
                  : "color-mix(in oklab, var(--foreground) 5%, transparent)",
                color: copied ? "white" : "var(--foreground)",
                transition: `background 180ms ${EASE}, color 180ms ${EASE}`,
              }}
            >
              {copied ? (
                <HugeiconsIcon icon={CheckIcon} size={14} strokeWidth={3} />
              ) : (
                <HugeiconsIcon icon={Copy01Icon} size={14} />
              )}
            </button>
          </div>
        </div>
      </div>
      ) : null}
    </div>
  );
}

export default ColorPicker;
