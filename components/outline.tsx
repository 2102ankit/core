"use client";

import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { setOutlineHeadings, type OutlineHeading } from "@/lib/outline-store";

type Heading = OutlineHeading;

// How far from the top of the viewport a heading must be before it's "active".
// Should roughly match the page's sticky-header height.
const SCROLL_THRESHOLD = 200;

function scrollToHeading(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - 80,
    behavior: "smooth",
  });
}

/**
 * Scroll-synced active-heading tracking, shared by every outline variant.
 * Also registers the headings so other UI (e.g. the mobile menu) can
 * present them.
 */
function useActiveHeading(headings: Heading[]) {
  const [activeId, setActiveId] = useState(() => headings[0]?.id ?? "");

  const suppressScrollRef = useRef(false);
  const suppressTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // Briefly ignore scroll events after programmatic scrolls so the active
  // state doesn't flicker through intermediate sections.
  const suppress = useCallback((duration: number) => {
    suppressScrollRef.current = true;
    clearTimeout(suppressTimerRef.current);
    suppressTimerRef.current = setTimeout(() => {
      suppressScrollRef.current = false;
    }, duration);
  }, []);

  // Register for consumers like the mobile navigation drawer
  useEffect(() => {
    setOutlineHeadings(headings.length ? headings : null);
    // Don't clear on unmount — the page-level RegisterOutlineHeadings
    // owns the store lifecycle; clearing here would wipe headings when
    // the mobile outline unmounts (e.g. after navigating via menu).
  }, [headings]);

  // Any direct user input cancels an in-flight suppression
  useEffect(() => {
    const clearSuppress = () => {
      if (!suppressScrollRef.current) return;
      clearTimeout(suppressTimerRef.current);
      suppressScrollRef.current = false;
    };

    window.addEventListener("keydown", clearSuppress);
    window.addEventListener("wheel", clearSuppress, { passive: true });
    window.addEventListener("touchstart", clearSuppress, { passive: true });
    window.addEventListener("pointerdown", clearSuppress, { passive: true });

    return () => {
      window.removeEventListener("keydown", clearSuppress);
      window.removeEventListener("wheel", clearSuppress);
      window.removeEventListener("touchstart", clearSuppress);
      window.removeEventListener("pointerdown", clearSuppress);
    };
  }, []);

  useEffect(() => {
    if (!headings.length) return;
    const documentTops = new Map<string, number>();
    const cacheTops = () => {
      for (const { id } of headings) {
        const el = document.getElementById(id);
        if (el) {
          documentTops.set(id, el.getBoundingClientRect().top + window.scrollY);
        }
      }
    };
    cacheTops();

    const detect = () => {
      if (suppressScrollRef.current) return;

      const scrollPos = window.scrollY + SCROLL_THRESHOLD;
      let nextActive = headings[0].id;

      for (const { id } of headings) {
        if ((documentTops.get(id) ?? 0) <= scrollPos) nextActive = id;
      }

      setActiveId((prev) => (prev === nextActive ? prev : nextActive));
    };

    const handleResize = () => {
      cacheTops();
      detect();
    };

    detect();
    window.addEventListener("scroll", detect, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", detect);
      window.removeEventListener("resize", handleResize);
    };
  }, [headings]);

  const scrollTo = useCallback(
    (id: string) => {
      setActiveId(id);
      suppress(1000);

      const el = document.getElementById(id);
      if (!el) return;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    },
    [suppress],
  );

  return { activeId, setActiveId, scrollTo, suppress };
}

/**
 * Headless registration for pages that want the mobile-menu outline
 * without rendering any visible outline UI (e.g. blog posts).
 */
export function RegisterOutlineHeadings({ headings }: { headings: Heading[] }) {
  useEffect(() => {
    setOutlineHeadings(headings.length ? headings : null);
    return () => setOutlineHeadings(null);
  }, [headings]);
  return null;
}

/* ── Floating rail (lg+) ─────────────────────────────────────────────── */

