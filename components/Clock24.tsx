"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

type ClockVariant = "flip" | "scoreboard" | "segment";
type ClockFormat = "24h" | "12h";

export type Clock24Props = {
  variant?: ClockVariant;
  format?: ClockFormat;
  showSeconds?: boolean;
};

type TimeParts = {
  h: string;
  m: string;
  s: string;
  suffix: string;
};

function useTimeParts(format: ClockFormat): TimeParts | null {
  const [parts, setParts] = useState<TimeParts | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      let hours = now.getHours();
      let suffix = "";

      if (format === "12h") {
        suffix = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
      }

      setParts({
        h: String(hours).padStart(2, "0"),
        m: String(now.getMinutes()).padStart(2, "0"),
        s: String(now.getSeconds()).padStart(2, "0"),
        suffix,
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [format]);

  return parts;
}

/* ── Variant: flip ──────────────────────────────────────────────────────
   Both entering and exiting digits are absolutely positioned, so they
   crossfade in place. No layout participation means zero sub-pixel
   shifting between ticks (the old popLayout pinning measured the
   perspective-transformed box, which nudged each digit sideways).       */

const FlipDigit: React.FC<{ value: string }> = ({ value }) => (
  <div className="relative inline-block w-[0.95ch] h-[1.35em] perspective-near">
    <AnimatePresence initial={false}>
      <motion.span
        key={value}
        initial={{ rotateX: -80, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        exit={{ rotateX: 80, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex items-center justify-center origin-center tabular-nums"
        style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </div>
);

const FlipColon: React.FC = () => (
  <span className="mx-[3px] opacity-40 select-none">:</span>
);

/* ── Variant: split-flap scoreboard ────────────────────────────────────
   A real mechanical split-flap card doesn't fade or slide — the top
   leaf swings down 90° (like a page falling flat, edge-on at its
   midpoint so it briefly disappears), THEN the bottom leaf swings the
   remaining 90° down to land. Two quarter-turns, not one glyph
   dissolving into another. That two-phase motion, plus the seam line
   and the top/bottom halves being lit slightly differently, is what
   reads as "cricket scoreboard" instead of "digital clock."          */

const FLIP_MS = 420; // total flip duration; each leaf gets half of this

function useFlipValue(value: string) {
  const [display, setDisplay] = useState(value);
  const [prev, setPrev] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const [tick, setTick] = useState(0);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (value === display) return;
    setPrev(display);
    setDisplay(value);
    setFlipping(true);
    setTick((t) => t + 1);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setFlipping(false), FLIP_MS);
    return () => window.clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return { display, prev, flipping, tick };
}

const glyphClass =
  "absolute inset-x-0 h-[200%] flex items-center justify-center font-bold tabular-nums text-amber-400";

/* A flat, single-color leaf gives the eye nothing to read as it turns —
   3D rotation alone doesn't shade a surface, CSS does. Each leaf keeps
   your bg-foreground base but gets a hairline gradient OVERLAY (pure
   black/white alpha, so it works over any foreground color) that
   stands in for "this edge catches light, this edge falls into shadow."
   Top leaves brighten toward their top edge; bottom leaves darken
   toward their bottom edge — same logic real embossed flap cards use. */
const topSheen =
  "after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/10 after:via-transparent after:to-black/10 after:content-['']";
const bottomSheen =
  "after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/25 after:via-transparent after:to-white/5 after:content-['']";

const FlipCard: React.FC<{ value: string }> = ({ value }) => {
  const { display, prev, flipping, tick } = useFlipValue(value);
  const half = FLIP_MS / 2 / 1000;

  return (
    <div
      className="relative inline-block h-[1.6em] w-[1.05ch] select-none rounded-px border-[0.5px] border-border/20 bg-foreground px-1.5"
      style={{ perspective: 240 }}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-px bg-foreground ${topSheen}`}
      >
        <span className={`${glyphClass} top-0`}>{display}</span>
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-px bg-foreground ${bottomSheen}`}
      >
        <span className={`${glyphClass} bottom-0`}>
          {flipping ? prev : display}
        </span>
      </div>

      {flipping && (
        <>
          <motion.div
            key={`t-${tick}`}
            className={`absolute inset-x-0 top-0 h-1/2 origin-bottom overflow-hidden rounded-t-px bg-foreground transform-3d ${topSheen}`}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -90 }}
            transition={{ duration: half, ease: [0.5, 0, 0.85, 0] }}
          >
            <span className={`${glyphClass} top-0`}>{prev}</span>
          </motion.div>

          <motion.div
            key={`b-${tick}`}
            className={`absolute inset-x-0 bottom-0 h-1/2 origin-top overflow-hidden rounded-b-px bg-foreground/50 transform-3d ${bottomSheen}`}
            initial={{ rotateX: 90 }}
            animate={{ rotateX: 0 }}
            transition={{
              duration: half,
              delay: half,
              ease: [0.15, 1, 0.5, 1],
            }}
          >
            <span className={`${glyphClass} bottom-0`}>{display}</span>
          </motion.div>
        </>
      )}
    </div>
  );
};

const ScoreColon: React.FC = () => (
  <span
    aria-hidden="true"
    className="mx-[3.5px] flex flex-col justify-center gap-[0.36em] self-center"
  >
    <span className="size-[0.16em] rounded-full bg-amber-400 [box-shadow:0_0_5px_rgba(251,191,36,0.55)]" />
    <span className="size-[0.16em] rounded-full bg-amber-400 [box-shadow:0_0_5px_rgba(251,191,36,0.55)]" />
  </span>
);
const ScoreGroup: React.FC<{ value: string }> = ({ value }) => (
  <div className="flex gap-[3px]">
    {value.split("").map((d, i) => (
      <FlipCard key={i} value={d} />
    ))}
  </div>
);

/* ── Variant: seven-segment ─────────────────────────────────────────── */
// ---- geometry -------------------------------------------------------

const W = 20;
const H = 34;

// Skeleton nodes run down the CENTERLINE of each bar (not the outer
// edge) — the bar's thickness is added on both sides of this line.
const TL: [number, number] = [2, 2];
const TR: [number, number] = [18, 2];
const ML: [number, number] = [2, 17];
const MR: [number, number] = [18, 17];
const BL: [number, number] = [2, 32];
const BR: [number, number] = [18, 32];

const THICKNESS = 3; // full width of a bar
const GAP = 1.2; // inset from the true node, along the bar's own axis
const TAPER = 1.5; // distance over which the bar widens to full thickness

function buildSegment(
  [ax, ay]: [number, number],
  [bx, by]: [number, number],
): string {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  // perpendicular unit vector
  const px = -uy;
  const py = ux;
  const ht = THICKNESS / 2;

  const aTip: [number, number] = [ax + ux * GAP, ay + uy * GAP];
  const bTip: [number, number] = [bx - ux * GAP, by - uy * GAP];
  const aWaist: [number, number] = [
    ax + ux * (GAP + TAPER),
    ay + uy * (GAP + TAPER),
  ];
  const bWaist: [number, number] = [
    bx - ux * (GAP + TAPER),
    by - uy * (GAP + TAPER),
  ];

  const pts: [number, number][] = [
    aTip,
    [aWaist[0] + px * ht, aWaist[1] + py * ht],
    [bWaist[0] + px * ht, bWaist[1] + py * ht],
    bTip,
    [bWaist[0] - px * ht, bWaist[1] - py * ht],
    [aWaist[0] - px * ht, aWaist[1] - py * ht],
  ];

  return pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

// Segment order stays a(top) b(tr) c(br) d(bottom) e(bl) f(tl) g(middle)
// so SEGMENT_MAP below is unchanged from the original.
const SEGMENT_POINTS = [
  buildSegment(TL, TR), // a
  buildSegment(TR, MR), // b
  buildSegment(MR, BR), // c
  buildSegment(BL, BR), // d
  buildSegment(ML, BL), // e
  buildSegment(TL, ML), // f
  buildSegment(ML, MR), // g
];

const SEGMENT_MAP: Record<string, number[]> = {
  "0": [0, 1, 2, 3, 4, 5],
  "1": [1, 2],
  "2": [0, 1, 6, 4, 3],
  "3": [0, 1, 6, 2, 3],
  "4": [5, 6, 1, 2],
  "5": [0, 5, 6, 2, 3],
  "6": [0, 5, 6, 4, 3, 2],
  "7": [0, 1, 2],
  "8": [0, 1, 2, 3, 4, 5, 6],
  "9": [0, 1, 2, 3, 5, 6],
};

export const SegmentDigit: React.FC<{ value: string }> = ({ value }) => {
  const on = new Set(SEGMENT_MAP[value] ?? []);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-[1.9em] w-auto select-none text-[#ff3130] drop-shadow-[0_0_6px_rgba(255,49,48,0.55)]"
      aria-hidden="true"
    >
      {SEGMENT_POINTS.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="currentColor"
          opacity={on.has(i) ? 1 : 0.08}
          style={{ transition: "opacity 140ms ease" }}
        />
      ))}
    </svg>
  );
};

