"use client";

import {
  commandBarConfig,
  CommandPalette,
  type CommandPaletteItem,
  type CommandPaletteProps,
} from "@/components/ui/command-palette";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Copy,
  FileText,
  Github,
  Home,
  LaptopMinimal,
  Link2,
  MoonStar,
  Newspaper,
  Sparkles,
  SunMedium,
  UserRound,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type SearchIndexEntry = {
  id: string;
  title: string;
  subtitle: string;
  section: string;
  keywords?: string[];
  href: string;
  external?: boolean;
  kind: "page" | "blog" | "project" | "reading" | "about" | "link";
};

type AppCommandBarProps = Omit<CommandPaletteProps, "commands" | "historyKey">;

function getSearchIcon(kind: SearchIndexEntry["kind"]) {
  switch (kind) {
    case "blog":
      return Newspaper;
    case "project":
      return Briefcase;
    case "reading":
      return BookOpen;
    case "about":
      return UserRound;
    case "link":
      return Link2;
    default:
      return Home;
  }
}

export default function CommandBar(props: AppCommandBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [searchEntries, setSearchEntries] = useState<SearchIndexEntry[]>([]);

  const navigateToHref = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.origin);
      const targetPath = `${url.pathname}${url.search}`;
      const hash = url.hash.replace(/^#/, "");

      const scrollToHash = () => {
        if (!hash) {
          return;
        }

        let attempts = 0;

        const tryScroll = () => {
          const element = document.getElementById(hash);
          if (element && element.offsetParent !== null) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
          }

          if (attempts < 40) {
            attempts += 1;
            window.setTimeout(tryScroll, 100);
          }
        };

        tryScroll();
      };

      if (targetPath === pathname) {
        window.history.pushState(null, "", `${targetPath}${url.hash}`);
        scrollToHash();
        return;
      }

      router.push(`${targetPath}${url.hash}`);
      window.setTimeout(scrollToHash, 150);
    },
    [pathname, router],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadSearchEntries() {
      try {
        const response = await fetch("/api/search-index", {
          method: "GET",
          // cache: "force-cache",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as SearchIndexEntry[];
        if (!cancelled) {
          setSearchEntries(data);
        }
      } catch {
        // Keep palette usable even if search index loading fails.
      }
    }

    void loadSearchEntries();

    return () => {
      cancelled = true;
    };
  }, []);

  const commands = useMemo<CommandPaletteItem[]>(() => {
    const actionCommands: (CommandPaletteItem | null)[] = [
      commandBarConfig.includeActions.home
        ? {
            id: "go-home",
            title: "Open Home",
            subtitle: "Jump back to the landing page",
            section: "Navigation",
            keywords: ["landing", "start", "main"],
            // shortcut: "mod+h",
            icon: Home,
            kind: "action" as const,
            run: () => navigateToHref("/"),
          }
        : null,
      commandBarConfig.includeActions.work
        ? {
            id: "go-work",
            title: "Browse Work",
            subtitle: "Open the project showcase",
            section: "Navigation",
            keywords: ["portfolio", "projects", "case studies"],
            // shortcut: "mod+w",
            icon: LaptopMinimal,
            kind: "action" as const,
            run: () => navigateToHref("/work"),
          }
        : null,
      commandBarConfig.includeActions.blog
        ? {
            id: "go-blog",
            title: "Read the Blog",
            subtitle: "Open recent writing and notes",
            section: "Navigation",
            keywords: ["articles", "posts", "writing"],
            icon: FileText,
            kind: "action" as const,
            run: () => navigateToHref("/blog"),
          }
        : null,
      commandBarConfig.includeActions.contact
        ? {
            id: "go-contact",
            title: "Start a Conversation",
            subtitle: "Jump to the contact page",
            section: "Navigation",
            keywords: ["email", "hire", "reach out"],
            icon: ArrowRight,
            kind: "action" as const,
            run: () => navigateToHref("/contact"),
          }
        : null,
      commandBarConfig.includeActions.theme
        ? {
            id: "toggle-theme",
            title:
              resolvedTheme === "dark" ? "Switch to Light" : "Switch to Dark",
            subtitle: "Flip the interface theme instantly",
            section: "Workspace",
            keywords: ["appearance", "mode", "theme", "dark","light"],
            // shortcut: "mod+shift+l",
            icon: resolvedTheme === "dark" ? SunMedium : MoonStar,
            kind: "action" as const,
            run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
          }
        : null,
      commandBarConfig.includeActions.copyEmail
        ? {
            id: "copy-email",
            title: "Copy Email",
            subtitle: "Copy contact details to the clipboard",
            section: "Quick Actions",
            keywords: ["mail", "clipboard", "copy"],
            // shortcut: "mod+shift+c",
            icon: Copy,
            kind: "action" as const,
            run: () => navigator.clipboard.writeText("2102ankitm@gmail.com"),
          }
        : null,
      commandBarConfig.includeActions.scrollTop
        ? {
            id: "scroll-top",
            title: "Scroll to Top",
            subtitle: "Snap back to the beginning of the page",
            section: "Quick Actions",
            keywords: ["top", "scroll", "jump"],
            icon: Sparkles,
            kind: "action" as const,
            run: () => window.scrollTo({ top: 0, behavior: "smooth" }),
          }
        : null,
      commandBarConfig.includeActions.github
        ? {
            id: "open-github",
            title: "Open GitHub",
            subtitle: "Launch the external profile in a new tab",
            section: "Links",
            keywords: ["source", "repositories", "profile"],
            icon: Github,
            kind: "action" as const,
            run: () =>
              window.open("https://github.com/2102ankit", "_blank", "noopener"),
          }
        : null,
    ];
    const filteredActionCommands = actionCommands.filter(
      (command): command is CommandPaletteItem => Boolean(command),
    );

    const searchCommands: CommandPaletteItem[] = searchEntries
      .filter((entry) => commandBarConfig.includeSearchKinds[entry.kind])
      .map((entry) => ({
        id: entry.id,
        title: entry.title,
        subtitle: entry.subtitle,
        section: entry.section,
        keywords: entry.keywords,
        icon: getSearchIcon(entry.kind),
        kind: "search" as const,
        run: () => {
          if (entry.external) {
            window.open(entry.href, "_blank", "noopener");
            return;
          }

          navigateToHref(entry.href);
        },
      }));

    return [...filteredActionCommands, ...searchCommands];
  }, [navigateToHref, resolvedTheme, searchEntries, setTheme]);

  return (
    <CommandPalette
      commands={commands}
      historyKey="ankit.command-bar.history"
      {...props}
    />
  );
}
