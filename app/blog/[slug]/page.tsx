import { getPostBySlug } from "@/lib/markdown";
import { existsSync } from "fs";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import path from "path";

const CONTENT_ROOT = path.join(process.cwd(), "content/blog");

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mdPath = path.join(CONTENT_ROOT, `${slug}.md`);
  const mdxPath = path.join(CONTENT_ROOT, `${slug}.mdx`);
  const fileExists = existsSync(mdPath) || existsSync(mdxPath);

  if (!fileExists) {
    // Let Next.js serve the static asset (image, pdf, etc.)
    notFound(); // ← this triggers 404, which Next.js will fall back to static file
  }

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { frontmatter, content, readingTime } = post;

  return (
    <div className="min-h-[calc(100vh-73px)] py-16 px-6 page-transition">
      <article className="max-w-3xl mx-auto">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors duration-200 mb-8 group opacity-0 animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to blog
        </Link>

        {/* Article header */}
        <header className="mb-12 opacity-0 animate-fade-in-up delay-50">
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-950 dark:text-zinc-50 mb-6 leading-tight">
            {frontmatter.title ?? "Untitled"}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            {frontmatter.date && (
              <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {frontmatter.description && (
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mt-6 leading-relaxed">
              {frontmatter.description}
            </p>
          )}

          {/* Featured image */}
          {frontmatter.image && (
            <div className="mt-8 rounded-xl overflow-hidden">
              <Image
                src={frontmatter.image}
                alt={frontmatter.title ?? "Blog post image"}
                width={1200}
                height={630}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          )}
        </header>

        {/* Divider */}
        <hr className="border-zinc-200 dark:border-zinc-800 mb-12 opacity-0 animate-fade-in-up delay-100" />

        {/* Article content */}
        {/* Render compiled MDX content */}
        <section className="prose max-w-none opacity-0 animate-fade-in-up delay-150 tracking-wide dark:prose-invert">
          {content}
        </section>

        {/* Divider */}
        <hr className="border-zinc-200 dark:border-zinc-800 mt-12 mb-8 opacity-0 animate-fade-in-up delay-200" />

        {/* Footer */}
        <footer className="flex items-center justify-between opacity-0 animate-fade-in-up delay-200">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            More articles
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href={`https://x.com/intent/tweet?text=${encodeURIComponent(
                frontmatter.title ?? "Check this out!"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors duration-200"
            >
              Share on X
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}

/* Generate static params for every .md file (build-time) */
// export async function generateStaticParams() {
//   const slugs = getAllBlogPaths();
//   return slugs.map((slug) => ({ slug }));
// }

export async function generateStaticParams() {
  // Pre-build only real markdown files
  const files = await import("fs").then((fs) =>
    fs.promises.readdir(CONTENT_ROOT)
  );
  return files
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => ({ slug: f.replace(/\.(md|mdx)$/, "") }));
}
