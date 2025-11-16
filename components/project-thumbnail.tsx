"use client";

import Image from "next/image";
import { useState } from "react";

interface ProjectThumbnailProps {
  src?: string;
  alt?: string;
}

export default function ProjectThumbnail({ src, alt }: ProjectThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  // If no src or image failed to load → show fallback text
  if (!src || hasError) {
    return <>{src || "Project"}</>;
  }

  // Otherwise, render the image
  return (
    <Image
      src={src}
      alt={alt || "Project thumbnail"}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={() => {
        setHasError(true);
      }}
      unoptimized
    />
  );
}
