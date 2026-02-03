"use client";

import { Card } from "@/components/ui/card";
import ProjectThumbnail from "@/components/project-thumbnail";
import { useState } from "react";

interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  amazonUrl: string;
  thumbnail?: string;
  order_index: number;
}

interface BookshelfProps {
  books: Book[];
}

export function Bookshelf({ books }: BookshelfProps) {
  const [expanded, setExpanded] = useState(false);
  const booksPerRow = 3;

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-zinc-950 dark:text-zinc-50">
        Bookshelf {books.length > 0 && `(${books.length})`}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {books.map((book, index) => (
          <a
            key={book.id}
            href={book.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`group block opacity-0 animate-fade-in-up ${
              index >= booksPerRow && !expanded ? "hidden" : ""
            }`}
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
              <div className="h-full p-3 py-4 flex flex-col justify-between">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-zinc-950 dark:text-zinc-50 min-h-6 leading-tight my-auto">
                  {book.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {book.author}
                </p>
              </div>
            </Card>
          </a>
        ))}
      </div>
      {books.length > booksPerRow && (
        <button
          onClick={handleToggle}
          className="mt-6 flex items-center gap-2 mx-auto text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
        >
          {expanded ? (
            <>
              See Less <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            </>
          ) : (
            <>
              See More... <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </>
          )}
        </button>
      )}
    </section>
  );
}
