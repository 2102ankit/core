"use client";

import { ArrowRight, ArrowUpRight, FileDown, Github } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const sentences = [
    {
      text: (
        <>
          I build{" "}
          <span className={`text-blue-400 dark:text-blue-400 font-semibold`}>
            fast, beautiful and functional
          </span>{" "}
          apps. This is my digital workshop - where{" "}
          <span
            className={`text-yellow-400 dark:text-yellow-400 font-semibold`}
          >
            ideas turn into code
          </span>
          , prototypes come alive and learning never stops.
        </>
      ),
    },
    {
      text: (
        <>
          From prototypes to production - I{" "}
          <span
            className={`text-purple-400 dark:text-purple-400 font-semibold`}
          >
            design
          </span>
          ,
          <span className={`text-pink-400 dark:text-pink-400 font-semibold`}>
            {" "}
            develop
          </span>
          , and
          <span className={`text-green-400 dark:text-green-400 font-semibold`}>
            {" "}
            deploy
          </span>
          . This is where I document the journey.
        </>
      ),
    },
    {
      text: (
        <>
          I build{" "}
          <span
            className={`text-purple-400 dark:text-purple-400 font-semibold`}
          >
            performant
          </span>
          ,
          <span className={`text-green-400 dark:text-green-400 font-semibold`}>
            {" "}
            scalable
          </span>{" "}
          web apps with modern tools. Explore my projects and writing.
        </>
      ),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 pt-4">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-8 animate-fade-in-up">
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight ">
              Hey, I&apos;m Ankit
            </h1>

            <p className="my-16 text-md sm:text-xl text-zinc-600 dark:text-zinc-400 leading-tight max-w-3xl text-justify transition-opacity duration-500">
              {sentences[0]?.text}
            </p>
          </div>
          <div className="space-y-4">
            <blockquote
              className="relative pl-6 border-l-4 border-blue-500 dark:border-blue-400 
                           bg-linear-to-r from-zinc-50 to-zinc-100 
                           dark:from-zinc-800/60 dark:to-zinc-800/50 
                           rounded-r-lg py-4 pr-6 
                           text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 
                           leading-relaxed max-w-3xl 
                           transition-all duration-500 hover:shadow-md"
            >
              <p className="relative z-10">
                {"Currently building "}
                <Link
                  href="https://github.com/2102ankit/nimbus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 
                   underline underline-offset-4 decoration-blue-400/30 dark:decoration-blue-500/30 
                   hover:decoration-blue-400 dark:hover:decoration-blue-400 
                   hover:text-blue-700 dark:hover:text-blue-300 
                   transition-all duration-300 group"
                >
                  Datagrid
                  <ArrowUpRight
                    size={18}
                    className="opacity-70 group-hover:opacity-100 
                     group-hover:translate-x-0.5 group-hover:-translate-y-0.5 
                     transition-all duration-300"
                  />
                </Link>
                {" in React, Motion & Tanstack Table"}
              </p>
            </blockquote>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up delay-100">
            <Link
              href="/downloads/resume.pdf"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              View Resume
              <FileDown />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Read the blog
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="https://github.com/2102ankit"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Github />
              GitHub
              <ArrowUpRight size={20} />
            </Link>
          </div>

          {/* ---- Stats ---- */}
          <div className="pt-8 animate-fade-in-up delay-150">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div className="group">
                <div className="text-3xl font-bold text-zinc-950 dark:text-zinc-50 group-hover:scale-105 transition-transform duration-300">
                  1+
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Years Experience
                </div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-zinc-950 dark:text-zinc-50 group-hover:scale-105 transition-transform duration-300">
                  30+
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Projects & Prototypes Built
                </div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-zinc-950 dark:text-zinc-50 group-hover:scale-105 transition-transform duration-300">
                  50k+
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
