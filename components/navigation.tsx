"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";

export function Navigation() {
  const pathname = usePathname();

  useEffect(() => {
    // Only scroll to top if no hash (i.e., not an anchor link)
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-700
      `}
    >
      <nav className="max-w-3xl mx-auto py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="hidden sm:flex items-center gap-6">
              <Link key={"/"} href={"/"}>
                <Image
                  src="https://avatars.githubusercontent.com/u/105378102?v=4"
                  alt="Ankit Mishra"
                  className={
                    "rounded-full outline-1 dark:outline-zinc-300 outline-zinc-500"
                  }
                  priority
                  width={40}
                  height={40}
                />
              </Link>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors duration-200 ${
                    pathname === link.href
                      ? "text-zinc-950 dark:text-zinc-50 font-medium"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
