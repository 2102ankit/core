import fs from "fs";
import path from "path";
import { Bookshelf } from "@/components/bookshelf";
import { Container } from "@/components/container";

interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  amazonUrl: string;
  thumbnail?: string;
  order_index: number;
}

async function loadBooks(): Promise<Book[]> {
  try {
    const filePath = path.join(process.cwd(), "data/all_books.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const books = JSON.parse(raw) as Book[];
    return books.sort((a, b) => a.order_index - b.order_index);
  } catch (err) {
    console.error("Error loading books:", err);
    return [];
  }
}

function parseMarkdownLinks(content: string) {
  const lines = content.split("\n");
  const links: Array<{ title: string; url: string }> = [];

  for (const line of lines) {
    const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (match) {
      links.push({ title: match[1], url: match[2] });
    }
  }

  return links;
}

export default async function ReadingPage() {
  const [books, whitepapersRaw, blogsRaw] = await Promise.all([
    loadBooks(),
    fs.promises
      .readFile(
        path.join(process.cwd(), "content/reading/whitepapers.md"),
        "utf8",
      )
      .catch(() => ""),
    fs.promises
      .readFile(path.join(process.cwd(), "content/reading/blogs.md"), "utf8")
      .catch(() => ""),
  ]);

  const whitepapers = parseMarkdownLinks(whitepapersRaw);
  const blogs = parseMarkdownLinks(blogsRaw);

  return (
    <Container size="narrow" className="py-16 md:py-20 page-transition">
        <div className="mb-12 opacity-0 animate-fade-in-up">
          <h1 className="text-display text-foreground mb-4">Reading</h1>
          <p className="text-body text-muted-foreground">
            Books, whitepapers and blogs that shape my thinking
          </p>
        </div>

        <Bookshelf books={books} />

        <section id="whitepapers" className="mb-12 scroll-mt-28">
          <h2 className="text-title-2 text-foreground mb-4">
            White Papers I have read
            {whitepapers.length > 0 && <>{` (${whitepapers.length})`}</>}
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-2 text-foreground">
            {whitepapers.map((paper, index) => (
              <li
                key={paper.url}
                id={`whitepaper-${index}`}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${200 + index * 50}ms` }}
              >
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline"
                >
                  {paper.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="blogs-i-follow" className="mb-12 scroll-mt-28">
          <h2 className="text-title-2 text-foreground mb-4">
            Blogs I Follow
            {blogs.length > 0 && <>{` (${blogs.length})`}</>}
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-2 text-foreground">
            {blogs.map((blog, index) => (
              <li
                key={blog.url}
                id={`reading-blog-${index}`}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${400 + index * 50}ms` }}
              >
                <a
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:underline"
                >
                  {blog.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div
          className="mb-12 text-center opacity-0 animate-fade-in-up"
          style={{ animationDelay: "600ms" }}
        >
          <p className="text-caption text-muted-foreground">
            I believe continuous learning is essential for growth. These
            resources have shaped my thinking and approach to software
            development. Looking for recommendations? I&apos;d love to hear what
            you&apos;re reading!
          </p>
        </div>
    </Container>
  );
}
