"use client";

import CommandBar from "@/components/command-bar";
import { Container } from "@/components/layout/container";
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
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import Clock24 from "@/components/Clock24";
import {
  subscribeOutlineHeadings,
  type OutlineHeading,
} from "@/lib/outline-store";
import { Outline, OutlineInline } from "@/components/outline";

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [outlineHeadings, setLocalHeadings] = useState<OutlineHeading[] | null>(
    null,
  );

  useEffect(() => {
    return subscribeOutlineHeadings(setLocalHeadings);
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/work", label: "Work" },
    { href: "/components", label: "Components" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 relative">
        {/* Progressive blur that extends BELOW the header for a buttery soft edge */}
        <div
          className="absolute left-0 right-0 top-0 pointer-events-none"
          style={{ height: "130%" }}
        >
          {/* Layer 1 – strongest (more aggressive) */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(36px)",
              WebkitBackdropFilter: "blur(36px)",
              maskImage:
                "linear-gradient(to bottom, black 0%, black 12%, transparent 42%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 12%, transparent 42%)",
            }}
          />
          {/* Layer 2 */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(26px)",
              WebkitBackdropFilter: "blur(26px)",
              maskImage:
                "linear-gradient(to bottom, transparent 3%, black 15%, transparent 52%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 3%, black 15%, transparent 52%)",
            }}
          />
          {/* Layer 3 */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              maskImage:
                "linear-gradient(to bottom, transparent 10%, black 25%, transparent 62%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 10%, black 25%, transparent 62%)",
            }}
          />
          {/* Layer 4 */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              maskImage:
                "linear-gradient(to bottom, transparent 20%, black 36%, transparent 72%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 20%, black 36%, transparent 72%)",
            }}
          />
          {/* Layer 5 */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              maskImage:
                "linear-gradient(to bottom, transparent 30%, black 46%, transparent 80%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 30%, black 46%, transparent 80%)",
            }}
          />
          {/* Layer 6 */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              maskImage:
                "linear-gradient(to bottom, transparent 40%, black 56%, transparent 87%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 40%, black 56%, transparent 87%)",
            }}
          />
          {/* Layer 7 */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(2.8px)",
              WebkitBackdropFilter: "blur(2.8px)",
              maskImage:
                "linear-gradient(to bottom, transparent 50%, black 66%, transparent 93%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 50%, black 66%, transparent 93%)",
            }}
          />
          {/* Layer 8 – very soft, extends furthest */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(1.2px)",
              WebkitBackdropFilter: "blur(1.2px)",
              maskImage:
                "linear-gradient(to bottom, transparent 65%, black 80%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 65%, black 80%, transparent 100%)",
            }}
          />

          {/* Soft tint that also fades out */}
          <div
            className="absolute inset-0 bg-background/60"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, black 38%, transparent 88%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 38%, transparent 88%)",
            }}
          />
        </div>

        <Container size="wide" className="relative py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-5 md:gap-7 min-w-0">
              <Link href="/" className="flex shrink-0 items-center">
                <Image
                  src="https://avatars.githubusercontent.com/u/105378102?v=4"
                  alt="Ankit Mishra"
                  className="rounded-full ring-1 ring-border"
                  priority
                  width={36}
                  height={36}
                />
              </Link>

              <div className="hidden sm:flex items-center gap-5">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-callout transition-fast ${
                      pathname === link.href
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className="hidden lg:inline-flex items-center text-footnote text-muted-foreground tabular-nums mr-2"
                aria-label="Current time"
              >
                <Clock24 />
              </span>
              <button
                onClick={() => setIsCommandBarOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-footnote text-muted-foreground transition-none hover:border-border hover:bg-muted/60"
                aria-label="Open command bar"
              >
                <HugeiconsIcon icon={Search01Icon} size={14} />
                <span className="hidden sm:inline">Search</span>
                <kbd className="rounded-full border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  K
                </kbd>
              </button>
              <ThemeToggle size="sm" />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 text-muted-foreground hover:text-foreground transition-fast"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <HugeiconsIcon icon={Cancel01Icon} size={22} />
                ) : (
                  <HugeiconsIcon icon={Menu01Icon} size={22} />
                )}
              </button>
            </div>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-y-0 right-0 z-60 w-full max-w-xs bg-background border-l border-border shadow-elevation-3 sm:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <Link
                  href="/"
                  className="text-headline text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Ankit Mishra
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-fast"
                  aria-label="Close menu"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={18} />
                </button>
              </div>

              <nav className="flex-1 space-y-1 p-3 overflow-y-auto scrollbar-slim">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-callout transition-fast ${
                      pathname === link.href
                        ? "text-foreground bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {pathname.startsWith("/blog/") && outlineHeadings?.length ? (
                  <div className="pt-3 mt-3 border-t border-border">
                    <OutlineInline
                      headings={outlineHeadings}
                      onClose={() => setIsMobileMenuOpen(false)}
                    />
                  </div>
                ) : null}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <CommandBar open={isCommandBarOpen} onOpenChange={setIsCommandBarOpen} />
    </>
  );
}
