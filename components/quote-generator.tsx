"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* =========================================================
   CONSTANTS
========================================================= */

const BASE = 600;

const RATIOS = [
  { label: "1:1", w: 1, h: 1 },
  { label: "4:5", w: 4, h: 5 },
  { label: "4:3", w: 4, h: 3 },
  { label: "16:9", w: 16, h: 9 },
  { label: "9:16", w: 9, h: 16 },
  { label: "3:4", w: 3, h: 4 },
];

const BG_COLORS = [
  "#ffffff",
  "#f8f9fa",
  "#fff5f5",
  "#fff9db",
  "#ebfbee",
  "#e7f5ff",
  "#f3f0ff",
  "#212529",
  "#495057",
  "#1a1a2e",
  "#2d2d2d",
  "#0b3d0b",
];

const BORDER_COLORS = [
  "#111111",
  "#343a40",
  "#495057",
  "#868e96",
  "#c92a2a",
  "#e8590c",
  "#2b8a3e",
  "#1864ab",
  "#5f3dc4",
  "#a61e4d",
  "#ffffff",
  "#d0bfff",
];

const TEXT_COLORS = [
  "#111111",
  "#495057",
  "#868e96",
  "#c92a2a",
  "#e8590c",
  "#2b8a3e",
  "#1864ab",
  "#5f3dc4",
  "#a61e4d",
  "#ffffff",
  "#d0bfff",
  "#ffd43b",
];

const FONT_OPTIONS = [
  { label: "EB Garamond", value: "'EB Garamond', serif" },
  { label: "Libre Baskerville", value: "'Libre Baskerville', serif" },
  { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Lora", value: "'Lora', serif" },
  { label: "Merriweather", value: "'Merriweather', serif" },
  { label: "Crimson Text", value: "'Crimson Text', serif" },
  { label: "Spectral", value: "'Spectral', serif" },
  { label: "Georgia", value: "Georgia, serif" },
];

const TEXTURES: {
  key: "none" | "paper" | "grid" | "dots" | "lines";
  label: string;
}[] = [
  { key: "none", label: "Plain" },
  { key: "paper", label: "Paper" },
  { key: "grid", label: "Grid" },
  { key: "dots", label: "Dots" },
  { key: "lines", label: "Lines" },
];

type Align = "left" | "center" | "right";

/* =========================================================
   SMALL HELPERS
========================================================= */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 mb-2 border-t border-border pt-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground first:mt-0 first:border-t-0 first:pt-0">
      {children}
    </h3>
  );
}

