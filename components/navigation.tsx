"use client";

import CommandBar from "@/components/command-bar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Menu01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import Clock24 from "@/components/Clock24";

// Clock24 is now a separate component in Clock24.tsx

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);

  useEffect(() => {
    // Only scroll to top if no hash (i.e., not an anchor link)
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/work", label: "Work" },
    { href: "/labs", label: "Labs" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className={`
          sticky top-0 z-50 transition-all duration-300 
          bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md 
          border-b border-zinc-200 dark:border-zinc-700
        `}
      >
        <nav className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Desktop Links */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center">
                <Image
                  src="https://avatars.githubusercontent.com/u/105378102?v=4"
                  alt="Ankit Mishra"
                  className="rounded-full outline-1 outline-zinc-500 dark:outline-zinc-300"
                  priority
                  width={40}
                  height={40}
                />
              </Link>

                {/* Desktop Links */}
                <div className="hidden sm:flex items-center gap-6">
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

              {/* Mobile Menu Button + Theme Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCommandBarOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600 transition-none hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600"
                  aria-label="Open command bar"
                >
                  <HugeiconsIcon icon={Search01Icon} size={14} />
                  <span className="hidden sm:inline">Search</span>
                  <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
                    K
                  </kbd>
                </button>
                <ThemeToggle />
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="sm:hidden p-2 text-zinc-700 dark:text-zinc-300"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <HugeiconsIcon icon={Cancel01Icon} size={24} />
                  ) : (
                    <HugeiconsIcon icon={Menu01Icon} size={24} />
                  )}
                </button>
              </div>
            </div>
            <span
              className="hidden md:inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 absolute right-4 top-6"
              aria-label="Current time"
            >
              <Clock24 />
            </span>
          </nav>
        {/* </div> */}
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 right-0 z-60 w-full max-w-xs bg-white dark:bg-zinc-900 shadow-2xl sm:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-700">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Ankit Mishra
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-zinc-600 dark:text-zinc-400"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={20} />
                </button>
              </div>

              {/* Mobile Links */}
              <nav className="flex-1 space-y-2 p-6">
                {links.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-3 text-lg font-medium transition-colors ${
                        pathname === link.href
                          ? "text-zinc-950 dark:text-zinc-50"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <CommandBar open={isCommandBarOpen} onOpenChange={setIsCommandBarOpen} />
    </>
  );
}
