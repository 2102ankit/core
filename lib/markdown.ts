import { mdxComponents } from "@/components/mdx-components";
import fs from "fs";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import path from "path";
import * as DemoComponents from "@/components/demos/demo-exports";

const CONTENT_ROOT = path.join(process.cwd(), "content/blog");

const rehypePrettyCodeOptions = {
  theme: "aurora-x",
  // theme: "nord",
};

export interface BlogPost {
  slug: string[];
  frontmatter: Record<string, any>;
  content: React.ReactNode; // compiled MDX
  readingTime: number;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  // Try both .md and .mdx extensions
  const possiblePaths = [
    path.join(CONTENT_ROOT, `${slug}.md`),
    path.join(CONTENT_ROOT, `${slug}.mdx`),
  ];

  let filePath: string | null = null;
  let fileContents: string = "";

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      filePath = p;
      try {
        fileContents = fs.readFileSync(p, "utf8");
        break;
      } catch (err) {
        console.error(`Error reading file ${p}:`, err);
        // Continue to next extension
      }
    }
  }

  if (!filePath || !fileContents) {
    console.warn(`Blog post not found for slug: ${slug}`);
    return null;
  }

  try {
    const { data: frontmatter, content: rawContent } = matter(fileContents);

    // Compile the MDX/Markdown content
    const { content: compiled } = await compileMDX({
      source: rawContent,
      components: {
        ...mdxComponents,
        ...DemoComponents,
      },
      options: {
        parseFrontmatter: false, // We already parsed it with gray-matter
        mdxOptions: {
          rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
        },
      },
    });

    // Calculate reading time based on raw content (words per minute ≈ 200)
    const wordCount = rawContent.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      slug: [slug],
      frontmatter: {
        ...frontmatter,
        readingTime,
      },
      content: compiled,
      readingTime,
    };
  } catch (err) {
    console.error(`Failed to compile MDX for slug: ${slug} (${filePath})`, err);
    return null;
  }
}

export function getAllBlogPaths(): string[] {
  const paths: string[] = [];

  function walk(dir: string, base: string[] = []) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const resolved = path.join(dir, entry.name);
      const relative = [...base, entry.name];

      if (entry.isDirectory()) {
        walk(resolved, relative);
      } else if (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) {
        const fileNameWithoutExt = entry.name.replace(/\.(md|mdx)$/, "");
        const slugSegments = [...base, fileNameWithoutExt];
        const slug = slugSegments.join("/");
        paths.push(slug);
      }
    }
  }

  walk(CONTENT_ROOT);
  return paths;
}
