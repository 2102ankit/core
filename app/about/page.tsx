"use client";

import { Card } from "@/components/ui/card";
import {
  getSkillsAndExperience,
  type Experience,
  type Skill,
} from "@/lib/data";
import { motion } from "framer-motion";
import { Award, Briefcase, GraduationCap, Trophy } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const timeline = [
  {
    icon: GraduationCap,
    title: "Education",
    date: "2021 - 2025",
    items: [
      "Bachelor of Technology in Computer Engineering, Sardar Patel Institute of Technology, Mumbai",
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

export default function AboutPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSkills() {
      try {
        const [_skills, _exp] = await getSkillsAndExperience();
        setExperience(_exp);
        setSkills(_skills);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSkills();
  }, []);

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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Passionate software engineer with expertise in full-stack
            development, dedicated to building innovative solutions that make a
            difference.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Award className="text-primary" />
              Background
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                I&apos;m a Software Engineer at ISS-Stoxx with a strong
                foundation in full-stack development. My journey in tech has
                been driven by curiosity and a passion for solving complex
                problems with elegant solutions.
              </p>
              <p>
                I specialize in the MERN stack, Python, and Spring Boot, with a
                keen interest in DevOps practices and Machine Learning. I
                believe in writing clean, maintainable code and building systems
                that scale.
              </p>
              <p>
                Beyond technical skills, I&apos;ve held leadership positions
                including Finance Secretary at Students&apos; Council and
                Training and Placement Coordinator, managing budgets and
                organizing events that impacted thousands of students.
              </p>
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
                <Card className="p-6 hover:border-foreground/20 transition-all">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold">{exp.title}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">
                      {exp.date}
                    </p>
                  </div>
                  <ul className="space-y-2 text-muted-foreground">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-8">Skills & Technologies</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4"
          >
            {skills.map((skill) => (
              <motion.div
                key={skill.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:border-foreground/20 transition-all"
              >
                <Image
                  src={skill.icon}
                  alt={skill.name}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  unoptimized
                />
                <div className="font-medium text-sm">{skill.name}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
