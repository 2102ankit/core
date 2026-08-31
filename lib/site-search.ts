import allBooks from "@/data/content/reading/all_books.json";
import allProjects from "@/data/db/all_projects.json";
import fs from "fs";
import matter from "gray-matter";
import path from "path";

export type SiteSearchEntry = {
  id: string;
  title: string;
  subtitle: string;
  section: string;
  keywords?: string[];
  href: string;
  external?: boolean;
  kind: "page" | "blog" | "project" | "reading" | "about" | "link";
};

type SiteSearchConfig = {
  enabledStaticIds: string[];
  collections: {
    blogs: boolean;
    projects: boolean;
    books: boolean;
    whitepapers: boolean;
    readingBlogs: boolean;
  };
};

export const siteSearchConfig: SiteSearchConfig = {
  enabledStaticIds: [
    "page-home",
    "page-about",
    "page-work",
    "page-blog",
    "page-reading",
    "page-contact",
    "about-experience",
    "about-skills",
    "about-background",
    "about-timeline",
    "about-iss-stoxx",
    "about-alhansat",
    "about-education",
    "about-achievements",
    "link-github",
    "link-linkedin",
    "link-leetcode",
  ],
  collections: {
    blogs: true,
    projects: true,
    books: true,
    whitepapers: true,
    readingBlogs: true,
  },
};

export const commandBarConfig = {
  includeActions: {
    home: true,
    work: true,
    blog: true,
    contact: true,
    theme: true,
    copyEmail: true,
    scrollTop: true,
    github: true,
  },
  includeSearchKinds: {
    page: true,
    blog: true,
    project: true,
    reading: true,
    about: true,
    link: true,
  },
} as const;

const BLOG_ROOT = path.join(process.cwd(), "data/content/blog");
const READING_ROOT = path.join(process.cwd(), "data/content/reading");

function parseMarkdownLinks(content: string) {
  return content.split("\n").flatMap((line) => {
    const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    return match ? [{ title: match[1], url: match[2] }] : [];
  });
}

function getBlogEntries(): SiteSearchEntry[] {
  if (!fs.existsSync(BLOG_ROOT)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_ROOT)
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
    .flatMap((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, "");
      const filePath = path.join(BLOG_ROOT, fileName);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data: frontmatter } = matter(raw);

      if (frontmatter.show === false) {
        return [];
      }

      return [
        {
          id: `blog-${slug}`,
          title: String(frontmatter.title ?? slug),
          subtitle: String(frontmatter.description ?? "Blog post"),
          section: "Blog",
          keywords: [
            slug,
            ...(Array.isArray(frontmatter.tags)
              ? frontmatter.tags.map(String)
              : []),
          ],
          href: `/blog/${slug}`,
          kind: "blog" as const,
        },
      ];
    });
}

function getProjectEntries(): SiteSearchEntry[] {
  return (
    allProjects as Array<{
      id: string;
      title: string;
      description: string;
      tags?: string[];
      filter_tags?: string[];
      show?: boolean;
    }>
  )
    .filter((project) => project.show)
    .map((project) => ({
      id: `project-${project.id}`,
      title: project.title,
      subtitle: project.description,
      section: "Projects",
      keywords: [...(project.tags ?? []), ...(project.filter_tags ?? [])],
      href: `/work#project-${project.id}`,
      kind: "project" as const,
    }));
}

function getReadingEntries(): SiteSearchEntry[] {
  const whitepapers = parseMarkdownLinks(
    fs.readFileSync(path.join(READING_ROOT, "whitepapers.md"), "utf8"),
  );
  const blogs = parseMarkdownLinks(
    fs.readFileSync(path.join(READING_ROOT, "blogs.md"), "utf8"),
  );

  const bookEntries = (
    allBooks as Array<{
      id: string;
      title: string;
      author: string;
    }>
  )
    .map((book) => ({
      id: `book-${book.id}`,
      title: book.title,
      subtitle: `Book by ${book.author}`,
      section: "Reading",
      keywords: [book.author, "book"],
      href: `/reading#book-${book.id}`,
      kind: "reading" as const,
    }))
    .filter(() => siteSearchConfig.collections.books);

  const whitepaperEntries = whitepapers
    .map((paper, index) => ({
      id: `whitepaper-${index}`,
      title: paper.title,
      subtitle: "Whitepaper from reading list",
      section: "Reading",
      keywords: ["whitepaper", "paper", "reading"],
      href: `/reading#whitepaper-${index}`,
      kind: "reading" as const,
    }))
    .filter(() => siteSearchConfig.collections.whitepapers);

  const blogEntries = blogs
    .map((blog, index) => ({
      id: `reading-blog-${index}`,
      title: blog.title,
      subtitle: "Blog I follow",
      section: "Reading",
      keywords: ["blog", "reading", "follow"],
      href: `/reading#reading-blog-${index}`,
      kind: "reading" as const,
    }))
    .filter(() => siteSearchConfig.collections.readingBlogs);

  return [...bookEntries, ...whitepaperEntries, ...blogEntries];
}

