import { mdxComponents } from "@/components/mdx-components";
import fs from "fs";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";

const CONTENT_ROOT = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string[];
  frontmatter: Record<string, any>;
  content: React.ReactNode; // compiled MDX
  readingTime: number;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(CONTENT_ROOT, `${slug}.md`); // Use .md or .mdx

  if (!fs.existsSync(fullPath)) {
    console.warn("Post not found:", fullPath);
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data: frontmatter, content } = matter(fileContents);

  // Compile MDX (no frontmatter parsing here—handled by gray-matter)
  // ---------- compile ----------
  const { content: compiled } = await compileMDX({
    source: content,
    components: mdxComponents,
  });

  // Estimate reading time from raw content (more accurate)
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Attach reading time to frontmatter if needed
  frontmatter.readingTime = readingTime;

  return {
    slug: [slug],
    frontmatter,
    content: compiled,
    readingTime,
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