function Group({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="mb-2 block text-xs font-semibold text-muted-foreground">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

function SwatchGrid({
  colors,
  active,
  onSelect,
}: {
  colors: string[];
  active: string;
  onSelect: (c: string) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          aria-label={c}
          onClick={() => onSelect(c)}
          className={`aspect-square rounded-md border transition-shadow ${
            active === c
              ? "ring-2 ring-foreground ring-offset-1 ring-offset-background"
              : "border-border/60"
          }`}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function QuoteGenerator() {
  const stageWrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);
  const activeEditableRef = useRef<HTMLDivElement | null>(null);

  // Layout
  const [ratioIdx, setRatioIdx] = useState(2);
  const ratio = RATIOS[ratioIdx];
  const [outerPad, setOuterPad] = useState(40);
  const [innerPad, setInnerPad] = useState(50);
  const [fitScale, setFitScale] = useState(1);

  // Background
  const [bgColor, setBgColor] = useState("#ffffff");
  const [texture, setTexture] =
    useState<(typeof TEXTURES)[number]["key"]>("none");
  const [noiseUrl, setNoiseUrl] = useState("");

  // Border
  const [borderEnabled, setBorderEnabled] = useState(false);
  const [borderWidth, setBorderWidth] = useState(2);
  const [borderStyleVal, setBorderStyleVal] = useState<
    "solid" | "dashed" | "dotted" | "double"
  >("solid");
  const [borderColor, setBorderColor] = useState("#222222");

  // Quote text
  const [quoteFont, setQuoteFont] = useState(FONT_OPTIONS[0].value);
  const [textColor, setTextColor] = useState("#111111");
  const [quoteAlign, setQuoteAlign] = useState<Align>("center");
  const [fontSize, setFontSize] = useState(32);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [fmt, setFmt] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  // Author text
  const [authorFont, setAuthorFont] = useState(FONT_OPTIONS[0].value);
  const [showDash, setShowDash] = useState(true);
  const [authorAlign, setAuthorAlign] = useState<Align>("center");
  const [authorFontSize, setAuthorFontSize] = useState(20);

  // Export
  const [fileName, setFileName] = useState("quote");
  const [scale, setScale] = useState(2);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [exporting, setExporting] = useState(false);

  const cardLogicalWidth = useMemo(() => {
    const r = ratio.w / ratio.h;
    return r >= 1 ? BASE * Math.min(r, 1.6) : BASE * Math.min(1 / r, 1.6) * r;
  }, [ratio]);

  const cardLogicalHeight = useMemo(() => {
    const r = ratio.w / ratio.h;
    return r >= 1 ? cardLogicalWidth / r : BASE * Math.min(1 / r, 1.6);
  }, [ratio, cardLogicalWidth]);

  /* ---- fit the card to the stage on resize ---- */
  useEffect(() => {
    const el = stageWrapperRef.current;
    if (!el) return;
    const recompute = () => {
      const availW = Math.max(1, el.clientWidth - 48);
      const availH = Math.max(1, el.clientHeight - 48);
      setFitScale(
        Math.min(1, availW / cardLogicalWidth, availH / cardLogicalHeight),
      );
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cardLogicalWidth, cardLogicalHeight]);

  /* ---- generate a subtle paper-grain texture once on mount ---- */
  useEffect(() => {
    const n = 140;
    const c = document.createElement("canvas");
    c.width = n;
    c.height = n;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const imgData = ctx.createImageData(n, n);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const shade = 128 + Math.floor((Math.random() - 0.5) * 100);
      imgData.data[i] = shade;
      imgData.data[i + 1] = shade;
      imgData.data[i + 2] = shade;
      imgData.data[i + 3] = 22;
    }
    ctx.putImageData(imgData, 0, 0);
    setNoiseUrl(c.toDataURL());
  }, []);

  const textureStyle = useMemo((): React.CSSProperties => {
    switch (texture) {
      case "paper":
        return noiseUrl
          ? {
              backgroundImage: `url("${noiseUrl}")`,
              backgroundSize: "140px 140px",
            }
          : {};
      case "grid":
        return {
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        };
      case "dots":
        return {
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.10) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        };
      case "lines":
        return {
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(0,0,0,0.035) 0px, rgba(0,0,0,0.035) 1px, transparent 1px, transparent 16px)",
        };
      default:
        return { backgroundImage: "none" };
    }
  }, [texture, noiseUrl]);

  /* ---- formatting (bold / italic / underline) ---- */
  useEffect(() => {
    const update = () => {
      const active = activeEditableRef.current;
      const sel = window.getSelection();
      if (
        !active ||
        !sel ||
        !sel.rangeCount ||
        !active.contains(sel.anchorNode)
      )
        return;
      setFmt({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
      });
    };
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);

  const toggleFormat = (cmd: string) => {
    const active = activeEditableRef.current ?? quoteRef.current;
    active?.focus();
    document.execCommand(cmd);
    setFmt({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  };

  const handleBlurEmpty = (e: React.FocusEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.innerText.trim() === "") el.innerHTML = "";
  };

  /* ---- export ---- */
  const handleExport = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      // Dynamic import keeps html2canvas (and its DOM-only code) out of the
      // server bundle and avoids touching document.head, which Next.js's
      // App Router manages itself.
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, {
        scale,
        backgroundColor: null,
        useCORS: true,
        foreignObjectRendering: true,
        width: cardLogicalWidth,
        height: cardLogicalHeight,
        windowWidth: cardLogicalWidth,
        windowHeight: cardLogicalHeight,
        onclone: (doc: Document) => {
          const cloned = doc.querySelector<HTMLElement>(
            '[data-quote-card="true"]',
          );
          if (cloned) cloned.style.transform = "none";
          // Neutralize ancestor CSS-variable colors (oklch/lab from Tailwind v4)
          // that html2canvas's legacy color parser can't read.
          let node: HTMLElement | null = cloned?.parentElement ?? null;
          while (node) {
            node.style.backgroundColor = "transparent";
            node.style.color = "#111111";
            node = node.parentElement;
          }
        },
      });
      const extension = format === "jpeg" ? "jpg" : "png";
      const safeName = (fileName.trim() || "quote").replace(
        /[<>:"/\\|?*]/g,
        "_",
      );
      const link = document.createElement("a");
      link.download = `${safeName}.${extension}`;
      link.href = canvas.toDataURL(`image/${format}`, 0.95);
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const alignBtnClass = (active: boolean) =>
    `flex-1 rounded-md border px-2 py-1.5 text-xs transition-colors ${
      active
        ? "border-foreground bg-foreground text-background"
        : "border-border bg-muted/50 text-foreground hover:bg-accent"
    }`;

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-background text-foreground md:flex-row">
      {/* CANVAS — fixed top half on mobile, right stage on desktop */}
      <div
        ref={stageWrapperRef}
        className="flex h-[50vh] shrink-0 items-center justify-center overflow-hidden bg-muted/40 p-4 md:order-2 md:h-full md:flex-1 md:p-10"
      >
        <div
          ref={cardRef}
          data-quote-card="true"
          className="relative box-border flex shrink-0 origin-center flex-col items-center justify-center overflow-hidden shadow-2xl"
          style={{
            width: cardLogicalWidth,
            height: cardLogicalHeight,
            padding: outerPad,
            backgroundColor: bgColor,
            transform: `scale(${fitScale})`,
            ...textureStyle,
          }}
        >
          <div
            className="relative flex h-full w-full flex-col items-center justify-center"
            style={{
              padding: innerPad,
              border: borderEnabled
                ? `${borderWidth}px ${borderStyleVal} ${borderColor}`
                : "none",
            }}
          >
            <div className="flex w-full flex-col">
              <div
                ref={quoteRef}
                contentEditable
                suppressContentEditableWarning
                data-placeholder="Type your quote here..."
                onFocus={() => (activeEditableRef.current = quoteRef.current)}
                onBlur={handleBlurEmpty}
                className="quote-text w-full whitespace-pre-wrap break-words outline-none"
                style={{
                  fontFamily: quoteFont,
                  fontSize,
                  lineHeight,
                  letterSpacing,
                  color: textColor,
                  textAlign: quoteAlign,
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    "I am victim of my own conscience constantly feeling guilty for things I have not done.",
                }}
              />
              <div
                ref={authorRef}
                contentEditable
                suppressContentEditableWarning
                data-placeholder="Author name"
                onFocus={() => (activeEditableRef.current = authorRef.current)}
                onBlur={handleBlurEmpty}
                className={`author-text mt-6 w-full outline-none ${showDash ? "show-dash" : ""}`}
                style={{
                  fontFamily: authorFont,
                  fontSize: authorFontSize,
                  color: textColor,
                  textAlign: authorAlign,
                }}
                dangerouslySetInnerHTML={{ __html: "<i>Franz Kafka</i>" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MENU — scrollable bottom half on mobile, left sidebar on desktop */}
      <div className="min-h-0 flex-1 overflow-y-auto border-t border-border bg-background p-4 md:order-1 md:h-full md:w-[320px] md:flex-none md:border-r md:border-t-0 md:p-5">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Quote Generator
        </h2>

        <SectionTitle>Layout</SectionTitle>
        <Group label="Aspect Ratio">
          <div className="grid grid-cols-3 gap-2">
            {RATIOS.map((r, i) => (
              <button
                key={r.label}
                type="button"
                onClick={() => setRatioIdx(i)}
                className={`rounded-md border px-2 py-2 text-xs transition-colors ${
                  ratioIdx === i
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-muted/50 text-foreground hover:bg-accent"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </Group>
        <Group label={`Padding outside border (${outerPad}px)`}>
          <input
            type="range"
            min={0}
            max={140}
            value={outerPad}
            onChange={(e) => setOuterPad(Number(e.target.value))}
            className="w-full accent-foreground"
          />
        </Group>
        <Group label={`Padding inside border (${innerPad}px)`}>
          <input
            type="range"
            min={0}
            max={140}
            value={innerPad}
            onChange={(e) => setInnerPad(Number(e.target.value))}
            className="w-full accent-foreground"
          />
        </Group>

        <SectionTitle>Background</SectionTitle>
        <Group label="Color">
          <SwatchGrid
            colors={BG_COLORS}
            active={bgColor}
            onSelect={setBgColor}
          />
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="mt-2 h-9 w-full cursor-pointer rounded-md border border-border bg-transparent p-0.5"
          />
        </Group>
        <Group label="Texture">
          <div className="grid grid-cols-3 gap-1.5">
            {TEXTURES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTexture(t.key)}
                className={`rounded-md border px-2 py-2 text-[11px] transition-colors ${
                  texture === t.key
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-muted/50 text-foreground hover:bg-accent"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Group>

        <SectionTitle>Border</SectionTitle>
        <div className="mb-3 flex items-center gap-2">
          <input
            id="borderToggle"
            type="checkbox"
            checked={borderEnabled}
            onChange={(e) => setBorderEnabled(e.target.checked)}
            className="h-4 w-4 accent-foreground"
          />
          <label
            htmlFor="borderToggle"
            className="text-xs font-medium text-foreground"
          >
            Enable border
          </label>
        </div>
        <Group label={`Width (${borderWidth}px)`}>
          <input
            type="range"
            min={1}
            max={20}
            value={borderWidth}
            onChange={(e) => setBorderWidth(Number(e.target.value))}
            className="w-full accent-foreground"
          />
        </Group>
        <Group label="Style">
          <select
            value={borderStyleVal}
            onChange={(e) => setBorderStyleVal(e.target.value as any)}
            className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
            <option value="double">Double</option>
          </select>
        </Group>
        <Group label="Color">
          <SwatchGrid
            colors={BORDER_COLORS}
            active={borderColor}
            onSelect={setBorderColor}
          />
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
            className="mt-2 h-9 w-full cursor-pointer rounded-md border border-border bg-transparent p-0.5"
          />
        </Group>

        <SectionTitle>Quote Text</SectionTitle>
        <Group label="Font">
          <select
            value={quoteFont}
            onChange={(e) => setQuoteFont(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.label} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </Group>
        <Group label="Text Color">
          <SwatchGrid
            colors={TEXT_COLORS}
            active={textColor}
            onSelect={setTextColor}
          />
        </Group>
        <Group label="Formatting">
          <div className="flex gap-1.5">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                toggleFormat("bold");
              }}
              className={`flex-1 rounded-md border py-1.5 text-sm font-bold transition-colors ${fmt.bold ? "border-foreground bg-foreground text-background" : "border-border bg-muted/50 hover:bg-accent"}`}
            >
              B
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                toggleFormat("italic");
              }}
              className={`flex-1 rounded-md border py-1.5 text-sm italic transition-colors ${fmt.italic ? "border-foreground bg-foreground text-background" : "border-border bg-muted/50 hover:bg-accent"}`}
            >
              I
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                toggleFormat("underline");
              }}
              className={`flex-1 rounded-md border py-1.5 text-sm underline transition-colors ${fmt.underline ? "border-foreground bg-foreground text-background" : "border-border bg-muted/50 hover:bg-accent"}`}
            >
              U
            </button>
          </div>
        </Group>
        <Group label="Alignment (Quote)">
          <div className="flex gap-1.5">
            {(["left", "center", "right"] as Align[]).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setQuoteAlign(a)}
                className={alignBtnClass(quoteAlign === a)}
              >
                {a[0].toUpperCase() + a.slice(1)}
              </button>
            ))}
          </div>
        </Group>
        <Group label={`Font Size (${fontSize}px)`}>
          <input
            type="range"
            min={14}
            max={72}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full accent-foreground"
          />
        </Group>
        <Group label={`Line Height (${lineHeight.toFixed(1)})`}>
          <input
            type="range"
            min={1}
            max={2.5}
            step={0.1}
            value={lineHeight}
            onChange={(e) => setLineHeight(Number(e.target.value))}
            className="w-full accent-foreground"
          />
        </Group>
        <Group label={`Letter Spacing (${letterSpacing}px)`}>
          <input
            type="range"
            min={-2}
            max={10}
            step={0.5}
            value={letterSpacing}
            onChange={(e) => setLetterSpacing(Number(e.target.value))}
            className="w-full accent-foreground"
          />
        </Group>

        <SectionTitle>Author Text</SectionTitle>
        <Group label="Font">
          <select
            value={authorFont}
            onChange={(e) => setAuthorFont(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.label} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </Group>
        <div className="mb-3 flex items-center gap-2">
          <input
            id="dashToggle"
            type="checkbox"
            checked={showDash}
            onChange={(e) => setShowDash(e.target.checked)}
            className="h-4 w-4 accent-foreground"
          />
          <label
            htmlFor="dashToggle"
            className="text-xs font-medium text-foreground"
          >
            Show em dash prefix
          </label>
        </div>
        <Group label="Alignment (Author)">
          <div className="flex gap-1.5">
            {(["left", "center", "right"] as Align[]).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAuthorAlign(a)}
                className={alignBtnClass(authorAlign === a)}
              >
                {a[0].toUpperCase() + a.slice(1)}
              </button>
            ))}
          </div>
        </Group>
        <Group label={`Font Size (${authorFontSize}px)`}>
          <input
            type="range"
            min={10}
            max={40}
            value={authorFontSize}
            onChange={(e) => setAuthorFontSize(Number(e.target.value))}
            className="w-full accent-foreground"
          />
        </Group>

        <SectionTitle>Export</SectionTitle>
        <Group label="File Name">
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
          />
        </Group>
        <Group label="Scale">
          <select
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
          >
            <option value={1}>1x (Standard)</option>
            <option value={2}>2x (High Quality)</option>
            <option value={3}>3x (Ultra HD)</option>
            <option value={4}>4x (Print)</option>
          </select>
        </Group>
        <Group label="Format">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as any)}
            className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPG</option>
          </select>
        </Group>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="mt-2 w-full rounded-lg bg-foreground px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {exporting ? "Exporting..." : "Export Image"}
        </button>
      </div>

      <style jsx>{`
        .quote-text:empty::before {
          content: attr(data-placeholder);
          color: rgb(148 163 184);
        }
        .author-text:empty::after {
          content: attr(data-placeholder);
          color: rgb(148 163 184);
          font-style: italic;
        }
        .author-text.show-dash:not(:empty)::before {
          content: "— ";
        }
      `}</style>
    </div>
  );
}
