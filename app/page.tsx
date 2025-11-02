import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
              Hello, World!
            </h1>
            <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              I'm a developer who loves building things. Welcome to my corner of
              the internet where I share my thoughts, projects, and learnings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up delay-100">
            <Link
              href="/blog"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Read the blog
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="https://github.com/2102ankit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              GitHub
            </a>
          </div>

          <div className="pt-8 animate-fade-in-up delay-150">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div className="group">
                <div className="text-3xl font-bold text-zinc-950 dark:text-zinc-50 group-hover:scale-110 transition-transform duration-300">
                  5+
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Years Experience
                </div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-zinc-950 dark:text-zinc-50 group-hover:scale-110 transition-transform duration-300">
                  50+
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Projects Built
                </div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-zinc-950 dark:text-zinc-50 group-hover:scale-110 transition-transform duration-300">
                  10k+
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Lines of Code
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
