"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface OutlineProps {
  headings: Heading[];
}

export function Outline({ headings }: OutlineProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [started, setStarted] = useState(false);
  // Throttle scroll-driven active heading updates for smooth animations
  const tickingRef = useRef<boolean>(false);
  const activeIdRef = useRef<string>("");

  const listRef = useRef<HTMLUListElement | null>(null);
  const itemTransition = {
    type: "spring",
    stiffness: 180,
    damping: 22,
  } as const;

  // Initialize started state
  useEffect(() => {
    setStarted(true);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const updateActiveHeading = () => {
      const scrollY = window.scrollY;
      const headerOffset = 100;

      let currentActive = "";
      let lastVisible = "";

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const top = element.offsetTop - headerOffset;
          if (scrollY >= top) {
            currentActive = heading.id;
          }
          const rect = element.getBoundingClientRect();
          if (rect.top <= headerOffset && rect.bottom > headerOffset) {
            lastVisible = heading.id;
          }
        }
      }

      const newActive = lastVisible || currentActive;
      if (newActive && newActive !== activeIdRef.current) {
        activeIdRef.current = newActive;
        setActiveId(newActive);
      } else if (!newActive && headings.length > 0 && !activeIdRef.current) {
        activeIdRef.current = headings[0].id;
        setActiveId(headings[0].id);
      }
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(() => {
        updateActiveHeading();
        tickingRef.current = false;
      });
    };

    updateActiveHeading();
    window.addEventListener("scroll", handleScroll, { passive: true } as any);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  // Auto-scroll active item into view inside the outline list
  useEffect(() => {
    if (!activeId) return;
    const list = listRef.current;
    if (!list) return;
    const activeBtn = list.querySelector<HTMLButtonElement>(
      `button[data-id="${activeId}"]`,
    );
    if (activeBtn) {
      // If user is at the very top of the page, avoid auto-scrolling the list
      // so the header remains visible at the top of the container.
      const atTop = window.scrollY < 80;
      if (atTop) {
        return;
      }
      activeBtn.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeId]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (headings.length === 0) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: started ? 1 : 0, x: started ? 0 : 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="hidden lg:block fixed right-8 top-24 w-52"
      style={{ height: "calc(100vh - 8rem)" }}
    >
      <div
        className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 backdrop-blur-sm h-full"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 0,
        }}
      >
        <div className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 pl-2">
          On this page
        </div>
        <div
          style={{ flex: 1, minHeight: 0, overflowY: "auto" }}
          className="pb-8"
        >
          <ul className="space-y-0.5" ref={listRef}>
            {headings.map((heading, index) => (
              <motion.li
                key={heading.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1 + index * 0.04,
                  ...itemTransition,
                }}
              >
                <button
                  data-id={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={`block w-full text-left py-1 pr-2 text-sm transition-all duration-200 truncate cursor-pointer ${
                    heading.level === 2 ? "pl-2" : "pl-4"
                  } ${
                    activeId === heading.id
                      ? "text-zinc-950 dark:text-zinc-50 font-medium"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  <span className="relative">
                    {activeId === heading.id && (
                      <motion.span
                        layoutId="outline-indicator"
                        className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-3.5 bg-zinc-900 dark:bg-zinc-100 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                    {heading.text}
                  </span>
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.aside>
  );
}
