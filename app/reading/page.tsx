import fs from "fs";
import path from "path";
import { Card } from "@/components/ui/card";
import ProjectThumbnail from "@/components/project-thumbnail";

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
    <div className="min-h-[calc(100vh-73px)] py-16 px-6 page-transition">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 opacity-0 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-950 dark:text-zinc-50 mb-4">
            Reading
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Books, whitepapers and blogs that shape my thinking
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-zinc-950 dark:text-zinc-50">
            Bookshelf
            {books && <>{` (${books.length})`}</>}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {books.map((book, index) => (
              <a
                key={book.id}
                href={book.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block opacity-0 animate-fade-in-up h-50"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="h-full hover:border-zinc-300 dark:hover:border-zinc-600 transition-all pt-0 overflow-hidden p-0 gap-0 rounded-sm">
                  <div className="relative aspect-5/6 bg-zinc-100 dark:bg-zinc-800">
                    <ProjectThumbnail
                      src={book.thumbnail}
                      alt={book.title}
                      variant="cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-zinc-950 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors min-h-6">
                      {book.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {book.author}
                    </p>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-zinc-950 dark:text-zinc-50">
            White Papers
            {whitepapers && <>{` (${whitepapers.length})`}</>}
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-2 text-zinc-950 dark:text-zinc-50">
            {whitepapers.map((paper, index) => (
              <li
                key={paper.url}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${200 + index * 50}ms` }}
              >
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-950 dark:text-zinc-50 hover:underline"
                >
                  {paper.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-zinc-950 dark:text-zinc-50">
            Blogs I Follow
            {blogs && <>{` (${blogs.length})`}</>}
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-2 text-zinc-950 dark:text-zinc-50">
            {blogs.map((blog, index) => (
              <li
                key={blog.url}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${400 + index * 50}ms` }}
              >
                <a
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-950 dark:text-zinc-50 hover:underline"
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
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            I believe continuous learning is essential for growth. These
            resources have shaped my thinking and approach to software
            development. Looking for recommendations? I&apos;d love to hear what
            you&apos;re reading!
          </p>
        </div>
      </div>
    </div>
  );
}
