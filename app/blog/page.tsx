import Link from "next/link";
import { getAllBlogPaths } from "@/lib/markdown";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { ArrowUpRight, Calendar } from "lucide-react";

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
    <div className="min-h-[calc(100vh-73px)] py-16 px-6 page-transition">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 opacity-0 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-950 dark:text-zinc-50 mb-4">
            Blog
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Thoughts, stories, and ideas about technology, design, and life.
          </p>
        </div>

        <div className="space-y-4">
          {posts.map(({ slug, frontmatter }, index) => (
            <Link
              key={slug}
              href={`/blog/${slug}`}
              className="group block opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <article className="flex items-center gap-3 p-3 rounded-lg transition-colors group">
                {frontmatter.date && (
                  <time className="text-sm text-zinc-500 dark:text-zinc-500 whitespace-nowrap">
                    {new Date(frontmatter.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                )}
                <div
                  // href={`/blog/${slug}`}
                  className="flex-1 text-zinc-950 dark:text-zinc-50 group-hover:underline hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
                >
                  {frontmatter.title ?? slug.split("/").at(-1)}
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400" />
              </article>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16 opacity-0 animate-fade-in-up">
            <p className="text-zinc-500 dark:text-zinc-400">
              No blog posts yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
