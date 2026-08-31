"use client";

import { SegmentedControl } from "@/components/segmented-control";
import { useState } from "react";

type Interval = "day" | "week" | "month";
type Sort = "recent" | "popular";
type Density = "cozy" | "compact";

export function SegmentedControlDemo() {
  const [interval, setIntervalValue] = useState<Interval>("week");
  const [sort, setSort] = useState<Sort>("recent");
  const [density, setDensity] = useState<Density>("cozy");

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-10">
      
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl<Interval>
            ariaLabel="Interval"
            options={[
              { value: "day", label: "Day" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
            ]}
            value={interval}
            onChange={setIntervalValue}
          />
          <SegmentedControl<Sort>
            ariaLabel="Sort order"
            size="sm"
            options={[
              { value: "recent", label: "Recent" },
              { value: "popular", label: "Popular" },
            ]}
            value={sort}
            onChange={setSort}
          />
        </div>

        
        <div
          className={`rounded-lg border border-dashed border-border bg-muted/30 ${
            density === "cozy" ? "p-6 space-y-4" : "p-3 space-y-2"
          }`}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`rounded-full bg-foreground/15 ${
                  density === "cozy" ? "size-10" : "size-6"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div
                  className={`h-2 rounded-full bg-foreground/20 ${
                    density === "cozy" ? "mb-2 max-w-32" : "max-w-24"
                  }`}
                />
                <div
                  className="h-1.5 rounded-full bg-foreground/10"
                  style={{ width: `${72 - i * 14}%` }}
                />
              </div>
              <span className="text-caption text-muted-foreground tabular-nums">
                {interval === "day" ? `${12 - i}h` : interval === "week" ? `${5 - i}d` : `${4 - i}w`}
              </span>
            </div>
          ))}
        </div>

        <p className="text-caption text-muted-foreground">
          Showing{" "}
          <span className="text-foreground font-medium">{sort}</span> items for
          this {interval}
          {sort === "popular" ? ", ranked by traction." : ", newest first."}
        </p>
      </div>

      
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 justify-center">
        <SegmentedControl<Density>
          ariaLabel="List density"
          options={[
            { value: "cozy", label: "Cozy" },
            { value: "compact", label: "Compact" },
          ]}
          value={density}
          onChange={setDensity}
        />
        <p className="text-caption text-muted-foreground">
          The pill springs between options — each group animates independently.
        </p>
      </div>
    </div>
  );
}

export default SegmentedControlDemo;
