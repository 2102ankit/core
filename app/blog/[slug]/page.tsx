// app/blog/[...slug]/page.tsx
import { getPostBySlug } from "@/lib/markdown";
import { notFound } from "next/navigation";
import styles from "./page.module.css"; // optional CSS module

type Params = { params: { slug: string } }; // ← string, not string[]

export default async function BlogPostPage({ params }: Promise<Params>) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { frontmatter, html } = post;

  return (
    <article className={styles.article}>
      <header>
        <h1>{frontmatter.title ?? "Untitled"}</h1>
        {frontmatter.date && (
          <time dateTime={frontmatter.date}>
            {new Date(frontmatter.date).toLocaleDateString()}
          </time>
        )}
      </header>

      {/* Render Markdown → HTML */}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}

/* -----------------------------------------------------------------
   Generate static params for every .md file (build-time)
----------------------------------------------------------------- */
import { getAllBlogPaths } from "@/lib/markdown";

export async function generateStaticParams() {
  const slugs = getAllBlogPaths(); // ["test", "hello-world"]
  return slugs.map((slug) => ({ slug }));
}
