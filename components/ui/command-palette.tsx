"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { Clock3, Command, ExternalLink, Search } from "lucide-react";
import {
  type ComponentType,
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type CommandPaletteItem = {
  id: string;
  title: string;
  subtitle: string;
  section: string;
  keywords?: string[];
  shortcut?: string;
  icon: ComponentType<{ className?: string }>;
  kind?: "action" | "search";
  run: () => void | Promise<void>;
};

export type CommandPaletteProps = {
  commands: CommandPaletteItem[];
  defaultOpen?: boolean;
  emptyMessage?: string;
  emptyHint?: string;
  footerHint?: string;
  historyKey?: string;
  historyLimit?: number;
  inline?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  searchPlaceholder?: string;
  shortcutKey?: string;
};

// Global configuration for the command palette used by the command bar
// Controls which actions and search kinds are included by default
export const commandBarConfig = {
  includeActions: {
    home: true,
    work: true,
    blog: true,
    contact: true,
    theme: true,
    copyEmail: true,
    scrollTop: true,
    github: true,
  },
  includeSearchKinds: {
    page: true,
    blog: true,
    project: true,
    reading: true,
    about: true,
    link: true,
  },
} as const;

function fuzzyScore(command: CommandPaletteItem, rawQuery: string) {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return {
      exact: false,
      prefix: false,
      score: 1,
    };
  }

  const title = command.title.toLowerCase();
  const subtitle = command.subtitle.toLowerCase();
  const keywords = (command.keywords ?? []).map((keyword) =>
    keyword.toLowerCase(),
  );

  const sources = [title, subtitle, ...keywords];
  const words = sources.flatMap((source) =>
    source.split(/[^a-z0-9]+/).filter(Boolean),
  );

  const exact = words.includes(query) || sources.includes(query);
  const titleStartsWith = title.startsWith(query);
  const subtitleStartsWith = subtitle.startsWith(query);
  const prefix = words.some((word) => word.startsWith(query));
  const containsWord = words.some((word) => word.includes(query));
  const containsPhrase = sources.some((source) => source.includes(query));

  if (!exact && !prefix && !containsWord && !containsPhrase) {
    return null;
  }

  let score = 0;

  if (exact) {
    score += 400;
  }

  if (titleStartsWith) {
    score += 220;
  } else if (subtitleStartsWith) {
    score += 140;
  }

  if (prefix) {
    score += 180;
  } else if (containsWord) {
    score += 80;
  }

  if (containsPhrase) {
    score += 40;
  }

  const titleWordIndex = title
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .findIndex((word) => word === query || word.startsWith(query));

  if (titleWordIndex >= 0) {
    score += 30 - titleWordIndex * 2;
  }

  return {
    exact,
    prefix,
    score: score - title.length * 0.025,
  };
}

function highlightTitle(title: string, rawQuery: string) {
  const query = rawQuery.trim();

  if (!query) {
    return title;
  }

  const lowerTitle = title.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerTitle.indexOf(lowerQuery);

  if (index === -1) {
    return title;
  }

  return (
    <>
      {title.slice(0, index)}
      <span className="font-semibold underline decoration-current/35 underline-offset-4">
        {title.slice(index, index + query.length)}
      </span>
      {title.slice(index + query.length)}
    </>
  );
}

function readHistory(historyKey: string) {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    const stored = window.localStorage.getItem(historyKey);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as string[];
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === "string")
      : [];
  } catch {
    return [];
  }
}

function writeHistory(historyKey: string, entries: string[]) {
  window.localStorage.setItem(historyKey, JSON.stringify(entries));
}

function isMac() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.navigator.platform.toLowerCase().includes("mac");
}

function getShortcutLabel(shortcut?: string) {
  if (!shortcut) {
    return null;
  }

  return isMac()
    ? shortcut.replace("mod", "Cmd").replace("alt", "Opt")
    : shortcut.replace("mod", "Ctrl").replace("alt", "Alt");
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;
  return (
    target.isContentEditable ||
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT"
  );
}