const SegmentColon: React.FC = () => (
  <span
    aria-hidden="true"
    className="mx-0.5 flex flex-col justify-center gap-[0.62em]"
  >
    <span className="size-[0.17em] rounded-[1px] bg-current" />
    <span className="size-[0.17em] rounded-[1px] bg-current" />
  </span>
);

/* ── Assembly ───────────────────────────────────────────────────────── */

const DIGITS: Record<
  ClockVariant,
  { Digit: React.FC<{ value: string }>; Colon: React.FC }
> = {
  flip: { Digit: FlipDigit, Colon: FlipColon },
  scoreboard: { Digit: FlipCard, Colon: ScoreColon },
  segment: { Digit: SegmentDigit, Colon: SegmentColon },
};

const Clock24: React.FC<Clock24Props> = ({
  variant = "flip",
  format = "24h",
  showSeconds = true,
}) => {
  const time = useTimeParts(format);
  const { Digit, Colon } = DIGITS[variant];

  if (!time) return null;

  const groups: string[][] = showSeconds
    ? [time.h.split(""), time.m.split(""), time.s.split("")]
    : [time.h.split(""), time.m.split("")];

  return (
    <div
      className={`
        inline-flex items-center
        text-[13px] leading-none
        text-muted-foreground
        tabular-nums tracking-tight
        select-none
        ${variant == "scoreboard" ? "gap-px" : ""}
      `}
      aria-label={`Current time ${time.h}:${time.m}${
        showSeconds ? `:${time.s}` : ""
      } ${time.suffix}`.trim()}
    >
      {groups.map((digits, gi) => (
        <React.Fragment key={gi}>
          {gi > 0 && <Colon />}
          {digits.map((d, di) => (
            <Digit key={`${gi}-${di}`} value={d} />
          ))}
        </React.Fragment>
      ))}

      {time.suffix && (
        <span className="ml-1.5 self-start mt-[0.2em] text-[0.62em] font-semibold tracking-widest">
          {time.suffix}
        </span>
      )}
    </div>
  );
};

export default Clock24;
