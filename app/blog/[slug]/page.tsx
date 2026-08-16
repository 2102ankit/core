import { Outline } from "@/components/outline";
import { Container } from "@/components/container";
import { getPostBySlug } from "@/lib/markdown";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Calendar01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { existsSync } from "fs";
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

  const { frontmatter, content, readingTime, headings } = post;

  return (
    <Container size="narrow" className="py-16 md:py-20 page-transition">
      <Outline headings={headings} />
      <article>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-callout text-muted-foreground hover:text-foreground transition-fast mb-8 group opacity-0 animate-fade-in"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
          />
          Back to blog
        </Link>

        <header className="mb-12 opacity-0 animate-fade-in-up delay-50">
          <h1 className="text-display text-foreground mb-6">
            {frontmatter.title ?? "Untitled"}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-caption text-muted-foreground">
            {frontmatter.date && (
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4" />
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
              <HugeiconsIcon icon={Clock01Icon} className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {frontmatter.description && (
            <p className="text-body text-muted-foreground mt-6">
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

        <hr className="border-border mb-12 opacity-0 animate-fade-in-up delay-100" />

        <section className="prose max-w-none opacity-0 animate-fade-in-up delay-150">
          {content}
        </section>

        <hr className="border-border mt-12 mb-8 opacity-0 animate-fade-in-up delay-200" />

        <footer className="flex items-center justify-between opacity-0 animate-fade-in-up delay-200">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-callout text-muted-foreground hover:text-foreground transition-fast group"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
            />
            More articles
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href={`https://x.com/intent/tweet?text=${encodeURIComponent(
                frontmatter.title ?? "Check this out!"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-callout text-muted-foreground hover:text-foreground transition-fast"
            >
              Share on X
            </Link>
          </div>
        </footer>
      </article>
    </Container>
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
