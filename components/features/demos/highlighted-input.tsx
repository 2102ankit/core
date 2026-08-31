"use client";
import {
  ClipboardEvent,
  CSSProperties,
  Dispatch,
  FC,
  KeyboardEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";

// Types

export interface HighlightRule {
  key: string;
  case_sensitive?: boolean; // default: true
  color?: string; // any CSS color, default: "lightblue"
  bold?: boolean; // default: false
  italics?: boolean; // default: false
}

interface HighlightedInputProps {
  config: HighlightRule[];
  placeholder?: string;
}

interface ConfigEditorProps {
  config: HighlightRule[];
  onChange: (next: HighlightRule[]) => void;
}

// Constants

const DEFAULT_CONFIG: HighlightRule[] = [
  {
    key: "AND",
    case_sensitive: false,
    color: "#e53e3e",
    bold: true,
    italics: false,
  },
  {
    key: "OR",
    case_sensitive: false,
    color: "#3182ce",
    bold: true,
    italics: false,
  },
  {
    key: "NOT",
    case_sensitive: false,
    color: "#d69e2e",
    bold: false,
    italics: true,
  },
  {
    key: "IN",
    case_sensitive: true,
    color: "#38a169",
    bold: false,
    italics: false,
  },
];

const BLANK_RULE: HighlightRule = {
  key: "",
  case_sensitive: true,
  color: "#3182ce",
  bold: false,
  italics: false,
};

// Cursor helpers

function getCaretOffset(el: HTMLElement): number {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return 0;
  const range = sel.getRangeAt(0).cloneRange();
  range.selectNodeContents(el);
  range.setEnd(sel.getRangeAt(0).endContainer, sel.getRangeAt(0).endOffset);
  return range.toString().length;
}

function setCaretOffset(el: HTMLElement, offset: number): void {
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  let chars = 0;
  let found = false;

  function walk(node: Node): void {
    if (found) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const len = (node.textContent ?? "").length;
      if (chars + len >= offset) {
        range.setStart(node, offset - chars);
        range.collapse(true);
        found = true;
      }
      chars += len;
    } else {
      for (const child of Array.from(node.childNodes)) {
        walk(child);
        if (found) break;
      }
    }
  }

  walk(el);
  if (!found) {
    range.selectNodeContents(el);
    range.collapse(false);
  }
  sel.removeAllRanges();
  sel.addRange(range);
}

// HTML builder

function escapeHTML(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildHTML(text: string, config: HighlightRule[]): string {
  if (!text) return "";

  const rules = [...config]
    .filter((c) => c.key.length > 0)
    .sort((a, b) => b.key.length - a.key.length);

  if (!rules.length) return escapeHTML(text);

  const pattern = rules
    .map((c) => `\\b${c.key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`)
    .join("|");

  const regex = new RegExp(`(${pattern})`, "gi");

  return text
    .split(regex)
    .map((part) => {
      const match = rules.find((c) =>
        c.case_sensitive === false
          ? c.key.toLowerCase() === part.toLowerCase()
          : c.key === part,
      );

      if (!match) return escapeHTML(part);

      const color = match.color ?? "lightblue";
      const styles: string[] = [
        `color:${color}`,
        `background:${color}22`,
        "border-radius:3px",
        "padding:0 2px",
        ...(match.bold ? ["font-weight:700"] : []),
        ...(match.italics ? ["font-style:italic"] : []),
      ];

      return `<mark style="${styles.join(";")}">${escapeHTML(part)}</mark>`;
    })
    .join("");
}

// Shared input classes — theme-aware via tokens, sized to avoid iOS zoom-on-focus
const sharedInputClasses =
  "font-sans text-base sm:text-sm bg-background text-foreground caret-foreground placeholder:text-muted-foreground border border-border rounded-md outline-none focus:border-ring/60 focus:ring-2 focus:ring-ring/25 transition-[border-color,box-shadow] duration-150 cursor-text";

const sharedInputStyle: CSSProperties = {
  lineHeight: 1.6,
  padding: "8px 12px",
  whiteSpace: "pre",
  overflowX: "auto",
  overflowY: "hidden",
  minHeight: "42px",
  boxSizing: "border-box",
  width: "100%",
};

export const HighlightedInput: FC<HighlightedInputProps> = ({
  config,
  placeholder = "Type here\u2026",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [empty, setEmpty] = useState<boolean>(true);

  const rerender = useCallback(
    (text: string, caretAt?: number): void => {
      const el = ref.current;
      if (!el) return;
      el.innerHTML = buildHTML(text, config);
      setEmpty(text.length === 0);
      if (document.activeElement === el && caretAt !== undefined) {
        setCaretOffset(el, caretAt);
      }
    },
    [config],
  );

  const handleInput = useCallback((): void => {
    const el = ref.current;
    if (!el) return;
    const caret = getCaretOffset(el);
    rerender(el.textContent ?? "", caret);
  }, [rerender]);

  const handlePaste = useCallback((e: ClipboardEvent<HTMLDivElement>): void => {
    e.preventDefault();
    document.execCommand(
      "insertText",
      false,
      e.clipboardData.getData("text/plain"),
    );
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>): void => {
      if (e.key === "Enter") e.preventDefault();
    },
    [],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    rerender(el.textContent ?? "", undefined);
  }, [config, rerender]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    rerender(
      "SELECT * FROM users WHERE name='Ankit' and age NOT IN (21,22,23)",
      undefined,
    );
  }, []);

  return (
    <div className="relative w-full">
      {empty && (
        <span
          aria-hidden="true"
          className={`absolute inset-0 block pointer-events-none select-none border-transparent ${sharedInputClasses}`}
          style={sharedInputStyle}
        >
          {placeholder}
        </span>
      )}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        role="textbox"
        aria-label="Highlighted keyword input"
        aria-multiline="false"
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className={`block ${sharedInputClasses}`}
        style={sharedInputStyle}
      />
    </div>
  );
};

