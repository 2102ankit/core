import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(startDate: Date, endDate: Date | null): string {
  const end = endDate || new Date();
  const diffMonths =
    (end.getFullYear() - startDate.getFullYear()) * 12 +
    (end.getMonth() - startDate.getMonth());

  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? "s" : ""}`);

  return parts.length > 0 ? parts.join(" ") : "< 1 month";
}

export function formatDateRange(startDate: Date, endDate: Date | null): string {
  const formatOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
  };
  const start = startDate.toLocaleDateString("en-US", formatOptions);

  if (endDate) {
    const end = endDate.toLocaleDateString("en-US", formatOptions);
    return `${start} - ${end}`;
  }
  return `${start} - Present`;
}