export function Outline({ headings }: { headings: Heading[] }) {
  const { activeId, setActiveId, scrollTo, suppress } =
    useActiveHeading(headings);

  const [initialHash] = useState(() =>
    typeof window !== "undefined" ? window.location.hash : "",
  );

  const hashSyncMountedRef = useRef(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const [pipPos, setPipPos] = useState({ top: 0, left: 0, visible: false });

  const updatePip = useCallback((id: string) => {
    const btn = buttonRefs.current.get(id);
    const wrapper = wrapperRef.current;
    if (!btn || !wrapper) return;

    const top = btn.offsetTop + btn.offsetHeight / 2 - 7;
    const paddingLeft = parseFloat(window.getComputedStyle(btn).paddingLeft);
    const left = Math.max(0, paddingLeft - 8);

    setPipPos({ top, left, visible: true });
  }, []);

  useLayoutEffect(() => {
    updatePip(activeId);
  }, [activeId, updatePip]);

  // Keep the URL hash in sync with the reading position
  useEffect(() => {
    if (!hashSyncMountedRef.current) {
      hashSyncMountedRef.current = true;
      return;
    }
    if (!activeId) return;
    const hash = `#${activeId}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  }, [activeId]);

  // Deep-link support: land on #section and settle there
  useEffect(() => {
    if (!initialHash) return;
    const id = initialHash.startsWith("#") ? initialHash.slice(1) : initialHash;
    if (!headings.find((h) => h.id === id)) return;

    setActiveId(id);
    suppress(1200);
    const t = setTimeout(() => {
      scrollToHeading(id);
    }, 120);
    return () => clearTimeout(t);
  }, [headings, initialHash, setActiveId, suppress]);

  useEffect(() => {
    const btn = buttonRefs.current.get(activeId);
    btn?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeId]);

  if (!headings.length) return null;

  return (
    <div
      className="hidden lg:block fixed right-8 top-24 w-56 xl:right-12 xl:w-64 2xl:w-72"
      style={{ height: "calc(100vh - 8rem)" }}
    >
      <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 backdrop-blur-sm h-full flex flex-col">
        <div className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 pl-2">
          On this page
        </div>

        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto pb-8 scrollbar-slim"
        >
          <div ref={wrapperRef} className="relative">
            <motion.div
              aria-hidden
              className="absolute w-1 h-3.5 bg-zinc-900 dark:bg-zinc-100 rounded-full pointer-events-none"
              animate={{
                top: pipPos.top,
                left: pipPos.left,
                opacity: pipPos.visible ? 1 : 0,
              }}
              transition={{
                top: { type: "spring", stiffness: 380, damping: 32, mass: 0.7 },
                left: {
                  type: "spring",
                  stiffness: 380,
                  damping: 32,
                  mass: 0.7,
                },
                opacity: { duration: 0.15 },
              }}
            />

            <ul className="space-y-0.5">
              {headings.map((heading, index) => {
                const isActive = activeId === heading.id;
                return (
                  <motion.li
                    key={heading.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.06 + index * 0.03,
                      type: "spring",
                      stiffness: 200,
                      damping: 24,
                    }}
                  >
                    <button
                      ref={(el) => {
                        if (el) buttonRefs.current.set(heading.id, el);
                        else buttonRefs.current.delete(heading.id);
                      }}
                      data-id={heading.id}
                      title={heading.text}
                      onClick={() => scrollTo(heading.id)}
                      className={[
                        "block w-full text-left py-1 pr-2 text-sm",
                        "transition-colors duration-150 truncate cursor-pointer",
                        heading.level === 2 ? "pl-2" : "pl-4",
                        isActive
                          ? "text-zinc-950 dark:text-zinc-50 font-medium"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300",
                      ].join(" ")}
                    >
                      {heading.text}
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Inline list (mobile / embedded) ─────────────────────────────────── */

export function OutlineInline({
  headings,
  className = "",
  onClose,
}: {
  headings: Heading[];
  className?: string;
  onClose?: () => void;
}) {
  const { activeId, scrollTo } = useActiveHeading(headings);

  if (!headings.length) return null;

  return (
    <nav aria-label="On this page" className={className}>
      <div className="text-caption font-medium uppercase tracking-widest text-muted-foreground mb-2">
        On this page
      </div>
      <ul className="relative space-y-0.5 border-l border-border pr-1">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li key={heading.id}>
              <button
                onClick={() => {
                  scrollTo(heading.id);
                  onClose?.();
                }}
                title={heading.text}
                className={[
                  "relative block w-full text-left py-1 pr-2 text-sm",
                  "transition-colors duration-150 truncate cursor-pointer",
                  heading.level === 2 ? "pl-3" : "pl-7",
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {isActive && (
                  <motion.span
                    layoutId="outline-inline-pip"
                    aria-hidden="true"
                    className="absolute -left-px top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-foreground"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 34,
                    }}
                  />
                )}
                {heading.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
