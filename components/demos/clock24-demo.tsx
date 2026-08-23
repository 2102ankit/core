"use client";

import { useState } from "react";
import Clock24, { type Clock24Props } from "@/components/Clock24";
import { SegmentedControl } from "@/components/segmented-control";

type ClockVariant = NonNullable<Clock24Props["variant"]>;
type ClockFormat = NonNullable<Clock24Props["format"]>;

export function Clock24Demo() {
  const [variant, setVariant] = useState<ClockVariant>("flip");
  const [format, setFormat] = useState<ClockFormat>("24h");
  const [showSeconds, setShowSeconds] = useState(true);

  const scale = 2.4;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-10">
      
      <div className="flex items-center justify-center">
        <div
          className="flex items-center justify-center"
          style={{ height: `${Math.ceil(22 * scale)}px` }}
        >
          <div style={{ transform: `scale(${scale})` }}>
            <Clock24
              variant={variant}
              format={format}
              showSeconds={showSeconds}
            />
          </div>
        </div>
      </div>

      
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
        <SegmentedControl<ClockVariant>
          ariaLabel="Clock style"
          options={[
            { value: "flip", label: "Flip" },
            { value: "scoreboard", label: "Scoreboard" },
            { value: "segment", label: "7-Segment" },
          ]}
          value={variant}
          onChange={setVariant}
        />
        <SegmentedControl<ClockFormat>
          ariaLabel="Hour format"
          options={[
            { value: "24h", label: "24h" },
            { value: "12h", label: "12h" },
          ]}
          value={format}
          onChange={setFormat}
        />
        <SegmentedControl<"show" | "hide">
          ariaLabel="Seconds visibility"
          options={[
            { value: "show", label: "With seconds" },
            { value: "hide", label: "Hide seconds" },
          ]}
          value={showSeconds ? "show" : "hide"}
          onChange={(v) => setShowSeconds(v === "show")}
        />
      </div>

      <p className="text-caption text-muted-foreground text-center max-w-md mx-auto">
        The flip digits crossfade in place on a fixed grid — no sub-pixel drift
        between ticks — the scoreboard slides inside dark bulb tiles, and the
        seven-segment display toggles real segment geometry with ghosted
        off-segments.
      </p>
    </div>
  );
}

export default Clock24Demo;
