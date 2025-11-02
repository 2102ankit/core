// app/blog/page.tsx
import Link from "next/link";
import { getAllBlogPaths } from "@/lib/markdown";
import matter from "gray-matter";
import fs from "fs";
import path from "path";

const CONTENT_ROOT = path.join(process.cwd(), "content/blog");

export default async function BlogIndex() {
  const paths = getAllBlogPaths();

  const posts = await Promise.all(
    paths.map(async (slug) => {
      const fullPath = path.join(CONTENT_ROOT, slug) + ".md";
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(raw);
      return { slug, frontmatter: data };
    })
  );

  // Sort by date (newest first)
  posts.sort((a, b) => {
    const dA = a.frontmatter.date ?? "1970-01-01";
    const dB = b.frontmatter.date ?? "1970-01-01";
    return new Date(dB).getTime() - new Date(dA).getTime();
  });

  return (
    <section>
      <h1>Blog</h1>
      <ul>
        {posts.map(({ slug, frontmatter }) => (
          <li key={slug}>
            <Link href={`/blog/${slug}`}>
              {frontmatter.title ?? slug.at(-1)}
            </Link>{" "}
            {frontmatter.date && (
              <small>({new Date(frontmatter.date).toLocaleDateString()})</small>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
