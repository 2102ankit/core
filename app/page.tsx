"use client";

import ProjectThumbnail from "@/components/project-thumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  ChevronDownIcon,
  FileDownIcon,
  GithubIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { getFeaturedProjects, type Project } from "@/lib/data";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { skillCategories } from "@/data/skills";

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

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const hasScrolled = useRef(false);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="pt-8 md:pt-16 pb-12 md:pb-20  flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="shrink-0"
            >
              <Image
                src="https://avatars.githubusercontent.com/u/105378102?v=4"
                alt="Ankit Mishra"
                width={100}
                height={100}
                className="rounded-full border-4 border-foreground/10"
                priority
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-center md:text-left"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
                Hey
                <motion.span
                  animate={{ rotate: [0, 15, -5, 15, -5, 0] }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  whileHover={{
                    rotate: [0, 15, -5, 15, -5, 0],
                    transition: { duration: 0.6, delay: 0.1 },
                  }}
                  style={{ transformOrigin: "bottom right" }}
                  className="inline-block cursor-default p-4 -m-4"
                >
                  👋
                </motion.span>
                , I&apos;m Ankit
              </h1>
              <p className="text-lg sm:text-lg text-muted-foreground">
                Full-Stack Software Engineer
              </p>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-3xl leading-tight text-center"
          >
            I build applications that feel polished to users and
            <br />
            systems that stay simple for developers.
          </motion.p>

          <div className="space-y-4 max-w-3xl">
            <blockquote
              className="relative pl-6 border-l-4 border-blue-500 dark:border-blue-400 
                           bg-linear-to-r from-zinc-50 to-zinc-100 
                           dark:from-zinc-800/60 dark:to-zinc-800/50 
                           rounded-r-lg py-3 pr-6 
                           text-base sm:text-lg text-zinc-700 dark:text-zinc-300 
                           leading-relaxed 
                           transition-all duration-400 hover:shadow-md"
            >
              <p className="relative z-10">
                {"Currently building "}
                <Link
                  href="https://github.com/2102ankit/nimbus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 font-medium text-blue-600 dark:text-blue-400 
                   underline underline-offset-4 decoration-blue-400/30 dark:decoration-blue-500/30 
                   hover:decoration-blue-400 dark:hover:decoration-blue-400 
                   hover:text-blue-700 dark:hover:text-blue-300 
                   transition-all duration-300 group"
                >
                  Datagrid
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    size={16}
                    className="opacity-70 group-hover:opacity-100 
                     group-hover:translate-x-0.5 group-hover:-translate-y-0.5 
                     transition-all duration-300"
                  />
                </Link>
                {" in React, Motion & Tanstack Table"}
              </p>
            </blockquote>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mt-8"
          >
            <Button asChild size="lg" className="gap-2 text-base h-12 group">
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
              className="gap-2 text-base h-12 group"
            >
              <Link href="/work">
                See My Work
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={18}
                  className="opacity-70 group-hover:opacity-100 transition-all duration-300"
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="gap-2 text-base h-12"
            >
              <Link href="/downloads/resume.pdf">
                View Resume
                <HugeiconsIcon icon={FileDownIcon} size={18} />
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="gap-2 text-base h-12 group"
            >
              <Link
                href="https://github.com/2102ankit"
                target="_blank"
                rel="noopener noreferrer"
              >
                <HugeiconsIcon icon={GithubIcon} size={18} />
                GitHub
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={18}
                  className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
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
          {/* <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">
            Featured Projects
          </h2> */}
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
                    <h3 className="text-xl font-semibold mb-2">
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

      <section className="py-16 max-w-3xl mx-auto px-6 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <SectionDivider label="Skills" />
          {/* <h2 className="text-3xl sm:text-4xl font-bold text-center">Skills</h2> */}
        </motion.div>

        {/* Featured skills tiles (homepage) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-3"
        >
          {/* compute featured skills */}
          {(() => {
            const all = skillCategories.flatMap((c) => c.skills);
            const featuredNames = [
              "TypeScript",
              "React",
              "Next.js",
              "Tailwind CSS",
              "Node.js",
              "Docker",
              "AWS",
              "Prisma",
              "GraphQL",
              "PostgreSQL",
              "Kubernetes",
              "GitHub",
            ];
            const featured = featuredNames
              .map((n) => all.find((s) => s.name === n))
              .filter(Boolean) as typeof all;

            return (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                {featured.map((skill) => (
                  <div key={skill.name} className="w-full">
                    <div className="relative w-full pt-[100%]">
                      {/* square spacer */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 rounded-md border border-border bg-card text-center overflow-hidden">
                        <div className="flex items-center justify-center mb-2">
                          {(() => {
                            if (skill.lightIcon) {
                              return (
                                <span
                                  style={
                                    skill.lightFilter
                                      ? { filter: skill.lightFilter }
                                      : undefined
                                  }
                                >
                                  <skill.lightIcon className="w-20 h-20" />
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                        <div className="text-sm font-medium mt-1 w-full leading-tight">
                          <span className="block text-center break-words">
                            {skill.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
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
    </div>
  );
}
