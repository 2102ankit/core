"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechBadge } from "@/components/ui/tech-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFeaturedProjects, type Project } from "@/lib/data";

const skills = [
  {
    name: "C++",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg",
  },
  {
    name: "Java",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg",
  },
  {
    name: "JavaScript",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg",
  },
  {
    name: "TypeScript",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg",
  },
  {
    name: "Python",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg",
  },
  {
    name: "React",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg",
  },
  {
    name: "Node.js",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "MongoDB",
    icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getFeaturedProjects();
        setProjects(data.slice(0, 2));
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <div className="min-h-screen  max-w-3xl mx-auto">
      <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 ">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <Image
              src="https://avatars.githubusercontent.com/u/105378102?v=4"
              alt="Ankit Mishra"
              width={140}
              height={140}
              className="rounded-full mx-auto outline-4 outline-accent-foreground/30"
              priority
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
          >
            Ankit Mishra
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl text-muted-foreground mb-6"
          >
            Software Engineer at ISS-Stoxx
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed"
          >
            Full-Stack Developer <TechBadge variant="mern">MERN</TechBadge>,{" "}
            <TechBadge variant="python">Python</TechBadge>,{" "}
            <TechBadge variant="spring">Spring Boot</TechBadge>
            with a passion for <TechBadge variant="devops">
              DevOps
            </TechBadge>{" "}
            and <TechBadge variant="ml">ML</TechBadge>. I obsess over details to
            craft innovative, high-impact software from concept to delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Button asChild size="lg" className="gap-2">
              <Link href="/projects">
                View Projects <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Me</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-20">
        <div className="mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Skills & Technologies
            </h2>
            <p className="text-muted-foreground">
              Technologies I work with to build amazing applications
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          >
            {skills.map((skill) => (
              <motion.div
                key={skill.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:border-foreground/20 transition-all"
              >
                <Image
                  src={skill.icon}
                  alt={skill.name}
                  width={24}
                  height={24}
                />
                <span className="font-medium">{skill.name}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <Button asChild variant="link">
              <Link href="/about" className="gap-2">
                View All Skills <ArrowRight size={16} />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 ">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Featured Projects
            </h2>
            <p className="text-muted-foreground">
              Check out some of my recent work
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((i) => (
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
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
            >
              {projects.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
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
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/projects">
                View All Projects <ArrowRight size={18} />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
