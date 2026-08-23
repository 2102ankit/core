"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  BookOpen01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";

export type ReadingItem = {
  title: string;
  url: string;
};

// Google Drive file pages can't be framed directly, but their /preview
// endpoint can.
function toEmbeddable(url: string): string {
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
  return url;
}

function ReadingList({
  items,
  onSelect,
}: {
  items: ReadingItem[];
  onSelect: (item: ReadingItem, e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  if (!items.length) {
    return (
      <p className="text-caption text-muted-foreground">Nothing here yet.</p>
    );
  }

  return (
    <ul className="space-y-1">
      {items.map((item, index) => (
        <li
          key={item.url}
          className="opacity-0 animate-fade-in-up"
          style={{ animationDelay: `${120 + index * 40}ms` }}
        >
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => onSelect(item, e)}
            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 -mx-3 text-body text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-fast"
          >
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              size={14}
              className="shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-fast text-foreground"
            />
            <span className="min-w-0 truncate">{item.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ReadingBrowser({
  whitepapers,
  blogs,
}: {
  whitepapers: ReadingItem[];
  blogs: ReadingItem[];
}) {
  const [selected, setSelected] = useState<ReadingItem | null>(null);
  const [frameLoading, setFrameLoading] = useState(true);

  const handleSelect = (
    item: ReadingItem,
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    // Split view is a large-screen luxury; phones/tablets use a new tab.
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    e.preventDefault();
    setFrameLoading(true);
    setSelected(item);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start ">
      
      <div className="w-full lg:flex-1 min-w-0 space-y-12 ">
      <div className="mb-12 opacity-0 animate-fade-in-up ">
        <h1 className="text-display text-foreground mb-4">Reading</h1>
        <p className="text-body text-muted-foreground max-w-2xl">
          Books, whitepapers and blogs that shape my thinking
        </p>
      </div>
        <section id="whitepapers" className="scroll-mt-28">
          <h2 className="text-title-2 text-foreground mb-2">
            White Papers
            {whitepapers.length > 0 && ` (${whitepapers.length})`}
          </h2>
          <p className="text-caption text-muted-foreground mb-4">
            Research worth the read time — opens in a side-by-side pane.
          </p>
          <ReadingList items={whitepapers} onSelect={handleSelect} />
        </section>

        <section id="blogs-i-follow" className="scroll-mt-28">
          <h2 className="text-title-2 text-foreground mb-2">
            Blogs I Follow
            {blogs.length > 0 && ` (${blogs.length})`}
          </h2>
          <p className="text-caption text-muted-foreground mb-4">
            People who write the way good engineers think.
          </p>
          <ReadingList items={blogs} onSelect={handleSelect} />
        </section>
      </div>

      
      <div className="hidden lg:block w-[46%] xl:max-w-[720px] flex-none sticky top-30 self-start">
        <AnimatePresence mode="wait" initial={false}>
          {selected ? (
            <motion.div
              key={selected.url}
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="rounded-xl border border-border bg-card shadow-elevation-2 overflow-hidden"
            >
              <header className="flex items-center gap-1.5 px-3 h-11 border-b border-border bg-muted/40">
                <span className="flex-1 min-w-0 truncate text-callout font-medium text-foreground">
                  {selected.title}
                </span>
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open in new tab"
                  title="Open in new tab"
                  className="size-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-fast"
                >
                  <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} />
                </a>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close reader"
                  title="Close"
                  className="size-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-fast cursor-pointer"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={15} />
                </button>
              </header>

              <div className="relative">
                {frameLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <span className="text-caption text-muted-foreground animate-pulse">
                      Loading…
                    </span>
                  </div>
                )}
                <iframe
                  src={toEmbeddable(selected.url)}
                  title={selected.title}
                  onLoad={() => setFrameLoading(false)}
                  className="w-full h-[calc(100vh-13rem)] bg-white"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reader-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-dashed border-border bg-muted/20 h-[calc(100svh-10rem)] min-h-72 flex flex-col items-center justify-center gap-3 text-center px-4"
            >
              <HugeiconsIcon
                icon={BookOpen01Icon}
                size={26}
                className="text-muted-foreground/50"
              />
              <p className="text-callout font-medium text-foreground">
                Split reading pane
              </p>
              <p className="text-caption text-muted-foreground max-w-56">
                Pick a whitepaper or blog and it opens right here — the list
                stays put, tiling-style.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ReadingBrowser;
