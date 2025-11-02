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
              <article className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors duration-200">
                      {frontmatter.title ?? slug.split("/").at(-1)}
                    </h2>
                    {frontmatter.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {frontmatter.description}
                      </p>
                    )}
                    {frontmatter.date && (
                      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={frontmatter.date}>
                          {new Date(frontmatter.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      </div>
                    )}
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0" />
                </div>
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