// Config editor

// One grid on sm+: keyword | case | color | bold | italic | delete.
// Below sm+ everything lives in a labelled rule card; the controls share
// one flex row so keyword/case/color/B/I/delete all read at equal weight.

const fieldClasses =
  "h-9 w-full min-w-0 rounded-md border border-border bg-background px-2.5 text-callout text-foreground placeholder:text-muted-foreground outline-none focus:border-ring/60 focus:ring-2 focus:ring-ring/25 transition-[border-color,box-shadow] duration-150";

function CaseSegmented({
  value,
  onChange,
}: {
  value: boolean; // true = exact (case sensitive)
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Case sensitivity"
      className="flex h-9 w-full sm:w-auto min-w-0 items-stretch rounded-md border border-border bg-muted/50 p-[3px] gap-px sm:gap-[3px]"
    >
      {(
        [
          { label: "Exact", val: true, title: "Case sensitive" },
          { label: "Ignore", val: false, title: "Ignore case" },
        ] as const
      ).map((opt) => {
        const active = value === opt.val;
        return (
          <button
            key={opt.label}
            type="button"
            title={opt.title}
            aria-pressed={active}
            onClick={() => onChange(opt.val)}
            className={`flex-1 sm:flex-none sm:min-w-[60px] px-2 rounded-sm text-caption font-medium transition-fast cursor-pointer ${
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function StyleToggle({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`size-8 shrink-0 flex items-center justify-center rounded-md border text-headline leading-none transition-fast cursor-pointer ${
        active
          ? "bg-foreground text-background border-transparent"
          : "border-border text-muted-foreground hover:text-foreground hover:bg-accent/60"
      }`}
    >
      <span className={label === "Italic" ? "italic" : "font-bold"}>
        {label === "Italic" ? "I" : "B"}
      </span>
    </button>
  );
}

const ConfigEditor: FC<ConfigEditorProps> = ({ config, onChange }) => {
  const [jsonMode, setJsonMode] = useState<boolean>(false);
  const [jsonText, setJsonText] = useState<string>(() =>
    JSON.stringify(config, null, 2),
  );
  const [jsonError, setJsonError] = useState<string>("");

  const push = (next: HighlightRule[]): void => {
    onChange(next);
    setJsonText(JSON.stringify(next, null, 2));
  };

  const update = <K extends keyof HighlightRule>(
    i: number,
    key: K,
    value: HighlightRule[K],
  ): void => {
    push(config.map((c, idx) => (idx === i ? { ...c, [key]: value } : c)));
  };

  const applyJson = (text: string): void => {
    setJsonText(text);
    try {
      const parsed: unknown = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error("must be an array");
      setJsonError("");
      onChange(parsed as HighlightRule[]);
    } catch (e) {
      setJsonError((e as Error).message);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-4 mt-6 mb-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-callout font-medium text-muted-foreground">
          Config
        </span>
        <ModeToggle jsonMode={jsonMode} setJsonMode={setJsonMode} />
      </div>

      {jsonMode ? (
        <div>
          <textarea
            value={jsonText}
            onChange={(e) => applyJson(e.target.value)}
            spellCheck={false}
            className="block w-full min-h-40 p-2.5 rounded-md border border-border bg-background text-foreground font-mono text-xs resize-y outline-none focus:border-ring/60 focus:ring-2 focus:ring-ring/25 transition-[border-color,box-shadow] duration-150"
          />
          {jsonError && (
            <p className="text-caption text-destructive mt-1.5">{jsonError}</p>
          )}
        </div>
      ) : (
        <div>
          {config.map((row, i) => (
            <div
              key={i}
              className={`rounded-lg sm:rounded-none ${
                i > 0
                  ? "mt-2.5 pt-2.5 border-t border-border sm:mt-2 sm:pt-2 sm:border-t-0"
                  : ""
              }`}
            >
              
              <div className="flex items-center justify-between mb-2 sm:hidden">
                <span className="text-footnote font-semibold uppercase tracking-widest text-muted-foreground">
                  Rule {i + 1}
                </span>
              </div>

              
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_128px_36px_36px_36px_36px] sm:gap-x-1.5 sm:items-center">
                <input
                  value={row.key}
                  onChange={(e) => update(i, "key", e.target.value)}
                  placeholder="keyword"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className={fieldClasses}
                />

                
                <div className="flex items-center justify-between gap-2 sm:contents">
                  <CaseSegmented
                    value={row.case_sensitive !== false}
                    onChange={(v) => update(i, "case_sensitive", v)}
                  />

                  <div className="flex items-center gap-1.5">
                    
                    <input
                      type="color"
                      value={row.color ?? "#3182ce"}
                      onChange={(e) => update(i, "color", e.target.value)}
                      title="Highlight color"
                      aria-label={`Color for rule ${i + 1}`}
                      className="size-8 shrink-0 rounded-full appearance-none border border-border bg-transparent p-0 cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none"
                    />

                    <StyleToggle
                      active={!!row.bold}
                      label="Bold"
                      onClick={() => update(i, "bold", !row.bold)}
                    />
                    <StyleToggle
                      active={!!row.italics}
                      label="Italic"
                      onClick={() => update(i, "italics", !row.italics)}
                    />

                    <button
                      type="button"
                      onClick={() => push(config.filter((_, idx) => idx !== i))}
                      disabled={config.length <= 1}
                      aria-label={`Remove rule ${i + 1}`}
                      title="Remove rule"
                      className="size-8 shrink-0 flex items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-fast disabled:opacity-40 disabled:pointer-events-none cursor-pointer disabled:cursor-not-allowed"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => push([...config, { ...BLANK_RULE }])}
            className="mt-3 px-3.5 py-1.5 text-caption font-medium rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-fast cursor-pointer w-full sm:w-auto"
          >
            + add rule
          </button>
        </div>
      )}
    </div>
  );
};

// HighlightedInputDemo

const HighlightedInputDemo: FC = () => {
  const [config, setConfig] = useState<HighlightRule[]>(DEFAULT_CONFIG);

  return (
    <div className="w-full max-w-[680px] mx-auto px-4 py-8 sm:py-10">
      <HighlightedInput
        config={config}
        placeholder="Try: SELECT * FROM users WHERE name='Ankit' and age NOT IN (21,22,23)"
      />
      <div className="mt-3 flex flex-wrap gap-1.5">
        {config
          .filter((c) => c.key.length > 0)
          .map((c, i) => (
            <span
              key={i}
              className="text-caption px-2 py-0.5 rounded-full font-medium"
              style={{
                background: `${c.color ?? "#90cdf4"}22`,
                color: c.color ?? "#3182ce",
                fontWeight: c.bold ? 700 : 400,
                fontStyle: c.italics ? "italic" : "normal",
                border: `1px solid ${c.color ?? "#3182ce"}44`,
              }}
            >
              {c.key}
            </span>
          ))}
      </div>
      <ConfigEditor config={config} onChange={setConfig} />
    </div>
  );
};

export default HighlightedInputDemo;

function ModeToggle({
  jsonMode,
  setJsonMode,
}: {
  jsonMode: boolean;
  setJsonMode: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="inline-flex items-center gap-2 text-callout select-none">
      <span
        className={
          !jsonMode
            ? "text-foreground font-semibold"
            : "text-muted-foreground font-normal"
        }
      >
        Visual
      </span>

      <button
        onClick={() => setJsonMode((m) => !m)}
        role="switch"
        aria-checked={jsonMode}
        aria-label="Toggle between Visual and JSON"
        className={`relative w-9 h-5 rounded-full border transition-colors duration-200 cursor-pointer ${
          jsonMode
            ? "bg-primary border-primary"
            : "bg-muted-foreground/20 border-border"
        }`}
      >
        <span
          className="absolute top-1/2 -translate-y-1/2 size-3.5 rounded-full bg-white shadow-sm transition-[left] duration-200"
          style={{ left: jsonMode ? "18px" : "2px" }}
        />
      </button>

      <span
        className={
          jsonMode
            ? "text-foreground font-semibold"
            : "text-muted-foreground font-normal"
        }
      >
        JSON
      </span>
    </div>
  );
}
