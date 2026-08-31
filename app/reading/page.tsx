import fs from "fs";
import path from "path";
import { Bookshelf } from "@/components/bookshelf";
import { Container } from "@/components/layout/container";
import { ReadingBrowser, type ReadingItem } from "@/components/reading-browser";

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
    const filePath = path.join(process.cwd(), "data/content/reading/all_books.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const books = JSON.parse(raw) as Book[];
    return books.sort((a, b) => a.order_index - b.order_index);
  } catch (err) {
    console.error("Error loading books:", err);
    return [];
  }
}

function parseMarkdownLinks(content: string): ReadingItem[] {
  const lines = content.split("\n");
  const links: ReadingItem[] = [];

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
        path.join(process.cwd(), "data/content/reading/whitepapers.md"),
        "utf8",
      )
      .catch(() => ""),
    fs.promises
      .readFile(
        path.join(process.cwd(), "data/content/reading/blogs.md"),
        "utf8",
      )
      .catch(() => ""),
  ]);

  const whitepapers = parseMarkdownLinks(whitepapersRaw);
  const blogs = parseMarkdownLinks(blogsRaw);

  return (
    <Container size="wide" className="py-16 md:py-20 page-transition">
      <div className="opacity-0 animate-fade-in-up delay-100">
        <ReadingBrowser whitepapers={whitepapers} blogs={blogs} />
      </div>

      <div className="mt-14 opacity-0 animate-fade-in-up delay-200">
        <Bookshelf books={books} />
      </div>

      <div
        className="mt-12 mb-4 text-center opacity-0 animate-fade-in-up"
        style={{ animationDelay: "300ms" }}
      >
        <p className="text-caption text-muted-foreground max-w-xl mx-auto">
          Continuous learning is essential for growth. These resources have
          shaped how I approach software. Looking for recommendations? I&apos;d
          love to hear what you&apos;re reading!
        </p>
      </div>
    </Container>
  );
}
