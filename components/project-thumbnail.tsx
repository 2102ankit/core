"use client";

import Image from "next/image";
import { useState } from "react";

type ThumbnailVariant = "contain" | "cover";

interface ProjectThumbnailProps {
  src?: string;
  alt?: string;
  variant?: ThumbnailVariant;
}

export default function ProjectThumbnail({
  src,
  alt,
  variant = "contain",
}: ProjectThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  // If no src or image failed to load → show fallback text
  if (!src || hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
        {src ? alt ?? "Logo" : "Project"}
      </div>
    );
  }

  const objectFitClass = variant === "cover" ? "object-cover" : "object-contain";
  return (
    <div className="h-full w-full">
      <Image
        src={src}
        alt={alt ?? "Project thumbnail"}
        fill
        className={objectFitClass}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => setHasError(true)}
        unoptimized
      />
    </div>
  );
}
