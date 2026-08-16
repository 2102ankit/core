"use client";

import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { labDemos } from "@/lib/labs-data";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  GithubIcon,
} from "@hugeicons/core-free-icons";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LabsPage() {
  return (
    <Container size="default" className="py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-12 md:mb-16"
      >
        <h1 className="text-display text-foreground mb-4">Labs</h1>
        <p className="text-body text-muted-foreground max-w-2xl mx-auto">
          Experimental projects, UI components, and technical explorations
        </p>
      </motion.div>

      <section className="mb-16 md:mb-20">
        <h2 className="text-title-2 text-foreground mb-6">
          Interactive Experiments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {labDemos.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
              className={demo.span}
            >
              {demo.comingSoon ? (
                <Card className="h-full p-6 opacity-60 cursor-not-allowed relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                  <LabCardContent demo={demo} />
                </Card>
              ) : (
                <Link href={`/labs/${demo.id}`} className="block h-full group">
                  <Card className="h-full p-6 transition-fast hover:shadow-elevation-2">
                    <LabCardContent demo={demo} showArrow />
                  </Card>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <p className="text-caption text-muted-foreground text-center max-w-xl mx-auto">
        A playground for quick experiments and component libraries. Each demo
        opens in its own view for full interaction on any screen size.
      </p>
    </Container>
  );
}

function LabCardContent({
  demo,
  showArrow = false,
}: {
  demo: (typeof labDemos)[number];
  showArrow?: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-title-3 text-foreground">{demo.title}</h3>
        {showArrow && (
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            size={16}
            className="text-muted-foreground shrink-0 mt-1 transition-fast group-hover:text-foreground"
          />
        )}
      </div>
      <p className="text-callout text-muted-foreground mb-4 flex-1">
        {demo.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {demo.tech.map((tech) => (
          <Badge key={tech} variant="secondary" className="text-caption">
            {tech}
          </Badge>
        ))}
      </div>
      {!demo.comingSoon && demo.github && (
        <span className="inline-flex items-center gap-1 text-caption font-medium mt-4 text-muted-foreground">
          <HugeiconsIcon icon={GithubIcon} size={14} />
          Source available
        </span>
      )}
    </div>
  );
}
