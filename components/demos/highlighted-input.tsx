import {
  useState,
  useRef,
  useCallback,
  useEffect,
  CSSProperties,
  FC,
  KeyboardEvent,
  ClipboardEvent,
  FocusEvent,
} from "react";

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

// HighlightedInput 

const sharedInputStyle: CSSProperties = {
  fontFamily: "var(--font-sans, inherit)",
  fontSize: "14px",
  lineHeight: "1.6",
  padding: "8px 12px",
  whiteSpace: "pre",
  overflowX: "auto",
  overflowY: "hidden",
  minHeight: "38px",
  boxSizing: "border-box",
  width: "100%",
  borderRadius: "var(--border-radius-md, 6px)" as string,
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

  const handleFocus = useCallback((e: FocusEvent<HTMLDivElement>): void => {
    e.currentTarget.style.boxShadow =
      "0 0 0 2px var(--color-border-info, #3182ce66)";
  }, []);

  const handleBlur = useCallback((e: FocusEvent<HTMLDivElement>): void => {
    e.currentTarget.style.boxShadow = "none";
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    rerender(el.textContent ?? "", undefined);
  }, [config, rerender]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {empty && (
        <span
          aria-hidden="true"
          style={{
            ...sharedInputStyle,
            position: "absolute",
            inset: 0,
            display: "block",
            pointerEvents: "none",
            color: "var(--color-text-tertiary, #aaa)",
            border: "1px solid transparent",
            userSelect: "none",
          }}
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
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          ...sharedInputStyle,
          display: "block",
          outline: "none",
          border: "1px solid var(--color-border-secondary, #ccc)",
          background: "var(--color-background-primary, #fff)",
          color: "var(--color-text-primary, #111)",
          caretColor: "var(--color-text-primary, #111)",
          cursor: "text",
        }}
      />
    </div>
  );
};

// Config editor 

const cellStyle: CSSProperties = {
  padding: "5px 8px",
  fontSize: "13px",
  border: "0.5px solid var(--color-border-secondary)",
  borderRadius: "var(--border-radius-md, 6px)" as string,
  background: "var(--color-background-primary)",
  color: "var(--color-text-primary)",
  boxSizing: "border-box",
  width: "100%",
};

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
    <div
      style={{
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "16px",
        background: "var(--color-background-secondary)",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--color-text-secondary)",
          }}
        >
          highlight config
        </span>
        <button
          onClick={() => setJsonMode((m) => !m)}
          style={{
            fontSize: "12px",
            padding: "3px 10px",
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-secondary)",
            borderRadius: "var(--border-radius-md)",
            cursor: "pointer",
            color: "var(--color-text-secondary)",
          }}
        >
          {jsonMode ? "visual" : "JSON"}
        </button>
      </div>

      {jsonMode ? (
        <div>
          <textarea
            value={jsonText}
            onChange={(e) => applyJson(e.target.value)}
            spellCheck={false}
            style={{
              width: "100%",
              minHeight: "160px",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              padding: "10px",
              border: "0.5px solid var(--color-border-secondary)",
              borderRadius: "var(--border-radius-md)",
              background: "var(--color-background-primary)",
              color: "var(--color-text-primary)",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
          {jsonError && (
            <p style={{ fontSize: "12px", color: "#e53e3e", marginTop: "4px" }}>
              {jsonError}
            </p>
          )}
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 90px 130px 52px 52px 28px",
              gap: "6px",
              marginBottom: "6px",
            }}
          >
            {(["keyword", "case", "color", "bold", "italic", ""] as const).map(
              (h) => (
                <span
                  key={h}
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-tertiary)",
                    fontWeight: 500,
                  }}
                >
                  {h}
                </span>
              ),
            )}
          </div>

          {config.map((row, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 90px 130px 52px 52px 28px",
                gap: "6px",
                marginBottom: "6px",
                alignItems: "center",
              }}
            >
              <input
                value={row.key}
                onChange={(e) => update(i, "key", e.target.value)}
                placeholder="keyword"
                style={cellStyle}
              />
              <select
                value={row.case_sensitive === false ? "false" : "true"}
                onChange={(e) =>
                  update(i, "case_sensitive", e.target.value === "true")
                }
                style={{ ...cellStyle, padding: "5px 4px" }}
              >
                <option value="true">exact</option>
                <option value="false">ignore</option>
              </select>
              <div
                style={{ display: "flex", gap: "5px", alignItems: "center" }}
              >
                <input
                  type="color"
                  value={row.color ?? "#3182ce"}
                  onChange={(e) => update(i, "color", e.target.value)}
                  style={{
                    width: "28px",
                    height: "28px",
                    padding: "1px",
                    border: "0.5px solid var(--color-border-secondary)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                />
                <input
                  value={row.color ?? ""}
                  onChange={(e) => update(i, "color", e.target.value)}
                  style={{ ...cellStyle, fontSize: "12px" }}
                />
              </div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={!!row.bold}
                  onChange={(e) => update(i, "bold", e.target.checked)}
                  style={{ margin: 0 }}
                />
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "var(--color-text-primary)",
                  }}
                >
                  B
                </span>
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={!!row.italics}
                  onChange={(e) => update(i, "italics", e.target.checked)}
                  style={{ margin: 0 }}
                />
                <span
                  style={{
                    fontStyle: "italic",
                    fontSize: "14px",
                    color: "var(--color-text-primary)",
                  }}
                >
                  I
                </span>
              </label>
              <button
                onClick={() => push(config.filter((_, idx) => idx !== i))}
                style={{
                  width: "24px",
                  height: "24px",
                  border: "0.5px solid var(--color-border-secondary)",
                  borderRadius: "4px",
                  background: "transparent",
                  cursor: "pointer",
                  color: "var(--color-text-tertiary)",
                  fontSize: "16px",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>
          ))}

          <button
            onClick={() => push([...config, { ...BLANK_RULE }])}
            style={{
              marginTop: "8px",
              padding: "5px 14px",
              fontSize: "12px",
              border: "0.5px solid var(--color-border-secondary)",
              borderRadius: "var(--border-radius-md)",
              background: "var(--color-background-primary)",
              cursor: "pointer",
              color: "var(--color-text-secondary)",
            }}
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
    <div
      style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "var(--font-sans)",
      }}
    >
      <ConfigEditor config={config} onChange={setConfig} />
      <p
        style={{
          fontSize: "13px",
          color: "var(--color-text-tertiary)",
          margin: "0 0 8px",
        }}
      >
        highlighted input
      </p>
      <HighlightedInput
        config={config}
        placeholder="Try: SELECT * WHERE name AND age NOT IN list OR other"
      />
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
        }}
      >
        {config
          .filter((c) => c.key.length > 0)
          .map((c, i) => (
            <span
              key={i}
              style={{
                fontSize: "12px",
                padding: "2px 8px",
                borderRadius: "999px",
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
    </div>
  );
};

export default HighlightedInputDemo;
