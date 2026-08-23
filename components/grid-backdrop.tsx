"use client";

import { useEffect, useRef } from "react";

/**
 * A whisper-quiet square grid behind every page. The hairlines stay almost
 * invisible on their own; a radial mask follows the pointer so the cells
 * near the cursor light up — edges first, then a faint pool of light over
 * the area they encompass.
 */
export function GridBackdrop() {
  const reactiveRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const reactive = reactiveRef.current;
    const glow = glowRef.current;
    if (!reactive || !glow) return;

    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        reactive.style.opacity = "1";
        glow.style.opacity = "1";
      }

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = `${e.clientX.toFixed(1)}px`;
        const y = `${e.clientY.toFixed(1)}px`;
        reactive.style.setProperty("--gx", x);
        reactive.style.setProperty("--gy", y);
        glow.style.setProperty("--gx", x);
        glow.style.setProperty("--gy", y);
      });
    };

    const onLeave = () => {
      visible = false;
      reactive.style.opacity = "0";
      glow.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      
      <div className="absolute inset-0 grid-hairline" />

      
      <div
        ref={reactiveRef}
        className="absolute inset-0 grid-hairline grid-hairline-reactive transition-opacity duration-500 opacity-0"
      />

      
      <div
        ref={glowRef}
        className="absolute inset-0 transition-opacity duration-700 opacity-0"
        style={{
          background:
            "radial-gradient(200px circle at var(--gx, -999px) var(--gy, -999px), color-mix(in oklab, var(--foreground) 4%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}

export default GridBackdrop;