export function getSiteSearchEntries(): SiteSearchEntry[] {
  const staticEntries: SiteSearchEntry[] = [
    {
      id: "page-home",
      title: "Home",
      subtitle: "Landing page and overview",
      section: "Pages",
      keywords: ["portfolio", "landing", "start"],
      href: "/",
      kind: "page",
    },
    {
      id: "page-about",
      title: "About Me",
      subtitle: "Background, experience, skills and achievements",
      section: "Pages",
      keywords: ["bio", "profile", "about"],
      href: "/about",
      kind: "page",
    },
    {
      id: "page-work",
      title: "Work",
      subtitle: "Projects and case studies",
      section: "Pages",
      keywords: ["projects", "portfolio", "case studies"],
      href: "/work",
      kind: "page",
    },
    {
      id: "page-blog",
      title: "Blog",
      subtitle: "Writing and notes",
      section: "Pages",
      keywords: ["articles", "posts", "writing"],
      href: "/blog",
      kind: "page",
    },
    {
      id: "page-reading",
      title: "Reading",
      subtitle: "Books, blogs and whitepapers",
      section: "Pages",
      keywords: ["books", "whitepapers", "reading list"],
      href: "/reading",
      kind: "page",
    },
    {
      id: "page-contact",
      title: "Contact",
      subtitle: "Reach out and connect",
      section: "Pages",
      keywords: ["email", "hire", "contact"],
      href: "/contact",
      kind: "page",
    },
    {
      id: "about-experience",
      title: "Experience",
      subtitle: "Work experience on the About page",
      section: "About",
      keywords: ["iss-stoxx", "career", "work history"],
      href: "/about#experience",
      kind: "about",
    },
    {
      id: "about-skills",
      title: "Skills & Technologies",
      subtitle: "Tech stack and tools",
      section: "About",
      keywords: ["react", "typescript", "python", "docker", "skills"],
      href: "/about#skills",
      kind: "about",
    },
    {
      id: "about-background",
      title: "Background",
      subtitle: "Personal summary and profile",
      section: "About",
      keywords: ["bio", "background", "about me"],
      href: "/about#background",
      kind: "about",
    },
    {
      id: "about-timeline",
      title: "Education & Achievements",
      subtitle: "Timeline, education and achievements",
      section: "About",
      keywords: ["education", "achievements", "timeline", "hackathon"],
      href: "/about#timeline",
      kind: "about",
    },
    {
      id: "about-iss-stoxx",
      title: "ISS-Stoxx",
      subtitle: "Software Engineer experience entry",
      section: "About",
      keywords: ["experience", "software engineer", "iss-stoxx"],
      href: "/about#iss-stoxx",
      kind: "about",
    },
    {
      id: "about-alhansat",
      title: "Alhansat Solutions",
      subtitle: "Web Development Intern experience entry",
      section: "About",
      keywords: ["experience", "internship", "alhansat"],
      href: "/about#alhansat-solutions",
      kind: "about",
    },
    {
      id: "about-education",
      title: "Education",
      subtitle: "Education timeline entry",
      section: "About",
      keywords: ["education", "spit", "management minor"],
      href: "/about#education",
      kind: "about",
    },
    {
      id: "about-achievements",
      title: "Achievements",
      subtitle: "Hackathons and achievements timeline entry",
      section: "About",
      keywords: ["hackathon", "achievements", "smart india hackathon"],
      href: "/about#achievements",
      kind: "about",
    },
    {
      id: "link-linkedin",
      title: "LinkedIn",
      subtitle: "Open LinkedIn profile",
      section: "Links",
      keywords: ["linkedin", "professional", "network"],
      href: "https://www.linkedin.com/in/2102ankit/",
      external: true,
      kind: "link",
    },
    {
      id: "link-leetcode",
      title: "LeetCode",
      subtitle: "Open LeetCode profile",
      section: "Links",
      keywords: ["leetcode", "dsa", "algorithms", "coding"],
      href: "https://leetcode.com/u/2102ankit/",
      external: true,
      kind: "link",
    },
  ];

  const enabledStaticIds = new Set(siteSearchConfig.enabledStaticIds);

  return [
    ...staticEntries.filter((entry) => enabledStaticIds.has(entry.id)),
    ...(siteSearchConfig.collections.blogs ? getBlogEntries() : []),
    ...(siteSearchConfig.collections.projects ? getProjectEntries() : []),
    ...getReadingEntries(),
  ];
}
