"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckIcon,
  Copy01Icon,
  SourceCodeIcon,
  EyeIcon,
} from "@hugeicons/core-free-icons";
import { motion } from "framer-motion";
import { useState } from "react";
import type { ComponentDocs, PropDoc } from "@/lib/components-data";

type Tab = "demo" | "source";

/* ── Lightweight TS/TSX syntax highlighting ────────────────────────────
   Single regex pass over HTML-escaped source: comments, strings,
   keywords, numbers and JSX tag names. Good enough to read, tiny
   enough to ship.                                                      */

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for", "while",
  "do", "import", "from", "export", "default", "type", "interface", "extends",
  "implements", "new", "await", "async", "class", "try", "catch", "finally",
  "throw", "switch", "case", "break", "continue", "typeof", "instanceof",
  "in", "of", "as", "null", "undefined", "true", "false", "this", "super",
  "void", "readonly", "enum", "declare", "public", "private", "protected",
  "static", "satisfies", "keyof", "infer", "is",
]);

const TOKEN_RE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(&lt;\/?)([A-Za-z][\w.]*)|\b([A-Za-z_$][\w$]*)\b|\b(\d+(?:\.\d+)?)\b/g;

const SPAN = {
  comment:
    '<span class="italic text-zinc-400 dark:text-zinc-600 select-none">',
  string: '<span class="text-emerald-700 dark:text-emerald-400">',
  tag: '<span class="text-sky-700 dark:text-sky-400">',
  keyword: '<span class="text-violet-700 dark:text-violet-400">',
  number: '<span class="text-amber-700 dark:text-amber-400">',
  plain: '<span>',
} as const;

function escapeHTML(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function highlightSource(source: string): string {
  const escaped = escapeHTML(source);

  return escaped.replace(
    TOKEN_RE,
    (
      match,
      comment?: string,
      str?: string,
      bracket?: string,
      tagName?: string,
      word?: string,
      num?: string,
    ) => {
      const wrap = (cls: keyof typeof SPAN, text: string) =>
        `${SPAN[cls]}${text}</span>`;

      if (comment) return wrap("comment", comment);
      if (str) return wrap("string", str);
      if (bracket && tagName)
        return `${wrap("plain", bracket)}${wrap("tag", tagName)}`;
      if (word)
        return KEYWORDS.has(word) ? wrap("keyword", word) : match;
      if (num) return wrap("number", num);
      return match;
    },
  );
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for non-secure contexts
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

function PropsTable({ props }: { props: PropDoc[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="px-3 py-2.5 text-caption font-semibold uppercase tracking-wider text-muted-foreground">
              Prop
            </th>
            <th className="px-3 py-2.5 text-caption font-semibold uppercase tracking-wider text-muted-foreground">
              Type
            </th>
            <th className="px-3 py-2.5 text-caption font-semibold uppercase tracking-wider text-muted-foreground">
              Default
            </th>
            <th className="px-3 py-2.5 text-caption font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-b border-border/60 last:border-b-0">
              <td className="px-3 py-3 align-top">
                <code className="font-mono text-caption bg-muted px-1.5 py-0.5 rounded text-foreground whitespace-nowrap">
                  {prop.name}
                </code>
              </td>
              <td className="px-3 py-3 align-top">
                <code className="font-mono text-caption text-muted-foreground break-words">
                  {prop.type}
                </code>
              </td>
              <td className="px-3 py-3 align-top">
                <span className="text-caption text-muted-foreground">
                  {prop.default ?? "—"}
                </span>
              </td>
              <td className="px-3 py-3 align-top text-callout text-muted-foreground">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ComponentShell({
  source,
  sourcePath,
  docs,
  children,
}: {
  source: string;
  sourcePath?: string;
  docs?: ComponentDocs;
  children: React.ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("demo");
  const [copied, setCopied] = useState(false);

  const fileName = sourcePath?.split("/").pop();

  const handleCopy = async () => {
    if (await copyText(source)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="rounded-xl border border-border bg-background shadow-elevation-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-border px-2 sm:px-3 h-12">
          <div role="tablist" aria-label="Component preview" className="flex gap-0.5 sm:gap-1 h-full">
            {(
              [
                { id: "demo" as Tab, label: "Demo", icon: EyeIcon },
                { id: "source" as Tab, label: "Source", icon: SourceCodeIcon },
              ]
            ).map(({ id, label, icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(id)}
                  className={`relative flex items-center gap-1.5 px-3 sm:px-4 h-full text-callout font-medium transition-fast cursor-pointer ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <HugeiconsIcon icon={icon} size={15} />
                  {label}
                  {active && (
                    <motion.span
                      layoutId="component-shell-tab"
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-foreground"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pr-1">
            {tab === "source" && fileName && (
              <span className="hidden md:inline-flex font-mono text-footnote text-muted-foreground truncate max-w-48">
                {fileName}
              </span>
            )}
            {tab === "source" && (
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <HugeiconsIcon
                  icon={copied ? CheckIcon : Copy01Icon}
                  size={14}
                  className={copied ? "text-green-600 dark:text-green-400" : ""}
                />
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </div>
        </div>

        {tab === "demo" ? (
          <div className="p-4 sm:p-6 overflow-x-auto">{children}</div>
        ) : (
          <pre className="bg-muted/30 p-4 sm:p-5 overflow-auto max-h-[32rem] text-xs sm:text-[13px] leading-relaxed font-mono">
            <code
              dangerouslySetInnerHTML={{ __html: highlightSource(source) }}
            />
          </pre>
        )}
      </div>

      
      {docs && (docs.intro || docs.props?.length || docs.notes?.length) ? (
        <section aria-label="Documentation" className="space-y-4">
          <h2 className="text-title-3 text-foreground">Documentation</h2>

          {docs.intro && (
            <p className="text-body text-muted-foreground max-w-3xl">
              {docs.intro}
            </p>
          )}

          {docs.props?.length ? (
            <>
              <h3 className="text-headline text-foreground pt-1">Props</h3>
              <PropsTable props={docs.props} />
            </>
          ) : null}

          {docs.notes?.length ? (
            <ul className="space-y-2">
              {docs.notes.map((note) => (
                <li
                  key={note}
                  className="flex gap-2.5 text-callout text-muted-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[7px] size-1 rounded-full bg-muted-foreground shrink-0"
                  />
                  {note}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

export default ComponentShell;
