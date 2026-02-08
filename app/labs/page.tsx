"use client";

import {
  BubbleSortInteractive,
  KaleidoscopeViewer,
  LeatherButtonFinal,
} from "@/components/demos/demo-exports";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  ExternalLink,
  Github,
  Layers,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const demos = [
  {
    id: "bubble-sort",
    title: "Bubble Sort Visualizer",
    description: "Interactive visualization of sorting algorithms",
    tech: ["React", "Framer Motion"],
    component: BubbleSortInteractive,
    github: null,
    span: "col-span-2 row-span-1",
  },
  {
    id: "leather-button",
    title: "Leather Button",
    description: "Micro-interactions for realistic button states",
    tech: ["React", "Motion"],
    component: LeatherButtonFinal,
    github: null,
    span: "col-span-1 row-span-1",
  },
  {
    id: "kaleidoscpoe",
    title: "Kaleidoscope",
    description:
      "Kaleidoscope built with Three.js – Symmetric patterns, mouse/touch control, colorful reflections.",
    tech: ["React", "ThreeJs"],
    component: KaleidoscopeViewer,
    github: null,
    span: "col-span-3 row-span-1",
  },
  {
    id: "particle-effects",
    title: "Particle Effects",
    description: "Canvas-based particle system experiments",
    tech: ["JavaScript", "Canvas"],
    comingSoon: true,
    github: "https://github.com/2102ankit",
    span: "col-span-1 row-span-1",
  },
  {
    id: "3d-transform",
    title: "3D Transform Demo",
    description: "CSS 3D transforms and perspective",
    tech: ["CSS", "Three.js"],
    comingSoon: true,
    github: "https://github.com/2102ankit",
    span: "col-span-2 row-span-1",
  },
];

const showComponents = false;

const components = [
  {
    title: "Loading Spinners",
    description: "Collection of CSS loading animations",
    tech: ["CSS", "Tailwind"],
    icon: Sparkles,
    color: "text-purple-500",
  },
  {
    title: "Toast Notifications",
    description: "Custom toast notification components",
    tech: ["React", "TypeScript"],
    icon: Layers,
    color: "text-blue-500",
  },
  {
    title: "Form Inputs",
    description: "Styled form input components",
    tech: ["React", "Tailwind"],
    icon: Code2,
    color: "text-green-500",
  },
  {
    title: "Modal Dialogs",
    description: "Accessible modal dialog patterns",
    tech: ["React", "Radix UI"],
    icon: ExternalLink,
    color: "text-orange-500",
  },
];

export default function LabsPage() {
  const [selectedDemo, setSelectedDemo] = useState<(typeof demos)[0] | null>(
    null,
  );

  return (
    <>
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 pt-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Labs</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experimental projects, UI components and technical explorations
          </p>
        </motion.div>

        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">Interactive Experiments</h2>
          <div className="grid grid-cols-3 auto-rows-[200px] gap-4">
            {demos.map((demo) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className={demo.span}
              >
                <Card
                  className={`h-full p-6 hover:border-foreground/20 transition-all cursor-pointer relative overflow-hidden ${
                    demo.comingSoon ? "cursor-not-allowed opacity-60" : ""
                  }`}
                  onClick={() => !demo.comingSoon && setSelectedDemo(demo)}
                >
                  {demo.comingSoon && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                  )}
                  <div className="flex flex-col h-full">
                    <h3 className="text-xl font-semibold mb-2">{demo.title}</h3>
                    <p className="text-muted-foreground mb-4 flex-1 leading-tight">
                      {demo.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {demo.tech.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    {!demo.comingSoon && demo.github && (
                      <Link
                        href={demo.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium hover:underline self-start ml-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github size={14} /> Code <ArrowUpRight size={12} />
                      </Link>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {showComponents && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">UI Components</h2>
            <div className="grid grid-cols-2 gap-4">
              {components.map((comp, index) => (
                <motion.div
                  key={comp.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Card className="p-4 hover:border-foreground/20 transition-all h-full">
                    <div
                      className={`flex items-center gap-2 mb-2 ${comp.color}`}
                    >
                      <comp.icon size={20} />
                      <h3 className="font-semibold">{comp.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {comp.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {comp.tech.map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 mb-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            This is my playground for quick experiments and component libraries.
            Some demos are embedded directly, while others link to live previews
            or repositories. More experiments coming soon!
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="h-full w-full max-w-6xl mx-auto flex flex-col p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedDemo.title}</h2>
                  <p className="text-muted-foreground">
                    {selectedDemo.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDemo(null)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                  aria-label="Close demo"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 border rounded-lg bg-muted/20 overflow-auto flex justify-center">
                {selectedDemo.component && <selectedDemo.component />}
              </div>
              {!!selectedDemo.github && (
                <div className="flex gap-4 mt-6 justify-center">
                  <Link
                    href={selectedDemo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent transition-colors duration-300"
                  >
                    <Github size={18} /> View on GitHub{" "}
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
