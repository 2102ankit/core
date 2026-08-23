export type PropDoc = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export type ComponentDocs = {
  intro?: string;
  props?: PropDoc[];
  notes?: string[];
};

export type ComponentDemo = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string | null;
  span: string;
  comingSoon?: boolean;
  source?: string; // repo-relative path to the main component file
  docs?: ComponentDocs;
};

export const componentDemos: ComponentDemo[] = [
  {
    id: "bubble-sort",
    title: "Bubble Sort Visualizer",
    description: "Interactive visualization of sorting algorithms",
    tech: ["React", "Framer Motion"],
    github: null,
    span: "md:col-span-2",
    source: "components/demos/bubble-sort-interactive.tsx",
    docs: {
      intro:
        "A self-contained visualizer. Type any comma-separated list of integers, hit Sort, then scrub through the generated steps with the transport controls or the timeline slider.",
      props: [
        {
          name: "(none)",
          type: "—",
          description:
            "The component manages its own input, step generation and playback state.",
        },
      ],
      notes: [
        "Negative values render as hatched bars below the zero line.",
        "Arrays longer than 10 items become horizontally scrollable and auto-center on the active pair.",
        "Playback speed cycles 1× → 2× → 3× → 4×.",
      ],
    },
  },
  {
    id: "leather-button",
    title: "Leather Button",
    description: "Micro-interactions for realistic button states",
    tech: ["React", "Motion"],
    github: null,
    span: "col-span-1",
    source: "components/demos/leather-button-final.tsx",
    docs: {
      intro:
        "A pressure-sensitive button with realistic leather material responses across hover, press and release states.",
      props: [
        {
          name: "(none)",
          type: "—",
          description: "Standalone demo component.",
        },
      ],
    },
  },
  {
    id: "highlighted-input",
    title: "Highlighted Input",
    description:
      "Input field to highlight specific words. Control colors, bold, italic, and case sensitivity.",
    tech: ["React"],
    github: null,
    span: "col-span-1",
    // span: "md:col-span-2",
    source: "components/demos/highlighted-input.tsx",
    docs: {
      intro:
        "A contentEditable-based single-line input that live-highlights configured keywords. Rules are edited visually or as JSON via the mode switch.",
      props: [
        {
          name: "config",
          type: "HighlightRule[]",
          default: "—",
          description: "Keyword rules applied on every keystroke.",
        },
        {
          name: "placeholder",
          type: "string",
          default: '"Type here…"',
          description: "Shown while the field is empty.",
        },
      ],
      notes: [
        "HighlightRule shape: { key: string; case_sensitive?: boolean; color?: string; bold?: boolean; italics?: boolean }",
        "Longer keywords win over shorter ones when both match.",
        "Hex editing for rule colours is intentionally only available in JSON mode; visual mode uses the colour circle.",
      ],
    },
  },
  {
    id: "kaleidoscope",
    title: "Kaleidoscope",
    description:
      "Kaleidoscope built with Three.js – symmetric patterns, pointer control, curated stained-glass palette.",
    tech: ["React", "Three.js", "GLSL"],
    github: null,
    span: "md:col-span-2",
    source: "components/demos/kaleidoscope.tsx",
    docs: {
      intro:
        "A fragment-shader kaleidoscope. Voronoi shards are folded into N mirrored segments and coloured from a fixed jewel-tone palette (ruby, amber, viridian, cobalt, amethyst, cream) so the output always looks art-directed rather than random.",
      props: [
        {
          name: "(none)",
          type: "—",
          description:
            "All parameters are exposed through the built-in control panel state.",
        },
      ],
      notes: [
        "Requires WebGL2-capable browser.",
        "Pattern rotation is computed off-thread in a Web Worker every other frame.",
        "Export PNG renders one frame at 2× resolution before downloading.",
      ],
    },
  },

  {
    id: "outline",
    title: "Outline",
    description:
      "Scroll-synced table of contents with a springy active indicator and hash deep-linking.",
    tech: ["React", "Framer Motion"],
    github: null,
    span: "col-span-1",
    source: "components/outline.tsx",
    docs: {
      intro:
        "Two variants share one scroll-tracking hook. The floating rail pins to the right edge on large screens; OutlineInline renders anywhere and is used above blog articles and inside the mobile menu.",
      props: [
        {
          name: "headings",
          type: "{ id: string; text: string; level: number }[]",
          description:
            "Ordered headings. level 2 = top-level entry, level 3 = indented child.",
        },
        {
          name: "className (OutlineInline)",
          type: "string",
          default: '""',
          description: "Extra classes for the inline variant wrapper.",
        },
      ],
      notes: [
        "Active heading detection starts 200px from the viewport top (SCROLL_THRESHOLD) — tune if your header height differs.",
        "Mounted variants register their headings globally, which is how the mobile navigation drawer picks them up.",
        "The floating variant rewrites location.hash as you scroll and honours #deep-links on load.",
      ],
    },
  },
  {
    id: "24h-clock",
    title: "24h Clock",
    description:
      "Live clock with flip, scoreboard and seven-segment styles, 12/24-hour formats and optional seconds.",
    tech: ["React", "Framer Motion", "SVG"],
    github: null,
    span: "col-span-1",
    source: "components/Clock24.tsx",
    docs: {
      intro:
        "Three display variants driven by the same ticking hook. Digits animate within fixed-size cells so nothing shifts between ticks.",
      props: [
        {
          name: "variant",
          type: '"flip" | "scoreboard" | "segment"',
          default: '"flip"',
          description:
            "flip = 3D digit crossfade · scoreboard = outlined sliding cells · segment = seven-segment SVG with ghosted off-segments.",
        },
        {
          name: "format",
          type: '"24h" | "12h"',
          default: '"24h"',
          description: "12h appends an AM/PM suffix chip next to the digits.",
        },
        {
          name: "showSeconds",
          type: "boolean",
          default: "true",
          description: "Include the seconds group and its separator.",
        },
      ],
      notes: [
        "Renders nothing until mounted client-side, so server HTML never disagrees with the visitor's timezone.",
      ],
    },
  },
  {
    id: "theme-toggle",
    title: "Gooey Theme Toggle",
    description:
      "Sun and moon SVG icons that morph through a liquid mid-transition and settle razor sharp.",
    tech: ["React", "SVG Filters", "Framer Motion"],
    github: null,
    span: "col-span-1",
    source: "components/theme-toggle.tsx",
    docs: {
      intro:
        "A crisp crescent path and a ray-lined sun swap places with springy scale/rotate motion. A Gaussian-blur + alpha-contrast filter pulses only during the morph, melting the shapes together before snapping back to full sharpness at rest.",
      props: [
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description:
            "32px / 40px / 56px button with proportional iconography.",
        },
        {
          name: "enableHotkey",
          type: "boolean",
          default: "true",
          description:
            "Bind the global “d” key. Set false for extra instances on the same page (demos) so the shortcut doesn't fire twice.",
        },
      ],
      notes: [
        "Theme state comes from next-themes; system preference is respected.",
        "Plays /sounds/click.wav at 40% volume on toggle.",
      ],
    },
  },

  {
    id: "command-bar",
    title: "Command Bar",
    description:
      "Lightweight command palette with fuzzy search, recent history, and full keyboard navigation.",
    tech: ["React", "TypeScript", "Tailwind v4", "Motion"],
    github: null,
    span: "md:col-span-2",
    source: "components/command-bar.tsx",
    docs: {
      intro:
        "Wraps the shared command palette so it can be embedded inline in a page instead of overlaying the viewport.",
      props: [
        {
          name: "open",
          type: "boolean",
          description: "Controlled open state (ignored when inline).",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          description: "Called whenever the open state should change.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          description: "Start expanded (uncontrolled usage).",
        },
        {
          name: "inline",
          type: "boolean",
          default: "false",
          description:
            "Render inside the document flow rather than as an overlay.",
        },
      ],
    },
  },
  {
    id: "segmented-control",
    title: "Segmented Control",
    description:
      "Compact option switcher with a spring-loaded pill that glides between choices.",
    tech: ["React", "TypeScript", "Framer Motion"],
    github: null,
    span: "col-span-1",
    source: "components/segmented-control.tsx",
    docs: {
      intro:
        "A generic, fully controlled segmented control. The active pill is a shared-layout element so it springs between options; every rendered group animates independently.",
      props: [
        {
          name: "options",
          type: "{ value: T; label: string }[]",
          description: "The choices. T is your string union type.",
        },
        {
          name: "value",
          type: "T",
          description: "Currently selected value (controlled).",
        },
        {
          name: "onChange",
          type: "(value: T) => void",
          description: "Fired when an option is picked.",
        },
        {
          name: "ariaLabel",
          type: "string",
          default: "—",
          description: "Accessible name for the group.",
        },
        {
          name: "size",
          type: '"sm" | "md"',
          default: '"md"',
          description: "Padding and text scale of the buttons.",
        },
        {
          name: "className",
          type: "string",
          default: '""',
          description: "Extra classes on the wrapper.",
        },
      ],
      notes: [
        "Buttons expose aria-pressed so screen readers announce the selection.",
        "The pill uses a per-instance layout id — safe to render many groups at once.",
      ],
    },
  },
  {
    id: "3d-transform",
    title: "3D Transform Demo",
    description: "CSS 3D transforms and perspective",
    tech: ["CSS", "Three.js"],
    comingSoon: true,
    github: "https://github.com/2102ankit",
    span: "col-span-1",
  },
];

export function getComponentDemo(slug: string): ComponentDemo | undefined {
  return componentDemos.find((demo) => demo.id === slug);
}

export function getAvailableComponents(): ComponentDemo[] {
  return componentDemos.filter((demo) => !demo.comingSoon);
}
