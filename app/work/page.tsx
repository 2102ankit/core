"use client";

import ProjectThumbnail from "@/components/project-thumbnail";
import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  GithubIcon,
} from "@hugeicons/core-free-icons";
import { getProjects, type Project } from "@/lib/data";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error loading projects:", error);
      }
    }
    loadProjects();
  }, []);

  const allTags = Array.from(
    new Set(
      projects.flatMap((project) =>
        project.filter_tags && project.filter_tags.length > 0
          ? project.filter_tags
          : project.tags,
      ),
    ),
  ).sort();

  const featuredIds = projects
    .filter((project) => project.featured)
    .map((p) => p.id);
  const sortedProjects = [...projects].sort((a, b) => {
    const aFeatured = featuredIds.includes(a.id);
    const bFeatured = featuredIds.includes(b.id);
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    return 0;
  });

  const filteredProjects =
    selectedTags.length > 0
      ? sortedProjects.filter((project) => {
          const tagsToFilter =
            project.filter_tags && project.filter_tags.length > 0
              ? project.filter_tags
              : project.tags;
          return selectedTags.every((tag) => tagsToFilter.includes(tag));
        })
      : sortedProjects;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <Container size="wide" className="pt-12 md:pt-16">
      <section>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            A collection of my work showcasing various technologies
            <br />
            and problem-solving approaches
          </p>
        </motion.div>
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
                    className="px-3 py-2 hover:bg-gray-500/30 cursor-pointer hover:border-foreground/50 transition-all hover:text-black dark:hover:text-white"
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
                id={`project-${project.id}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="scroll-mt-28"
              >
                <Card className="h-full flex flex-col hover:border-foreground/20 transition-all pt-0">
                  <div className="relative h-48 bg-muted/50 flex items-center justify-center text-xl font-medium border-b rounded-t-xl overflow-hidden">
                    <ProjectThumbnail
                      src={project.thumbnail}
                      alt={project.title || "Project thumbnail"}
                      variant="cover"
                    />
                    {featuredIds.includes(project.id) && (
                      <div className="absolute top-4 -left-6 z-10">
                        <div className="bg-yellow-500 text-black font-bold text-xs px-6 py-1 -rotate-45 shadow-md">
                          FEATURED
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold mb-2">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-1">
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
                            Demo <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
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
                Labs <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/blog">
                Blog <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </Container>
  );
}
