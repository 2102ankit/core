"use client";

import { formatDuration } from "@/lib/utils";
import Image from "next/image";

interface BaseTooltipProps {
  company: string;
  logo?: string;
  startDate: Date;
  endDate: Date | null;
  current?: boolean;
}

export function DefaultTooltipContent({
  company,
  logo,
  startDate,
  endDate,
  current,
}: BaseTooltipProps) {
  return (
    <div className="flex items-center gap-4">
      {logo && (
        <div className="relative h-20 w-20 overflow-hidden rounded-xl border-2 border-border/50 shadow-sm">
          <Image src={logo} alt={company} fill className="object-contain p-2" />
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-semibold text-foreground text-base">
          {company}
        </span>
        {current && (
          <span className="text-xs text-green-500 font-medium">
            Current Position
          </span>
        )}
        <span className="text-xs text-muted-foreground mt-1">
          {formatDuration(startDate, endDate)}
        </span>
      </div>
    </div>
  );
}

export function IssStoxxTooltipContent({
  company,
  logo,
  startDate,
  endDate,
  current,
}: BaseTooltipProps) {
  // Customize ISS-Stoxx tooltip specifically
  return (
    <div className="flex items-center gap-4">
      {logo && (
        <div className="relative min-h-24 min-w-24 overflow-hidden rounded-xl border-2 border-border/50 shadow-sm bg-white">
          <Image
            src={logo}
            alt={company}
            fill
            className="object-contain p-2 scale-125"
          />
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-semibold text-foreground text-base">
          {company}
        </span>
        {current && (
          <span className="text-xs text-green-500 font-medium">
            Current Position
          </span>
        )}
        <span className="text-xs text-muted-foreground mt-1 text-justify min-w-36 leading-tight">
          Leading provider of data, insights and market intelligence solutions
          for global financial services.
        </span>
      </div>
    </div>
  );
}

export function AlhansatSolutionsTooltipContent(props: BaseTooltipProps) {
  // Customize Alhansat Solutions tooltip specifically
  return <DefaultTooltipContent {...props} />;
}
