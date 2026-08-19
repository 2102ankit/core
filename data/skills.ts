import {
  Anthropic,
  Bash,
  C,
  Canva,
  ClaudeAI,
  CPlusPlus,
  CursorDark,
  CursorLight,
  Docker,
  ExpressJsDark,
  ExpressJsLight,
  FastAPI,
  Figma,
  FramerDark,
  FramerLight,
  Git,
  GitHubDark,
  GitHubLight,
  GitLab,
  Go,
  Java,
  JavaScript,
  JSON,
  Markdown,
  MicrosoftSQLServer2,
  MongoDB,
  MySQL,
  NextJs,
  NodeJs,
  NumPy,
  Photoshop,
  PostgreSQL,
  Postman,
  Python,
  React,
  ReactQuery,
  ReactRouter,
  Redis,
  Redux,
  SemanticUI,
  ShadcnUI,
  Spring,
  TailwindCSS,
  TanStack,
  TypeScript,
  VisualStudioCode
} from "developer-icons";
import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

type Skill = {
  name: string;
  darkIcon?: IconComponent;
  lightIcon?: IconComponent;
  lightFilter?: string;
  darkFilter?: string;
  scale?: number;
  featured?: boolean;
};

type SkillCategory = {
  label: string;
  skills: Skill[];
};

const s = (
  name: string,
  dark?: IconComponent,
  light?: IconComponent,
  opts?: { lf?: string; df?: string; scale?: number; featured?: boolean },
): Skill => ({
  name,
  darkIcon: dark,
  lightIcon: light,
  lightFilter: opts?.lf,
  darkFilter: opts?.df,
  scale: opts?.scale,
  featured: opts?.featured,
});

export const skillCategories: SkillCategory[] = [
  {
    label: "Languages",
    skills: [
      s("TypeScript", TypeScript, TypeScript, { featured: true }),
      s("JavaScript", JavaScript, JavaScript, { featured: true }),
      s("Python", Python, Python, { featured: true }),
      s("Java", Java, Java, { featured: true, scale: 1.2 }),
      s("Go", Go, Go, { scale: 1.8 }),
      s("C", C, C),
      s("C++", CPlusPlus, CPlusPlus),
    ],
  },
  {
    label: "Frontend",
    skills: [
      s("React", React, React, { featured: true }),
      s("Next.js", NextJs, NextJs, {
        lf: "brightness(1.2)",
        featured: true,
        scale: 1.2,
      }),
      s("Tailwind CSS", TailwindCSS, TailwindCSS, {
        featured: true,
        scale: 1.2,
      }),
      s("shadcn/ui", ShadcnUI, ShadcnUI, {
        lf: "brightness(1.4) contrast(1.05)",
        scale: 1.2,
      }),
      s("Framer Motion", FramerLight, FramerDark),
      s("Redux", Redux, Redux),
      s("React Query", ReactQuery, ReactQuery),
      s("React Router", ReactRouter, ReactRouter, { scale: 1.2 }),
      s("Semantic UI", SemanticUI, SemanticUI),
      s("TanStack", TanStack, TanStack),
    ],
  },
  {
    label: "Backend",
    skills: [
      s("Node.js", NodeJs, NodeJs, { featured: true }),
      s("Express", ExpressJsLight, ExpressJsDark, { featured: true }),
      s("FastAPI", FastAPI, FastAPI, { featured: true }),
      s("Spring Boot", Spring, Spring, { featured: true }),
      s("Socket.io", undefined, undefined),
    ],
  },
  {
    label: "Database",
    skills: [
      s("Microsoft SQL Server", MicrosoftSQLServer2, MicrosoftSQLServer2, {
        featured: true,
      }),
      s("Redis", Redis, Redis, { featured: true }),
      s("MongoDB", MongoDB, MongoDB, { scale: 1.2, featured: true }),
      s("PostgreSQL", PostgreSQL, PostgreSQL),
      s("MySQL", MySQL, MySQL, { scale: 1.2 }),
    ],
  },
  {
    label: "Infra",
    skills: [
      s("Docker", Docker, Docker, { featured: true }),
      s("Bash", Bash, Bash, { featured: true }),
      s("Nginx", undefined, undefined),
      s("Podman", undefined, undefined),
    ],
  },
  {
    label: "Tools",
    skills: [
      s("Git", Git, Git, { featured: true }),
      s("GitHub", GitHubLight, GitHubDark),
      s("GitLab", GitLab, GitLab),
      s("Postman", Postman, Postman, { featured: true }),
      s("VS Code", VisualStudioCode, VisualStudioCode),
      s("Cursor", CursorLight, CursorDark, { featured: true }),
      s("Claude", Anthropic, ClaudeAI, { featured: true }),
    ],
  },
  {
    label: "Others",
    skills: [
      s("NumPy", NumPy, NumPy),
      s("Markdown", Markdown, Markdown, { scale: 1.6 }),
      s("JSON", JSON, JSON),
      s("XML", undefined, undefined),
      s("Figma", Figma, Figma),
      s("Photoshop", Photoshop, Photoshop),
      s("Tableau", undefined, undefined),
      s("Canva", Canva, Canva),
    ],
  },
];