export function CommandPalette({
  commands,
  defaultOpen = false,
  emptyHint = "Try a page name, an action like “copy”, or a keyword like “theme”.",
  emptyMessage = "No command matched that search.",
  footerHint = "Select a command",
  historyKey = "command-palette.history",
  historyLimit = 5,
  inline = false,
  onOpenChange,
  open: openProp,
  searchPlaceholder = "Type a command or search by intent",
  shortcutKey = "k",
}: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const shellRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: -1, y: -1 });
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [history, setHistory] = useState<string[]>(() =>
    readHistory(historyKey),
  );
  const [lastAction, setLastAction] = useState("Ready");

  const open = openProp ?? internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [onOpenChange, openProp],
  );

  useEffect(() => {
    setHistory(readHistory(historyKey));
  }, [historyKey]);

  const visibleCommands = useMemo(() => {
    const queryActive = query.trim().length > 0;

    if (queryActive) {
      return commands
        .map((command) => ({
          command,
          match: fuzzyScore(command, query),
          recent: history.includes(command.id),
        }))
        .filter(
          (
            item,
          ): item is typeof item & {
            match: { exact: boolean; prefix: boolean; score: number };
          } => item.match !== null,
        )
        .sort((a, b) => {
          if (a.match.exact !== b.match.exact) {
            return a.match.exact ? -1 : 1;
          }

          if (a.match.prefix !== b.match.prefix) {
            return a.match.prefix ? -1 : 1;
          }

          const aIsAction = (a.command.kind ?? "action") === "action";
          const bIsAction = (b.command.kind ?? "action") === "action";

          if (aIsAction !== bIsAction) {
            return aIsAction ? -1 : 1;
          }

          return b.match.score - a.match.score;
        });
    }

    return [
      ...history
        .map((entry) => commands.find((command) => command.id === entry))
        .filter((command): command is CommandPaletteItem => Boolean(command))
        .map((command) => ({ command, score: 999, recent: true })),
      ...commands
        .filter((command) => !history.includes(command.id))
        .map((command) => ({ command, score: 1, recent: false })),
    ];
  }, [commands, history, query]);

  const activeCommand = visibleCommands[activeIndex]?.command ?? null;
  const queryActive = query.trim().length > 0;

  useEffect(() => {
    if (!open) {
      return;
    }

    const focusInput = window.setTimeout(() => {
      inputRef.current?.focus();
      if (!inline) {
        inputRef.current?.select();
      }
    }, 30);

    return () => window.clearTimeout(focusInput);
  }, [inline, open]);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const container = listRef.current;
    const activeItem = itemRefs.current[activeIndex];

    if (!container || !activeItem) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    if (itemRect.top < containerRect.top) {
      container.scrollTop += itemRect.top - containerRect.top;
    } else if (itemRect.bottom > containerRect.bottom) {
      container.scrollTop += itemRect.bottom - containerRect.bottom;
    }
  }, [activeIndex, open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const normalizedShortcut = shortcutKey.toLowerCase();
      const toggleWithModifiers =
        (event.metaKey || event.ctrlKey) && key === normalizedShortcut;
      const toggleWithPlainKey =
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        key === normalizedShortcut &&
        !isTypingTarget(event.target);

      if (toggleWithModifiers || toggleWithPlainKey) {
        event.preventDefault();
        setOpen(true);
        setActiveIndex(0);
        inputRef.current?.focus();
        inputRef.current?.select();
        return;
      }

      if (!open) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        if (query) {
          setQuery("");
          setActiveIndex(0);
          return;
        }

        if (!inline) {
          setOpen(false);
        } else {
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [inline, open, query, setOpen, shortcutKey]);

  const runCommand = useCallback(
    async (command: CommandPaletteItem) => {
      await command.run();

      const nextHistory = [
        command.id,
        ...history.filter((entry) => entry !== command.id),
      ].slice(0, historyLimit);

      setHistory(nextHistory);
      writeHistory(historyKey, nextHistory);
      setLastAction(command.title);
      setQuery("");
      setActiveIndex(0);

      if (!inline) {
        setOpen(false);
      } else {
        inputRef.current?.focus();
      }
    },
    [history, historyKey, historyLimit, inline, setOpen],
  );

  function handlePointerMove(index: number, x: number, y: number) {
    const moved =
      Math.abs(pointerRef.current.x - x) > 1 ||
      Math.abs(pointerRef.current.y - y) > 1;

    if (!moved) {
      return;
    }

    pointerRef.current = { x, y };
    setActiveIndex(index);
  }

  async function onInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (!visibleCommands.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) =>
        Math.min(index + 1, visibleCommands.length - 1),
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }

    if (event.key === "Enter") {
      event.preventDefault();
      await runCommand(visibleCommands[activeIndex].command);
    }
  }

  if (!open) {
    return null;
  }

  const shell = (
    <motion.div
      ref={shellRef}
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.985 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn(
        "flex w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white/96 shadow-[0_28px_90px_-40px_rgba(15,23,42,0.45)] dark:border-zinc-800 dark:bg-zinc-950/96",
        inline ? "h-full max-h-[min(78vh,620px)]" : "max-h-[min(82vh,640px)]",
      )}
    >
      <div className="border-b border-zinc-200/80 px-4 pt-4 dark:border-zinc-800">
        <div className="flex items-center gap-3 rounded-[20px] border border-zinc-200 bg-zinc-50/90 px-4 py-3 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50">
          <Search className="size-4 text-zinc-500 dark:text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder={searchPlaceholder}
            className="h-6 flex-1 bg-transparent text-sm text-zinc-950 outline-none placeholder:text-zinc-500 dark:text-zinc-50 dark:placeholder:text-zinc-400"
          />
          <div className="hidden items-center gap-2 sm:flex">
            <kbd className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
              {shortcutKey.toUpperCase()}
            </kbd>
            <kbd className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
              Esc
            </kbd>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 pb-3 pt-3 text-xs text-zinc-600 dark:text-zinc-400">
          <span>
            {queryActive
              ? `${visibleCommands.length} matching commands`
              : history.length
                ? "Recent first, then everything else"
                : "Start typing or browse all commands"}
          </span>
          <span className="flex items-center gap-1">
            <Clock3 className="size-3.5" />
            {history.length} recent
          </span>
        </div>
      </div>

      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-3">
        {visibleCommands.length ? (
          <div className="space-y-2">
            {visibleCommands.map(({ command, recent }, index) => {
              const Icon = command.icon;

              return (
                <button
                  key={command.id}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  type="button"
                  onPointerMove={(event) =>
                    handlePointerMove(index, event.clientX, event.clientY)
                  }
                  onClick={() => void runCommand(command)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[20px] border px-4 py-3 text-left transition-none",
                    index === activeIndex
                      ? "border-zinc-950 bg-zinc-950 text-white shadow-lg dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
                      : "border-zinc-200/80 bg-white text-zinc-950 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-zinc-700",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-11 items-center justify-center rounded-2xl",
                      index === activeIndex
                        ? "bg-white/12 text-white dark:bg-zinc-950/10 dark:text-zinc-950"
                        : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
                    )}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">
                        {highlightTitle(command.title, query)}
                      </span>
                      {recent && !queryActive && (
                        <span className="rounded-full border border-current/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] opacity-70">
                          Recent
                        </span>
                      )}
                    </div>
                    <p
                      className={cn(
                        "truncate text-xs",
                        index === activeIndex
                          ? "text-white/72 dark:text-zinc-700"
                          : "text-zinc-600 dark:text-zinc-400",
                      )}
                    >
                      {command.subtitle}
                    </p>
                  </div>

                  <div className="hidden text-right sm:block">
                    <p
                      className={cn(
                        "text-[11px] uppercase tracking-[0.22em]",
                        index === activeIndex
                          ? "text-white/60 dark:text-zinc-600"
                          : "text-zinc-500 dark:text-zinc-500",
                      )}
                    >
                      {command.section}
                    </p>
                    {command.shortcut && (
                      <p
                        className={cn(
                          "mt-1 text-[11px]",
                          index === activeIndex
                            ? "text-white/72 dark:text-zinc-700"
                            : "text-zinc-600 dark:text-zinc-400",
                        )}
                      >
                        {getShortcutLabel(command.shortcut)}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[22px] border border-dashed border-zinc-300 px-6 py-10 text-center dark:border-zinc-700">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {emptyMessage}
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {emptyHint}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-zinc-200/80 px-4 py-3 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-700">
            ↑↓ navigate
          </span>
          <span className="rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-700">
            Enter run
          </span>
          <span className="hidden rounded-md border border-zinc-200 px-2 py-1 dark:border-zinc-700 sm:inline-flex">
            <Command className="mr-1 size-3" />
            {isMac()
              ? `Cmd ${shortcutKey.toUpperCase()}`
              : `Ctrl ${shortcutKey.toUpperCase()}`}
          </span>
        </div>
        <span className="hidden sm:flex items-center gap-2">
          <ExternalLink className="size-3.5 opacity-60" />
        </span>
      </div>
    </motion.div>
  );

  if (inline) {
    return (
      <div className="flex h-full min-h-0 w-full items-start justify-center p-3 sm:p-5">
        {shell}
      </div>
    );
  }

  return (
    <AnimatePresence initial={false}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/45 px-4 py-10 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      >
        <div
          className="flex min-h-full items-start justify-center pt-8"
          onClick={(event) => {
            if (shellRef.current?.contains(event.target as Node)) {
              event.stopPropagation();
            }
          }}
        >
          {shell}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
