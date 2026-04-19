"use client";

import {
  CommandPalette,
  type CommandPaletteItem,
  type CommandPaletteProps,
} from "@/components/ui/command-palette";
import {
  ArrowRight,
  Copy,
  FileText,
  Github,
  Home,
  LaptopMinimal,
  MoonStar,
  Sparkles,
  SunMedium,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type AppCommandBarProps = Omit<CommandPaletteProps, "commands" | "historyKey">;

export default function CommandBar(props: AppCommandBarProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const commands = useMemo<CommandPaletteItem[]>(
    () => [
      {
        id: "go-home",
        title: "Open Home",
        subtitle: "Jump back to the landing page",
        section: "Navigation",
        keywords: ["landing", "start", "main"],
        shortcut: "mod+h",
        icon: Home,
        run: () => router.push("/"),
      },
      {
        id: "go-work",
        title: "Browse Work",
        subtitle: "Open the project showcase",
        section: "Navigation",
        keywords: ["portfolio", "projects", "case studies"],
        shortcut: "mod+w",
        icon: LaptopMinimal,
        run: () => router.push("/work"),
      },
      {
        id: "go-blog",
        title: "Read the Blog",
        subtitle: "Open recent writing and notes",
        section: "Navigation",
        keywords: ["articles", "posts", "writing"],
        icon: FileText,
        run: () => router.push("/blog"),
      },
      {
        id: "go-contact",
        title: "Start a Conversation",
        subtitle: "Jump to the contact page",
        section: "Navigation",
        keywords: ["email", "hire", "reach out"],
        icon: ArrowRight,
        run: () => router.push("/contact"),
      },
      {
        id: "toggle-theme",
        title: resolvedTheme === "dark" ? "Switch to Light" : "Switch to Dark",
        subtitle: "Flip the interface theme instantly",
        section: "Workspace",
        keywords: ["appearance", "mode", "theme"],
        shortcut: "mod+shift+l",
        icon: resolvedTheme === "dark" ? SunMedium : MoonStar,
        run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
      {
        id: "copy-email",
        title: "Copy Email",
        subtitle: "Copy contact details to the clipboard",
        section: "Quick Actions",
        keywords: ["mail", "clipboard", "copy"],
        shortcut: "mod+shift+c",
        icon: Copy,
        run: () => navigator.clipboard.writeText("ankit21022002@gmail.com"),
      },
      {
        id: "scroll-top",
        title: "Scroll to Top",
        subtitle: "Snap back to the beginning of the page",
        section: "Quick Actions",
        keywords: ["top", "scroll", "jump"],
        icon: Sparkles,
        run: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      },
      {
        id: "open-github",
        title: "Open GitHub",
        subtitle: "Launch the external profile in a new tab",
        section: "Links",
        keywords: ["source", "repositories", "profile"],
        icon: Github,
        run: () =>
          window.open("https://github.com/2102ankit", "_blank", "noopener"),
      },
    ],
    [resolvedTheme, router, setTheme],
  );

  return (
    <CommandPalette
      commands={commands}
      historyKey="ankit.command-bar.history"
      {...props}
    />
  );
}

