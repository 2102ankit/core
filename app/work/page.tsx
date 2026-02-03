"use client";

import ProjectThumbnail from "@/components/project-thumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProjects, type Project } from "@/lib/data";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Github,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TechBadge } from "@/components/ui/tech-badge";
import { useEffect, useRef, useState } from "react";

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.tags))
  ).sort();

  const filteredProjects =
    selectedTags.length > 0
      ? projects.filter((project) =>
          selectedTags.every((tag) => project.tags.includes(tag))
        )
      : projects;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const marqueeProjects = [...projects, ...projects.slice(0, 4)];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Work</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collection of my work showcasing various technologies
            <br/>
            and
            problem-solving approaches
          </p>
        </motion.div>
      </section>

      <section className="py-12 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-center mb-2">
            Featured Projects
          </h2>
          <p className="text-muted-foreground text-center">
            A showcase of my best work
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-xl" />
                <div className="p-6 bg-card border border-border rounded-b-xl">
                  <div className="h-6 bg-muted rounded mb-3" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-6 w-max hover:paused"
              animate={{ x: [0, -(projects.length * 320)] }}
              transition={{
                duration: projects.length * 4,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...projects, ...projects, ...projects, ...projects].map((project, index) => (
                <Card
                  key={`${project.id}-${index}`}
                  className="w-[320px] shrink-0 hover:border-foreground/20 transition-all pt-0"
                >
                  <div className="relative h-48 bg-muted/50 flex items-center justify-center text-xl font-medium border-b rounded-t-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <ProjectThumbnail
                      src={project.thumbnail}
                      alt={project.title || "Project thumbnail"}
                      variant="cover"
                    />
                  </div>
                  <div className="p-4 py-3 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      {project.github_url && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="gap-2 flex-1"
                        >
                          <Link
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Github
                            <Github size={14} />
                          </Link>
                        </Button>
                      )}
                      {project.demo_url && (
                        <Button
                          asChild
                          size="sm"
                          className="gap-2 flex-1"
                        >
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Demo <ExternalLink size={14} />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          </div>
        )}
      </section>

      <section className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">All Projects</h2>

          {allTags.length > 0 && (
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-3">
                Filter by technology:
              </p>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="px-3 py-1.5 hover:bg-gray-500/30 cursor-pointer hover:border-foreground/50 transition-all
                     dark:hover:text-white
                    "
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTags([])}
                    className="text-xs"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          )}

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col hover:border-foreground/20 transition-all pt-0">
                  <div className="relative h-48 bg-muted/50 flex items-center justify-center text-xl font-medium border-b rounded-t-xl overflow-hidden">
                    <ProjectThumbnail
                      src={project.thumbnail}
                      alt={project.title || "Project thumbnail"}
                      variant="cover"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
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
                            <Github size={16} /> GitHub
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
                            Demo <ArrowUpRight size={16} />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground"
            >
              No projects found matching the selected filters.
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6 text-center">
            Explore more of my work and experiments
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/labs">
                Labs <ArrowUpRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/blog">
                Blog <ArrowUpRight size={16} />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
