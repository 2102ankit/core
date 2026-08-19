"use client";

import { Container } from "@/components/container";
import ProjectThumbnail from "@/components/project-thumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { skillCategories } from "@/data/skills";
import { getFeaturedProjects, type Project } from "@/lib/data";
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Briefcase01Icon,
  ChevronDownIcon,
  FileDownIcon,
  GithubIcon,
  GraduationCapIcon,
  Location08Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <div className="h-0.5 flex-1 bg-linear-to-l from-border/60 to-transparent" />
        <div className="inline-flex items-center rounded-2xl bg-foreground px-5 py-2 text-sm font-semibold text-background shadow-sm">
          {label}
        </div>
        <div className="h-0.5 flex-1 bg-linear-to-r from-border/60 to-transparent" />
      </div>
    </div>
  );
}

// Renders a skill's icon, switching between light/dark variants the same
// way the About page's skill rows do, with a safe fallback either way.
function SkillIcon({
  skill,
  mounted,
  isDark,
  size = 20,
}: {
  skill: any;
  mounted: boolean;
  isDark: boolean;
  size?: number;
}) {
  const Icon = mounted
    ? isDark
      ? skill.darkIcon || skill.lightIcon
      : skill.lightIcon || skill.darkIcon
    : skill.lightIcon || skill.darkIcon;

  if (!Icon) return null;

  const filter = mounted
    ? isDark
      ? skill.darkFilter
      : skill.lightFilter
    : skill.lightFilter;

  return (
    <span className="flex-none" style={filter ? { filter } : undefined}>
      <Icon size={size * (skill.scale || 1)} />
    </span>
  );
}

