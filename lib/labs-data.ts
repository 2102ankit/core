export type LabDemo = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string | null;
  span: string;
  comingSoon?: boolean;
};

export const labDemos: LabDemo[] = [
  {
    id: "bubble-sort",
    title: "Bubble Sort Visualizer",
    description: "Interactive visualization of sorting algorithms",
    tech: ["React", "Framer Motion"],
    github: null,
    span: "md:col-span-2",
  },
  {
    id: "leather-button",
    title: "Leather Button",
    description: "Micro-interactions for realistic button states",
    tech: ["React", "Motion"],
    github: null,
    span: "col-span-1",
  },
  {
    id: "kaleidoscope",
    title: "Kaleidoscope",
    description:
      "Kaleidoscope built with Three.js – symmetric patterns, mouse/touch control, colorful reflections.",
    tech: ["React", "Three.js"],
    github: null,
    span: "md:col-span-2 lg:col-span-3",
  },
  {
    id: "particle-effects",
    title: "Particle Effects",
    description: "Canvas-based particle system experiments",
    tech: ["JavaScript", "Canvas"],
    comingSoon: true,
    github: "https://github.com/2102ankit",
    span: "col-span-1",
  },
  {
    id: "highlighted-input",
    title: "Highlighted Input",
    description:
      "Input field to highlight specific words. Control colors, bold, italic, and case sensitivity.",
    tech: ["React"],
    github: null,
    span: "md:col-span-2",
  },
  {
    id: "command-bar",
    title: "Command Bar",
    description:
      "Lightweight command palette with fuzzy search, recent history, and full keyboard navigation.",
    tech: ["React", "TypeScript", "Tailwind v4", "Motion"],
    github: null,
    span: "md:col-span-2",
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

export function getLabDemo(slug: string): LabDemo | undefined {
  return labDemos.find((demo) => demo.id === slug);
}

export function getAvailableLabDemos(): LabDemo[] {
  return labDemos.filter((demo) => !demo.comingSoon);
}
