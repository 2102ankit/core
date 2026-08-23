import { localIcon } from "@/components/svg-icon";
import {
  Bash,
  C,
  ClaudeAI,
  CPlusPlus,
  CursorDark,
  CursorLight,
  Docker,
  ExpressJsDark,
  ExpressJsLight,
  Git,
  GitHubDark,
  GitHubLight,
  GitLab,
  Go,
  Java,
  JavaScript,
  MicrosoftSQLServer2,
  MongoDB,
  NodeJs,
  NumPy,
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
  VisualStudioCode,
} from "developer-icons";
import type { ComponentType, ReactNode, SVGProps } from "react";

// Define your component type first
type SVGIconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number }
>;

// Combine them so it can be the component OR a rendered node
type IconComponent = SVGIconComponent | ReactNode;

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
      s(
        "Next.js",
        localIcon("/svgs/nextdotjs-wordmark-dark.svg"),
        localIcon("/svgs/nextdotjs-wordmark-light.svg"),
        {
          // lf: "brightness(1.2)",
          featured: true,
          scale: 2.8,
        },
      ),
      s("Tailwind CSS", TailwindCSS, TailwindCSS, {
        featured: true,
        scale: 1.2,
      }),
      s("shadcn/ui", ShadcnUI, ShadcnUI, {
        // df: "invert(1)",
        df: "bg-white rounded-full p-1 -m-1",
        scale: 1.2,
      }),
      s(
        "Motion",
        localIcon("/svgs/motion-dark.svg"),
        localIcon("/svgs/motion-light.svg"),
        {
          scale: 1.5,
        },
      ),
      s("Redux", Redux, Redux),
      s("React Query", ReactQuery, ReactQuery),
      s("React Router", ReactRouter, ReactRouter, {
        scale: 1.2,
        df: "bg-white rounded-full p-1 -m-1",
      }),
      s("Semantic UI", SemanticUI, SemanticUI),
      s("TanStack", TanStack, TanStack),
    ],
  },
  {
    label: "Backend",
    skills: [
      s("Node.js", NodeJs, NodeJs, { featured: true }),
      s("Express", ExpressJsLight, ExpressJsDark, {
        featured: true,
        scale: 1.2,
      }),
      // s("FastAPI", FastAPI, FastAPI, { featured: true }),
      s("Spring Boot", Spring, Spring, { featured: true }),
      // s(
      //   "Socket.io",
      //   localIcon("/svgs/socketdotio.svg"),
      //   localIcon("/svgs/socket-io."),
      //   {
      //     scale: 1.2,
      //   },
      // ),
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
      s(
        "SQLite",
        localIcon("/svgs/sqlite.svg"),
        localIcon("/svgs/sqlite.svg"),
        {
          df: "bg-white rounded-sm p-1 -m-1",
          scale: 2.5,
        },
      ),
      // s("PostgreSQL", PostgreSQL, PostgreSQL),
      // s("MySQL", MySQL, MySQL, { scale: 1.2 }),
    ],
  },
  {
    label: "Infra",
    skills: [
      s("Docker", Docker, Docker, { featured: true }),
      s("Bash", Bash, Bash, { featured: true }),
      // s("Nginx", undefined, undefined),
      s(
        "Podman",
        localIcon("/svgs/podman.svg"),
        localIcon("/svgs/podman.svg"),
        {
          df: "bg-white rounded-full p-1 -m-1",

          scale: 1.2,
        },
      ),
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
      s(
        "IntelliJ Idea",
        localIcon("/svgs/intellij-idea.svg"),
        localIcon("/svgs/intellij-idea.svg"),
        {
          scale: 1.2,
        },
      ),
      s(
        "PyCharm",
        localIcon("/svgs/pycharm.svg"),
        localIcon("/svgs/pycharm.svg"),
        {
          scale: 1.3,
        },
      ),
      s("Cursor", CursorLight, CursorDark, { featured: true }),
      s("Claude", ClaudeAI, ClaudeAI, { featured: true }),
      s(
        "MCP",
        localIcon("/svgs/model-context-protocol.svg"),
        localIcon("/svgs/model-context-protocol.svg"),
        {
          lf: "bg-black rounded-full p-1 -m-1",
        },
      ),
    ],
  },
  {
    label: "Others",
    skills: [
      s("NumPy", NumPy, NumPy),
      s("D3", localIcon("/svgs/d3.svg"), localIcon("/svgs/d3.svg")),
      s("JWT", localIcon("/svgs/jwt.svg"), localIcon("/svgs/jwt.svg"), {
        lf: "bg-black rounded-full p-1 -m-1",
      }),
      // s("Markdown", Markdown, Markdown, { scale: 1.6 }),
      // s("JSON", JSON, JSON),
      // s("XML", undefined, undefined),
      // s("Figma", Figma, Figma),
      // s("Photoshop", Photoshop, Photoshop),
      // s("Canva", undefined, undefined),
      s(
        "Tableau",
        localIcon("/svgs/tableau.svg"),
        localIcon("/svgs/tableau.svg"),
        {
          df: "bg-white rounded-full p-1 -m-1",
        },
      ),
    ],
  },
];
