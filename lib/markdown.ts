// lib/markdown.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const CONTENT_ROOT = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string[]; // ["guides", "routing"] for nested paths
  frontmatter: Record<string, any>;
  html: string;
}

// lib/markdown.ts

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(CONTENT_ROOT, slug + ".md");

  if (!fs.existsSync(fullPath)) {
    console.warn("Post not found:", fullPath);
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data: frontmatter, content } = matter(fileContents);

  const processed = await remark().use(html).process(content);
  const htmlContent = processed.toString();

  return {
    slug: [slug], // or just slug: slug if you don't need array
    frontmatter,
    html: htmlContent,
  };
}

// lib/markdown.ts (only this function needs fixing)

// lib/markdown.ts

export function getAllBlogPaths(): string[] {
  const paths: string[] = [];

  function walk(dir: string, base: string[] = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const resolved = path.join(dir, entry.name);
      const relative = [...base, entry.name];

      if (entry.isDirectory()) {
        walk(resolved, relative);
      } else if (entry.name.endsWith(".md")) {
        const fileNameWithoutExt = entry.name.replace(/\.md$/, "");
        const slug = [...base, fileNameWithoutExt].join("/"); // "test" or "guides/routing"
        paths.push(slug);
      }
    }
  }

  walk(CONTENT_ROOT);
  return paths;
}
