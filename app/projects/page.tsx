"use client";

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
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  useEffect(() => {
    if (projects.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [projects.length]);

  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.tags))
  ).sort();

  const filteredProjects =
    selectedTags.length > 0
      ? projects.filter((project) =>
          selectedTags.every((tag) => project.tags.includes(tag))
        )
      : projects;

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getVisibleProjects = () => {
    if (projects.length === 0) return [];
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + projects.length) % projects.length;
      visible.push({ ...projects[index], position: i });
    }
    return visible;
  };

  if (loading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3 mx-auto" />
            <div className="h-96 bg-muted rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Projects</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collection of my work showcasing various technologies and
            problem-solving approaches
          </p>
        </motion.div>

        {projects.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-20 relative"
          >
            <h2 className="text-2xl font-bold mb-8 text-center">
              Featured Carousel
            </h2>
            <div className="relative h-[500px] flex items-center justify-center perspective-1000">
              <button
                onClick={prevProject}
                className="absolute left-4 z-20 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-foreground/20 transition-all"
                aria-label="Previous project"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="relative w-full h-full flex items-center justify-center">
                <AnimatePresence initial={false}>
                  {getVisibleProjects().map((project) => {
                    const position = project.position;
                    const isCenter = position === 0;
                    const zIndex = 10 - Math.abs(position);

                    return (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity:
                            Math.abs(position) > 1 ? 0.5 : isCenter ? 1 : 0.7,
                          scale: isCenter ? 1 : 0.85,
                          x: position * 260,
                          // x: [-1, 0, 1].includes(position)
                          //   ? position * 320
                          //   : position * 260,
                          rotateY: position * 15,
                          zIndex,
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="absolute w-80"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <Card
                          className={`h-full pt-0 ${
                            isCenter ? "border-foreground/20" : ""
                          }`}
                        >
                          <div className="h-48 bg-muted/50 flex items-center justify-center text-xl font-medium border-b">
                            {project.thumbnail}
                          </div>
                          <CardHeader>
                            <CardTitle>{project.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {project.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {project.tags.slice(0, 4).map((tag) => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter className="gap-2">
                            {project.github_url && (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="gap-2"
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
                              <Button asChild size="sm" className="gap-2">
                                <a
                                  href={project.demo_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink size={16} /> Demo
                                </a>
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <button
                onClick={nextProject}
                className="absolute right-4 z-20 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-foreground/20 transition-all"
                aria-label="Next project"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6">All Projects</h2>

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
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="h-full flex flex-col hover:border-foreground/20 transition-all pt-0">
                    <div className="h-48 bg-muted/50 flex items-center justify-center text-xl font-medium border-b">
                      {project.thumbnail}
                    </div>
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="gap-2">
                      {project.github_url && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="gap-2"
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
                        <Button asChild size="sm" className="gap-2">
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink size={16} /> Demo
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
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
        </motion.section>
      </div>
    </div>
  );
}