function SkillChip({
  skill,
  mounted,
  isDark,
}: {
  skill: any;
  mounted: boolean;
  isDark: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 h-11 px-4 rounded-squircle border border-border bg-card shadow-elevation-1 shrink-0 whitespace-nowrap">
      <SkillIcon skill={skill} mounted={mounted} isDark={isDark} />
      <span className="text-callout font-medium text-foreground">
        {skill.name}
      </span>
    </div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const hasScrolled = useRef(false);

  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const currentTheme = mounted
    ? theme === "system"
      ? systemTheme
      : theme
    : null;
  const isDark = currentTheme === "dark";

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getFeaturedProjects();
        setProjects(data.slice(0, 3));
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();

    const handleScroll = () => {
      if (!hasScrolled.current && window.scrollY > 50) {
        hasScrolled.current = true;
        setShowScrollIndicator(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Container size="wide">
      <section className="pt-4 md:pt-8 pb-8 md:pb-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <div className="flex flex-col md:flex-row items-center gap-7 mb-4">
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="shrink-0 relative"
            >
              <Image
                src="https://avatars.githubusercontent.com/u/105378102?v=4"
                alt="Ankit Mishra"
                width={116}
                height={116}
                className="rounded-full border-4 border-background shadow-elevation-2"
                priority
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-center md:text-left"
            >
              <h1 className="text-[2rem] sm:text-[2rem] leading-[1.1] tracking-tighter font-semibold text-foreground mb-2">
                Hey
                <span className="inline-block p-2 -m-2">👋</span>, I&apos;m
                Ankit
              </h1>
              <p className="text-headline text-muted-foreground">
                Full-Stack Software Engineer, building at{" "}
                <span className="font-medium text-foreground">ISS-Stoxx</span>
              </p>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            className="text-body text-muted-foreground mb-8 max-w-2xl text-center mx-auto"
            
          >
            I build applications that feel polished to users and
            <br className="hidden sm:block" /> systems that stay simple for
            developers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-2.5 mb-10"
          >
            <span
              key={"Mumbai, India"}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-squircle border border-border bg-muted/60 text-caption text-muted-foreground"
            >
              <HugeiconsIcon icon={Location08Icon} size={14} />
              {"Mumbai, India"}
            </span>
            <span
              key={"Full-time SWE since Jul 2025"}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-squircle border border-border bg-muted/60 text-caption text-muted-foreground"
            >
              <HugeiconsIcon icon={Briefcase01Icon} size={14} />
              {"Full-time SWE since Jul 2025"}
            </span>
            <span
              key={"B.Tech, Class of 2025"}
              className="items-center gap-1.5 h-8 px-3 rounded-squircle border border-border bg-muted/60 text-caption text-muted-foreground hidden sm:inline-flex"
            >
              <HugeiconsIcon icon={GraduationCapIcon} size={14} />
              {"B.Tech, Class of 2025"}
            </span>
          </motion.div>

          <blockquote className="relative pl-6 border-l-2 border-foreground/20 bg-muted/50 rounded-r-lg py-3 pr-6 text-callout text-muted-foreground">
            <p>
              {"Currently building "}
              <Link
                href="https://github.com/2102ankit/nimbus"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-fast group"
              >
                Datagrid
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={16}
                  className="opacity-70 group-hover:opacity-100 transition-fast"
                />
              </Link>
              {" in React, Motion & Tanstack Table"}
            </p>
          </blockquote>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mt-8"
          >
            <Button
              asChild
              size="lg"
              className="gap-2 h-12 group relative overflow-hidden
             bg-primary text-primary-foreground
             ring-1 ring-primary/20
             hover:ring-2 hover:ring-primary/40
             focus-visible:ring-2 focus-visible:ring-primary
             focus-visible:ring-offset-2 focus-visible:ring-offset-background
             transition-all duration-300"
            >
              <Link href="/contact">
                Let&apos;s Work Together
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={18}
                  className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2 h-12 group relative
             ring-1 ring-border
             hover:ring-2 hover:ring-primary/30
             focus-visible:ring-2 focus-visible:ring-primary
             focus-visible:ring-offset-2 focus-visible:ring-offset-background
             transition-all duration-300"
            >
              <Link href="/work">
                See My Work
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={18}
                  className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="gap-2 h-12 group relative
             ring-1 ring-secondary-foreground/10
             hover:ring-2 hover:ring-secondary-foreground/25
             focus-visible:ring-2 focus-visible:ring-primary
             focus-visible:ring-offset-2 focus-visible:ring-offset-background
             transition-all duration-300"
            >
              <Link href="/downloads/resume.pdf">
                View Resume
                <HugeiconsIcon
                  icon={FileDownIcon}
                  size={18}
                  className="opacity-70 group-hover:opacity-100 transition-all duration-300"
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="gap-2 h-12 group relative
             ring-1 ring-secondary-foreground/10
             hover:ring-2 hover:ring-secondary-foreground/25
             focus-visible:ring-2 focus-visible:ring-primary
             focus-visible:ring-offset-2 focus-visible:ring-offset-background
             transition-all duration-300"
            >
              <Link href="https://github.com/2102ankit">
                GitHub
                <HugeiconsIcon
                  icon={GithubIcon}
                  size={18}
                  className="opacity-70 group-hover:opacity-100 transition-all duration-300"
                />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {showScrollIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer opacity-60 hover:opacity-100"
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <HugeiconsIcon icon={ChevronDownIcon} size={20} />
          </motion.div>
        </motion.div>
      )}

      <section className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <SectionDivider label="Featured Projects" />
          <p className="text-muted-foreground text-center">
            A selection of my best work
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <div className="p-6 bg-card border border-border rounded-b-lg">
                  <div className="h-6 bg-muted rounded mb-3" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:border-foreground/20 transition-all pt-0">
                  <div className="relative h-48 bg-muted/50 overflow-hidden border-b rounded-t-xl">
                    <ProjectThumbnail
                      src={project.thumbnail}
                      alt={project.title}
                      variant="cover"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {project.github_url && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="gap-2 flex-1"
                        >
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <HugeiconsIcon icon={GithubIcon} size={16} /> GitHub
                          </a>
                        </Button>
                      )}
                      {project.demo_url && (
                        <Button asChild size="sm" className="gap-2 flex-1">
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Demo{" "}
                            <HugeiconsIcon
                              icon={ArrowUpRight01Icon}
                              size={16}
                            />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/work">
              View All Work <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </Link>
          </Button>
        </motion.div>
      </section>

      <section className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <SectionDivider label="Skills" />
          <p className="text-muted-foreground text-center">
            Tools and technologies I reach for daily
          </p>
        </motion.div>

        {/* Featured skills — two rows drifting in opposite directions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          {(() => {
            const all = skillCategories.flatMap((c) => c.skills);

            const featured = all.filter((skill) => skill.featured);
            const featuredNames = featured.map((s) => s.name);

            const rest = all.filter((s) => !featuredNames.includes(s.name));

            const rowA = featured.length > 0 ? featured : all;
            const rowB = rest.length > 0 ? rest : [...all].reverse();

            return (
              <>
                <div className="relative marquee-pause overflow-hidden fade-edges-x">
                  <div className="flex w-max gap-3 animate-marquee-left">
                    {[...rowA, ...rowA].map((skill, i) => (
                      <SkillChip
                        key={`${skill.name}-a-${i}`}
                        skill={skill}
                        mounted={mounted}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                </div>
                <div className="relative marquee-pause overflow-hidden fade-edges-x">
                  <div className="flex w-max gap-3 animate-marquee-right">
                    {[...rowB, ...rowB].map((skill, i) => (
                      <SkillChip
                        key={`${skill.name}-b-${i}`}
                        skill={skill}
                        mounted={mounted}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </motion.div>
      </section>

      <section className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-3xl tracking-tight font-bold mb-4">
            Let&apos;s Work Together
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Have a project in mind or want to collaborate? I&apos;d love to hear
            from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="gap-2 border-2 hover:border-foreground/80 shadow-sm hover:shadow-md transition-all"
            >
              <Link href="/contact">
                Get in Touch <HugeiconsIcon icon={Mail01Icon} size={18} />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2 border-2 hover:border-foreground/80 shadow-sm hover:shadow-md transition-all"
            >
              <Link href="/work">
                View My Work <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </Container>
  );
}
