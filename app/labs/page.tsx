"use client";

import { ArrowRight, ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const experiments = [
  {
    title: "Bubble Sort Visualizer",
    description: "Interactive visualization of sorting algorithms",
    tech: ["React", "Framer Motion"],
    demo: "/demos/bubble-sort",
    github: "https://github.com/2102ankit/nimbus",
  },
  {
    title: "Leather Button",
    description: "Micro-interactions for realistic button states",
    tech: ["React", "CSS", "Framer Motion"],
    demo: "/demos/leather-button",
    github: "https://github.com/2102ankit/nimbus",
  },
  {
    title: "Particle Effects",
    description: "Canvas-based particle system experiments",
    tech: ["JavaScript", "Canvas"],
    demo: "#",
    github: "https://github.com/2102ankit",
  },
  {
    title: "3D Transform Demo",
    description: "CSS 3D transforms and perspective",
    tech: ["CSS", "Three.js"],
    demo: "#",
    github: "https://github.com/2102ankit",
  },
];

const components = [
  {
    title: "Loading Spinners",
    description: "Collection of CSS loading animations",
    tech: ["CSS", "Tailwind"],
  },
  {
    title: "Toast Notifications",
    description: "Custom toast notification components",
    tech: ["React", "TypeScript"],
  },
  {
    title: "Form Inputs",
    description: "Styled form input components",
    tech: ["React", "Tailwind"],
  },
  {
    title: "Modal Dialogs",
    description: "Accessible modal dialog patterns",
    tech: ["React", "Radix UI"],
  },
];

export default function LabsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 pt-12"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Labs</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experimental projects, UI components, and technical explorations
        </p>
      </motion.div>

      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-6">Interactive Experiments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiments.map((exp, index) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:border-foreground/20 transition-all">
                <h3 className="text-xl font-semibold mb-2">{exp.title}</h3>
                <p className="text-muted-foreground mb-4">{exp.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {exp.tech.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  {exp.demo !== "#" && (
                    <Link
                      href={exp.demo}
                      className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                      <ExternalLink size={14} /> Demo
                    </Link>
                  )}
                  <Link
                    href={exp.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    <Github size={14} /> Code
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">UI Components</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {components.map((comp, index) => (
            <motion.div
              key={comp.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card className="p-4 hover:border-foreground/20 transition-all h-full">
                <h3 className="font-semibold mb-1">{comp.title}</h3>
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 mb-12 text-center"
      >
        <p className="text-sm text-muted-foreground">
          This is my playground for quick experiments and component libraries. 
          Some demos are embedded directly, while others link to live previews or 
          repositories. More experiments coming soon!
        </p>
      </motion.div>
    </div>
  );
}
