// lib/markdown.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const CONTENT_ROOT = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string[];
  frontmatter: Record<string, any>;
  html: string;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(CONTENT_ROOT, slug + ".md");

  if (!fs.existsSync(fullPath)) {
    console.warn("Post not found:", fullPath);
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data: frontmatter, content } = matter(fileContents);

  // Process markdown to HTML
  const processed = await remark().use(html).process(content);
  let htmlContent = processed.toString();

  // Convert markdown image syntax to Next.js Image-friendly format
  // This handles ![alt](path) syntax in markdown
  htmlContent = htmlContent.replace(
    /<img\s+src="([^"]+)"\s+alt="([^"]*)"\s*\/?>/g,
    (match, src, alt) => {
      // If image path is relative, prefix with /images/blog/
      const imagePath = src.startsWith('http') ? src : `/images/blog/${src}`;
      return `<img src="${imagePath}" alt="${alt}" loading="lazy" class="loaded" />`;
    }
  );

  return {
    slug: [slug],
    frontmatter,
    html: htmlContent,
  };
}

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
        const slug = [...base, fileNameWithoutExt].join("/");
        paths.push(slug);
      }
    }
  }

  walk(CONTENT_ROOT);
  return paths;
}