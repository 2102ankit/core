import { getAllBlogPaths } from "@/lib/markdown";
import fs from "fs";
import matter from "gray-matter";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import path from "path";
import { Button } from "@/components/ui/button";

const CONTENT_ROOT = path.join(process.cwd(), "content/blog");

export default async function BlogIndex() {
  const paths = getAllBlogPaths();

  const allPosts = await Promise.all(
    paths.map(async (slug) => {
      // Try .md first, then .mdx
      const possiblePaths = [
        path.join(CONTENT_ROOT, `${slug}.md`),
        path.join(CONTENT_ROOT, `${slug}.mdx`),
      ];

      let raw: string | null = null;
      let usedPath: string | null = null;

      for (const filePath of possiblePaths) {
        try {
          if (fs.existsSync(filePath)) {
            raw = fs.readFileSync(filePath, "utf8");
            usedPath = filePath;
            break; // Stop at the first existing file
          }
        } catch (error) {
          // Silently continue if file doesn't exist or can't be read
          continue;
        }
      }

      // If no file was found or readable
      if (!raw) {
        console.warn(`Blog post not found for slug: ${slug}`);
        return null; // or return a default/placeholder object
      }

      try {
        const { data: frontmatter } = matter(raw);

        return {
          slug,
          frontmatter: {
            // Provide defaults in case frontmatter is missing fields
            title: frontmatter.title ?? "Untitled",
            date: frontmatter.date ?? null,
            description: frontmatter.description ?? null,
            image: frontmatter.image ?? null,
            ...frontmatter,
          },
        };
      } catch (error) {
        console.error(
          `Failed to parse frontmatter for slug: ${slug} (${usedPath})`,
          error,
        );
        // return {
        //   slug,
        //   frontmatter: { title: "Untitled" }, // Fallback
        // };
      }
    }),
  );

  const posts = allPosts.filter(
    (post): post is NonNullable<typeof post> => post !== null,
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
            Thoughts, stories and ideas about technology, design and life.
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
                  <time className="text-sm text-zinc-500 dark:text-zinc-500 whitespace-nowrap w-20">
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

      <div className="mt-12 pt-8 border-t border-border opacity-0 animate-fade-in-up" style={{ animationDelay: `${posts.length * 100 + 300}ms` }}>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-6 text-center">
          Explore my reading list and book recommendations
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/reading">
              Reading List <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
