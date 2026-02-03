"use client";

import ProjectThumbnail from "@/components/project-thumbnail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Award, Briefcase, GraduationCap, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const timeline = [
  {
    icon: GraduationCap,
    title: "Education",
    date: "2021 - 2025",
    items: [
      "B. Tech in Computer Engineering, Sardar Patel Institute of Technology, Mumbai",
      "Minor in Management, S. P. Jain Institute of Management and Research, Mumbai",
    ],
  },
  {
    icon: Trophy,
    title: "Achievements",
    date: "2023 - 2024",
    items: [
      "Top 6 out of 350+ teams in Smart India Hackathon 2023 Finals",
      "Top 25 Teams out of 300+ in S.P.I.T. Hackathon 2024",
    ],
  },
];

const experience = [
  {
    title: "Software Engineer",
    company: "ISS-Stoxx",
    date: "Jan 2025 - Present | Mumbai",
    description: [
      "UI development using React, Spring Boot and SQL Server",
      "Data Pipeline development in Python",
      "Focus on best code practices and DevOps exploration with Docker",
      "Contributed to scalable systems and innovative solutions.",
    ],
    tags: ["React", "SQL Server", "Python", "Docker"],
    logo: "/images/experience/iss-mi.png",
  },
  {
    title: "Web Development Intern (Remote)",
    company: "Alhansat Solutions",
    date: "Sep 2023 - Nov 2023 | Remote",
    tags: ["SvelteKit", "PDF Js", "Tailwind"],
    description: [
      "Created a dynamic business card generator module and integrated it with Developerstar",
      "Collaborated with Team Lead to understand user requirements and added customization",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">About Me</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
            Passionate software engineer with expertise in full-stack
            development, dedicated to building innovative solutions that make a
            difference.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 flex items-baseline gap-3">
            <Briefcase className="text-primary" />
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 rounded-md">
                  {/* accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-primary to-primary/60" />

                  <div className="flex flex-col gap-4 justify-baseline">
                    <div className="flex gap-4 items-end">
                      {exp.logo && (
                        <div
                          className="relative rounded-md border border-border color-transparent
                       min-h-24 h-full w-24 md:w-36 sm:w-52"
                        >
                          <ProjectThumbnail src={exp.logo} alt={exp.company} />
                        </div>
                      )}

                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{exp.title}</h3>
                        <p className="text-primary font-medium">
                          {exp.company}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {exp.date}
                        </p>

                        {exp.tags?.length && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {exp.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-muted-foreground">
                      {exp.description.map((item, i) => (
                        <li
                          key={i}
                          className="flex gap-2 items-start transition-colors hover:text-foreground"
                        >
                          <span className="text-primary mt-0.5 transition-transform group-hover:scale-125">
                            ▹
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Skills & Technologies</h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.02,
                },
              },
            }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"
          >
            {[
              { name: "C++", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg" },
              { name: "Java", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg" },
              { name: "JavaScript", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" },
              { name: "TypeScript", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" },
              { name: "Python", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" },
              { name: "React", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" },
              { name: "Redux", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg" },
              { name: "Tailwind", icon: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" },
              { name: "Node.js", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" },
              { name: "Express", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" },
              { name: "Spring Boot", icon: "https://www.vectorlogo.zone/logos/springio/springio-icon.svg" },
              { name: "MongoDB", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" },
              { name: "Redis", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg" },
              { name: "MySQL", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg" },
              { name: "PostgreSQL", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" },
              { name: "SQL Server", icon: "https://www.svgrepo.com/show/303229/microsoft-sql-server-logo.svg" },
              { name: "Docker", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg" },
              { name: "Git", icon: "https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" },
              { name: "Linux", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg" },
              { name: "Postman", icon: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
              { name: "Pandas", icon: "https://raw.githubusercontent.com/devicons/devicon/2ae2a900d2f041da66e950e4d48052658d850630/icons/pandas/pandas-original.svg" },
            ].map((skill) => (
              <motion.div
                key={skill.name}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3 },
                  },
                }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-card hover:border-foreground/20 transition-all"
              >
                <Image
                  src={skill.icon}
                  alt={skill.name}
                  width={32}
                  height={32}
                />
                <span className="text-xs sm:text-sm font-medium text-center whitespace-nowrap">{skill.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 pl-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Award className="text-primary" />
              Background
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                I&apos;m a Software Engineer at ISS-Stoxx, crafting slick
                full-stack solutions with React, Python and Spring Boot.
              </p>
              <p>
                I live for clean, scalable code and turning complex problems
                into elegant wins.
              </p>
              <p>
                Obsessed with DevOps and Machine Learning, I&apos;m always
                pushing what&apos;s possible.
              </p>
              <p>Music 🎧. Humor 😂. Code. 💻</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative border-l-2 border-border pl-8 space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative group"
                >
                  <div className="absolute -left-[50px] top-0 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center group-hover:border-foreground group-hover:bg-accent transition-all">
                    <item.icon size={16} />
                  </div>
                  <div className="mb-2">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground italic">
                      {item.date}
                    </p>
                  </div>
                  <ul className="space-y-2 text-muted-foreground">
                    {item.items.map((detail, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary mt-1">▹</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Let&apos;s Work Together</h2>
          <p className="text-muted-foreground mb-6">
            Interested in collaborating or have a question? Feel free to reach
            out.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">Contact Me</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/work">View My Work</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
