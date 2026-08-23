"use client";

import { Container } from "@/components/container";
import {
  AlhansatSolutionsTooltipContent,
  DefaultTooltipContent,
  IssStoxxTooltipContent,
} from "@/components/experience-tooltip-content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip-card";
import { skillCategories } from "@/data/skills";
import { formatDateRange, formatDuration } from "@/lib/utils";
import {
  Briefcase01Icon,
  Calendar01Icon,
  ChevronsLeftRightIcon,
  ChevronsRightLeftIcon,
  ComputerTerminal01Icon,
  GraduationCapIcon,
  Location08Icon,
  Medal01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type TimelineItem =
  | {
      name: string;
      degree?: string;
      location?: string;
      startYear?: string | number;
      endYear?: string | number;
      logo?: string;
      misc?: string;
    }
  | {
      title: string;
      subtitle?: string;
      startYear?: string | number;
      endYear?: string | number;
      logo?: string;
    };

const educationItems: TimelineItem[] = [
  {
    name: "B. Tech in Computer Engineering",
    degree: "Sardar Patel Institute of Technology, Mumbai",
    misc: "Coursework : Database Management Systems, Operating Systems, Computer Networks ",
    startYear: 2021,
    endYear: 2025,
    logo: "/images/education/SPIT_logo.png",
  },
  {
    name: "Minor in Management",
    degree: "S. P. Jain Institute of Management and Research, Mumbai",
    startYear: 2021,
    endYear: 2025,
    logo: "/images/education/spjimr.png",
    misc: "Coursework : Accounting & Finance, Supply Chain, IT for Management, Marketing",
  },
];

const achievementItems: TimelineItem[] = [
  {
    title: "Top 6 out of 350+ teams",
    subtitle: "Smart India Hackathon 2023, Kolkata",
    startYear: 2023,
    endYear: 2024,
  },
  {
    title: "Top 25 Teams out of 300+ teams",
    subtitle: "S.P.I.T. Hackathon 2024, Mumbai",
    startYear: 2023,
    endYear: 2024,
  },
];

const experience = [
  {
    id: "iss-stoxx",
    title: "Software Engineer",
    company: "ISS-Stoxx",
    startDate: new Date("2025-07-02"),
    endDate: null,
    location: "Mumbai",
    description: [
      "Automated more and more ETL processes",
      "Created Automated Reports using Microsoft SSRS",
      "Added more features to Internal Reporting UI and Backend Modules",
      "Created a common validation framework to be used across different ETL pipelines",
    ],
    tags: ["Python", "SQL Server", "Redis", "Gitlab Actions", "Docker/Podman"],
    logo: "/images/experience/iss-mi.png",
    current: true,
    TooltipComponent: IssStoxxTooltipContent,
  },
  {
    id: "iss-stoxx-intern",
    title: "Software Engineer Intern",
    company: "ISS-Stoxx",
    startDate: new Date("2025-01-02"),
    endDate: new Date("2025-07-01"),
    location: "Mumbai",
    description: [
      "Automated processes for Business in existing WebApplcation",
      "Worked on ETL of MF/ETF data",
      "Migrated internal deprecated UI library to Semantic UI",
      "Contributed to good documentation and implemented good practices",
    ],
    tags: ["React", "Spring Boot", "SQL Server", "Python"],
    logo: "/images/experience/iss-mi.png",
    TooltipComponent: IssStoxxTooltipContent,
  },
  {
    id: "alhansat-solutions",
    title: "Web Development Intern",
    company: "Alhansat Solutions",
    startDate: new Date("2023-09-01"),
    endDate: new Date("2023-11-30"),
    location: "Mumbai (Remote)",
    tags: ["SvelteKit", "PDF Js", "Tailwind"],
    description: [
      "Created a dynamic business card generator module and integrated it with Developerstar",
      "Collaborated with Team Lead to understand user requirements and added customization",
    ],
    current: false,
    TooltipComponent: AlhansatSolutionsTooltipContent,
  },
];

export default function AboutPage() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639px)");
    const onChange = () => setIsSmall(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const currentTheme = mounted
    ? theme === "system"
      ? systemTheme
      : theme
    : null;

  return (
    <Container size="narrow" className="py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-16"
      >
        <h1 className="text-display text-foreground mb-4">About Me</h1>
        <div className="space-y-4 text-body text-muted-foreground mt-4 max-w-xl mx-auto text-justify">
          <p>
            I&apos;m a{" "}
            <span className="font-bold"> Full Stack Software Engineer </span>
            at <span className="font-semibold">ISS-Stoxx.</span> I am passionate
            in developing clean, scalable coding solutions to complex problems
            that make a difference. My primary Tech stack includes{" "}
            <span className="font-bold">React, Python and SQL Server.</span> And
            my Interests? Music 🎧. Humor 😂. Code. 💻
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-20"
      >
        <h2
          id="experience"
          className="text-xl sm:text-xl font-bold mb-6 flex items-center gap-3 scroll-mt-28"
        >
          <HugeiconsIcon icon={Briefcase01Icon} className="text-primary" />
          Experience
        </h2>
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              id={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="scroll-mt-28"
            >
              <Card className="group p-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20 rounded-md">
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1 flex-wrap">
                      <h3 className="text-lg font-semibold">{exp.title}</h3>
                      <span className="text-muted-foreground">@</span>
                      <Tooltip
                        content={(() => {
                          const Component =
                            exp.TooltipComponent || DefaultTooltipContent;
                          return <Component {...exp} />;
                        })()}
                        containerClassName="inline-block"
                      >
                        <span className="font-medium text-primary underline cursor-pointer transition-colors p-4 -m-4">
                          {exp.company}
                        </span>
                      </Tooltip>
                      {exp.current && (
                        <span className="relative flex h-2.5 w-2.5 shrink-0 mt-0.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs px-2.5 py-1 rounded-md bg-primary/5 border border-primary/10 text-primary font-medium whitespace-nowrap shrink-0">
                      {formatDuration(exp.startDate, exp.endDate)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <HugeiconsIcon
                        icon={Calendar01Icon}
                        className="w-3.5 h-3.5"
                      />
                      <span>{formatDateRange(exp.startDate, exp.endDate)}</span>
                    </div>
                    <span className="text-muted-foreground/50">•</span>
                    <div className="flex items-center gap-1.5">
                      <HugeiconsIcon
                        icon={Location08Icon}
                        className="w-3.5 h-3.5"
                      />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  {exp.tags?.length && (
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {exp.description.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-2 items-center group-hover:text-foreground transition-colors"
                      >
                        <span className="text-primary mt-0.5 shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-3.5 h-3.5"
                          >
                            <circle cx="12" cy="12" r="5" />
                          </svg>
                        </span>
                        <span className="leading-relaxed">{item}</span>
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
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 scroll-mt-28 gap-3"
          id="skills"
        >
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
            <HugeiconsIcon
              icon={ComputerTerminal01Icon}
              className="text-primary"
            />
            Skills & Technologies
          </h2>
          <div className="self-start sm:self-auto">
            <button
              aria-expanded={showAllSkills}
              onClick={() => setShowAllSkills((s) => !s)}
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <span className="inline-flex items-center gap-1.5">
                {showAllSkills ? "Show Less " : "Show More"}

                <span className="relative size-3.5">
                  <HugeiconsIcon
                    icon={ChevronsRightLeftIcon}
                    size={14}
                    className={`
                        absolute inset-0
                        transform transition-all duration-300 ease-in-out
                        ${
                          showAllSkills
                            ? "opacity-100 rotate-90 scale-100"
                            : "opacity-0 -rotate-90 scale-75 blur-sm"
                        }
                    `}
                  />

                  <HugeiconsIcon
                    icon={ChevronsLeftRightIcon}
                    size={14}
                    className={`
        absolute inset-0
        transform transition-all duration-300 ease-in-out
        ${
          showAllSkills
            ? "opacity-0 rotate-180 scale-75 blur-sm"
            : "opacity-100 rotate-90 scale-100 "
        }
      `}
                  />
                </span>
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {skillCategories.map((cat) => {
            const visible = cat.skills.filter(
              (s: any) => showAllSkills || s.featured,
            );
            return (
              <SkillCategoryRow
                key={cat.label}
                cat={cat}
                visible={visible}
                mounted={mounted}
                currentTheme={currentTheme ?? null}
                isSmall={isSmall}
              />
            );
          })}
        </div>
      </motion.div>

      <div className="space-y-24 mb-32">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          id="education"
          className="scroll-mt-28"
        >
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                <HugeiconsIcon
                  icon={GraduationCapIcon}
                  className="text-primary"
                  size={22}
                />
                Education
              </h3>
            </div>

            <ul className="mt-4 space-y-6">
              {educationItems.map((item, i) => (
                <li
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-border/80 ring-2 ring-border flex items-center justify-center overflow-hidden relative shrink-0 bg-white p-0.5">
                      {item.logo ? (
                        <Image
                          src={item.logo}
                          alt={(item as any).name}
                          width={48}
                          height={48}
                        />
                      ) : (
                        <HugeiconsIcon icon={GraduationCapIcon} size={18} />
                      )}
                    </div>

                    <div className="leading-tight flex flex-col gap-px">
                      <div className="font-semibold text-foreground text-base">
                        {(item as any).name}
                      </div>
                      {(item as any).degree && (
                        <div className="text-sm text-foreground/80">
                          {(item as any).degree}
                        </div>
                      )}
                      {(item as any).misc && (
                        <div className="text-xs text-foreground/60 wrap-break-word max-w-md">
                          {(item as any).misc}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="hidden sm:block text-right text-sm text-muted-foreground sm:ml-4">
                    {(item as any).startYear || (item as any).endYear ? (
                      <div className="whitespace-nowrap sm:whitespace-normal">
                        {(item as any).startYear ?? ""} —{" "}
                        {(item as any).endYear ?? ""}
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          id="achievements"
          className="scroll-mt-28"
        >
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                <HugeiconsIcon
                  icon={Medal01Icon}
                  className="text-primary"
                  size={22}
                />
                Achievements
              </h3>
            </div>

            <ul className="mt-4 space-y-6">
              {achievementItems.map((item, i) => (
                <li key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center">
                      <HugeiconsIcon icon={Medal01Icon} size={18} />
                    </div>

                    <div className="leading-tight">
                      <div className="font-semibold text-foreground">
                        {(item as any).title}
                      </div>
                      {(item as any).subtitle ? (
                        <div className="text-sm text-muted-foreground">
                          {(item as any).subtitle}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="hidden sm:block text-right text-sm text-muted-foreground">
                    {(item as any).startYear || (item as any).endYear ? (
                      <div>
                        {(item as any).startYear ?? ""} —{" "}
                        {(item as any).endYear ?? ""}
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
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
    </Container>
  );
}

// Unified SkillCategoryRow: two-column mobile layout, hide empty categories,
// animate labels and chips on entry/exit, desktop uses measured height.
function SkillCategoryRow({
  cat,
  visible,
  mounted,
  currentTheme,
  isSmall,
}: {
  cat: any;
  visible: any[];
  mounted: boolean;
  currentTheme: string | null;
  isSmall: boolean;
}) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const smoothEase = "cubic-bezier(0.22, 1, 0.36, 1)" as const;
  const entryEase = [0.16, 1, 0.3, 1] as const;
  const exitEase = [0.4, 0, 0.2, 1] as const;
  const heightSpring = {
    type: "spring",
    stiffness: 320,
    damping: 34,
    mass: 0.6,
  } as const;
  const chipTransition = { duration: 0.72, ease: entryEase } as const;
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: entryEase,
        staggerChildren: 0.05,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: exitEase,
        staggerChildren: 0.02,
        staggerDirection: -1,
      },
    },
  } as const;
  const chipVariants = {
    initial: { opacity: 0, scale: 0.72, filter: "blur(8px)", y: 4 },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      y: 0,
      transition: chipTransition,
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      filter: "blur(10px)",
      y: -2,
      transition: { duration: 0.22, ease: exitEase, delay: 0.08 },
    },
  } as const;
  const [measured, setMeasured] = useState(0);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const update = () => setMeasured(el.scrollHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [visible.length, isSmall]);

  // hide empty categories everywhere
  if (!visible || visible.length === 0) return null;

  // mobile: two-column layout with animated category container and chip animations
  if (isSmall) {
    // If we haven't measured yet, render a non-animated version with `ref`
    // so the ResizeObserver can pick up the height. This prevents the
    // initial flash/jump on mobile when toggling categories.
    if (measured === 0) {
      return (
        <div
          className="grid grid-cols-[96px_1fr] gap-x-4 gap-y-2 items-start"
          key={cat.label}
        >
          <span className="shrink-0 w-[96px] text-sm text-muted-foreground pt-0.5">
            {cat.label}
          </span>
          <div ref={innerRef}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {visible.map((skill) => (
                <div
                  key={skill.name}
                  className="inline-flex items-center gap-2 text-sm h-8 leading-none"
                >
                  {mounted ? (
                    currentTheme === "dark" ? (
                      skill.darkIcon ? (
                        <span
                          className="flex-none"
                          style={
                            skill.darkFilter
                              ? { filter: skill.darkFilter }
                              : undefined
                          }
                        >
                          <skill.darkIcon size={18 * (skill.scale || 1)} />
                        </span>
                      ) : skill.lightIcon ? (
                        <span
                          className="flex-none"
                          style={
                            skill.lightFilter
                              ? { filter: skill.lightFilter }
                              : undefined
                          }
                        >
                          <skill.lightIcon size={18 * (skill.scale || 1)} />
                        </span>
                      ) : null
                    ) : skill.lightIcon ? (
                      <span
                        className="flex-none"
                        style={
                          skill.lightFilter
                            ? { filter: skill.lightFilter }
                            : undefined
                        }
                      >
                        <skill.lightIcon size={18 * (skill.scale || 1)} />
                      </span>
                    ) : skill.darkIcon ? (
                      <span
                        className="flex-none"
                        style={
                          skill.darkFilter
                            ? { filter: skill.darkFilter }
                            : undefined
                        }
                      >
                        <skill.darkIcon size={18 * (skill.scale || 1)} />
                      </span>
                    ) : null
                  ) : skill.lightIcon ? (
                    <span
                      className="flex-none"
                      style={
                        skill.lightFilter
                          ? { filter: skill.lightFilter }
                          : undefined
                      }
                    >
                      <skill.lightIcon size={18 * (skill.scale || 1)} />
                    </span>
                  ) : skill.darkIcon ? (
                    <span
                      className="flex-none"
                      style={
                        skill.darkFilter
                          ? { filter: skill.darkFilter }
                          : undefined
                      }
                    >
                      <skill.darkIcon size={18 * (skill.scale || 1)} />
                    </span>
                  ) : null}

                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <AnimatePresence>
        <motion.div
          key={cat.label}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: measured, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={heightSpring}
          style={{ overflow: "hidden" }}
          className="grid grid-cols-[96px_1fr] gap-x-4 gap-y-2 items-start"
        >
          <motion.span
            className="shrink-0 w-[96px] text-sm text-muted-foreground pt-0.5"
            initial={{ opacity: 0, x: -8, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.96 }}
            transition={{ duration: 0.7, ease: entryEase }}
            style={{ transformOrigin: "left center" }}
          >
            {cat.label}
          </motion.span>

          <motion.div
            ref={innerRef}
            className="flex flex-wrap items-center gap-x-4 gap-y-2"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <AnimatePresence initial={false}>
              {visible.map((skill) => (
                <motion.div
                  key={skill.name}
                  variants={chipVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="inline-flex items-center gap-2 text-sm h-8 leading-none will-change-transform"
                  style={{ transformOrigin: "center center" }}
                >
                  {mounted ? (
                    currentTheme === "dark" ? (
                      skill.darkIcon ? (
                        <span
                          className="flex-none"
                          style={
                            skill.darkFilter
                              ? { filter: skill.darkFilter }
                              : undefined
                          }
                        >
                          <skill.darkIcon size={18 * (skill.scale || 1)} />
                        </span>
                      ) : skill.lightIcon ? (
                        <span
                          className="flex-none"
                          style={
                            skill.lightFilter
                              ? { filter: skill.lightFilter }
                              : undefined
                          }
                        >
                          <skill.lightIcon size={18 * (skill.scale || 1)} />
                        </span>
                      ) : null
                    ) : skill.lightIcon ? (
                      <span
                        className="flex-none"
                        style={
                          skill.lightFilter
                            ? { filter: skill.lightFilter }
                            : undefined
                        }
                      >
                        <skill.lightIcon size={18 * (skill.scale || 1)} />
                      </span>
                    ) : skill.darkIcon ? (
                      <span
                        className="flex-none"
                        style={
                          skill.darkFilter
                            ? { filter: skill.darkFilter }
                            : undefined
                        }
                      >
                        <skill.darkIcon size={18 * (skill.scale || 1)} />
                      </span>
                    ) : null
                  ) : skill.lightIcon ? (
                    <span
                      className="flex-none"
                      style={
                        skill.lightFilter
                          ? { filter: skill.lightFilter }
                          : undefined
                      }
                    >
                      <skill.lightIcon size={18 * (skill.scale || 1)} />
                    </span>
                  ) : skill.darkIcon ? (
                    <span
                      className="flex-none"
                      style={
                        skill.darkFilter
                          ? { filter: skill.darkFilter }
                          : undefined
                      }
                    >
                      <skill.darkIcon size={18 * (skill.scale || 1)} />
                    </span>
                  ) : null}

                  {skill.name}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // desktop: measured-height animation to avoid layout jumps
  return (
    <AnimatePresence>
      <motion.div
        layout={false}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: measured, opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={heightSpring}
        style={{ overflow: "hidden" }}
        className="grid grid-cols-1 sm:grid-cols-[96px_1fr] gap-x-8 gap-y-2 items-start"
        key={cat.label}
      >
        <span className="sm:shrink-0 text-sm text-muted-foreground pt-0.5">
          {cat.label}
        </span>
        <motion.div
          ref={innerRef}
          className="flex flex-wrap items-center gap-x-4 gap-y-2"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {visible.map((skill) => (
            <motion.div
              key={skill.name}
              variants={chipVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="inline-flex items-center gap-2 text-sm h-8 leading-none will-change-transform"
              style={{ transformOrigin: "center center" }}
            >
              {mounted ? (
                currentTheme === "dark" ? (
                  skill.darkIcon ? (
                    <span
                      className="flex-none"
                      style={
                        skill.darkFilter
                          ? { filter: skill.darkFilter }
                          : undefined
                      }
                    >
                      <skill.darkIcon size={18 * (skill.scale || 1)} />
                    </span>
                  ) : skill.lightIcon ? (
                    <span
                      className="flex-none"
                      style={
                        skill.lightFilter
                          ? { filter: skill.lightFilter }
                          : undefined
                      }
                    >
                      <skill.lightIcon size={18 * (skill.scale || 1)} />
                    </span>
                  ) : null
                ) : skill.lightIcon ? (
                  <span
                    className="flex-none"
                    style={
                      skill.lightFilter
                        ? { filter: skill.lightFilter }
                        : undefined
                    }
                  >
                    <skill.lightIcon size={18 * (skill.scale || 1)} />
                  </span>
                ) : skill.darkIcon ? (
                  <span
                    className="flex-none"
                    style={
                      skill.darkFilter
                        ? { filter: skill.darkFilter }
                        : undefined
                    }
                  >
                    <skill.darkIcon size={18 * (skill.scale || 1)} />
                  </span>
                ) : null
              ) : skill.lightIcon ? (
                <span
                  className="flex-none"
                  style={
                    skill.lightFilter
                      ? { filter: skill.lightFilter }
                      : undefined
                  }
                >
                  <skill.lightIcon size={18 * (skill.scale || 1)} />
                </span>
              ) : skill.darkIcon ? (
                <span
                  className="flex-none"
                  style={
                    skill.darkFilter ? { filter: skill.darkFilter } : undefined
                  }
                >
                  <skill.darkIcon size={18 * (skill.scale || 1)} />
                </span>
              ) : null}

              {skill.name}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
