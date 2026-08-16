import {
  TypeScript,
  JavaScript,
  Python,
  Java,
  Go,
  C,
  CPlusPlus,
  React,
  NextJs,
  TailwindCSS,
  ShadcnUI,
  FramerDark,
  FramerLight,
  Redux,
  NodeJs,
  BunJs,
  ExpressJsDark,
  ExpressJsLight,
  Spring,
  TRPC,
  GraphQL,
  Prisma,
  PostgreSQL,
  MongoDB,
  Redis,
  MySQL,
  AWS,
  VercelDark,
  VercelLight,
  Cloudflare,
  Linux,
  Docker,
  Kubernetes,
  Terraform,
  Git,
  GitHubDark,
  GitHubLight,
  VisualStudioCode,
  Postman,
  NPM,
  Figma,
  Photoshop,
  Bash,
  Canva,
  ClaudeAI,
  CursorDark,
  CursorLight,
  FastAPI,
  GitLab,
  Jira,
  MicrosoftSQLServer,
  MicrosoftSQLServer2,
  NumPy,
  PowerShell,
  ReactQuery,
  ReactRouter,
  SemanticUI,
  TanStack,
  Markdown,
  JSON,
  Anthropic,
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
      s("Bash", Bash, Bash),
      s("Markdown", Markdown, Markdown, { scale: 1.6 }),
      s("JSON", JSON, JSON),
      s("XML", undefined, undefined),
      s("PowerShell", PowerShell, PowerShell),
      s("NumPy", NumPy, NumPy),
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
      s("Canva", Canva, Canva),
      s("Cursor", CursorLight, CursorDark),
    ],
  },
  {
    label: "Backend",
    skills: [
      s("Node.js", NodeJs, NodeJs, { featured: true }),
      s("Bun", BunJs, BunJs, { scale: 1.2 }),
      s("Express", ExpressJsLight, ExpressJsDark, { featured: true }),
      s("FastAPI", FastAPI, FastAPI),
      s("Spring Boot", Spring, Spring),
      s("tRPC", TRPC, TRPC),
      s("GraphQL", GraphQL, GraphQL, { featured: true }),
      s("Prisma", Prisma, Prisma, {
        df: "brightness(1.8)",
        lf: "brightness(1.2)",
      }),
      s("Socket.io", undefined, undefined),
    ],
  },
  {
    label: "Database",
    skills: [
      s("PostgreSQL", PostgreSQL, PostgreSQL, { featured: true }),
      s("MySQL", MySQL, MySQL, { scale: 1.2 }),
      s("MongoDB", MongoDB, MongoDB, { scale: 1.2 }),
      s("Redis", Redis, Redis),
      s("Microsoft SQL Server", MicrosoftSQLServer2, MicrosoftSQLServer2),
    ],
  },
  {
    label: "Infra & Tools",
    skills: [
      s("AWS", AWS, AWS, {
        lf: "brightness(1.6) contrast(1.05)",
        df: "brightness(1.2)",
        featured: true,
      }),
      s("Docker", Docker, Docker, { featured: true }),
      s("Kubernetes", Kubernetes, Kubernetes),
      s("Terraform", Terraform, Terraform),
      s("Nginx", undefined, undefined),
      s("Podman", undefined, undefined),
      s("Git", Git, Git, { featured: true }),
      s("GitHub", GitHubLight, GitHubDark),
      s("GitLab", GitLab, GitLab),
      s("Postman", Postman, Postman),
      s("npm", NPM, NPM),
      s("VS Code", VisualStudioCode, VisualStudioCode),
      s("Jira", Jira, Jira),
    ],
  },
  {
    label: "Others",
    skills: [
      s("Figma", Figma, Figma),
      s("Photoshop", Photoshop, Photoshop),
      s("Tableau", undefined, undefined),
      s("TanStack", TanStack, TanStack),
      s("Claude", Anthropic, ClaudeAI),
    ],
  },
];
