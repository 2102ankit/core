"use client";

import Link from "next/link";
import {
  Github,
  Linkedin,
  Twitter,
  Code,
  LaptopMinimal,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const socialLinks = [
  { href: "https://x.com/2102ankit", icon: Twitter, label: "Twitter" },
  {
    href: "https://linkedin.com/in/2102ankit",
    icon: Linkedin,
    label: "LinkedIn",
  },
  { href: "https://github.com/2102ankit", icon: Github, label: "GitHub" },
  {
    href: "https://codeforces.com/profile/2102ankit",
    icon: Code,
    label: "Codeforces",
  },
  {
    href: "https://www.leetcode.com/2102ankit",
    icon: LaptopMinimal,
    label: "LeetCode",
  },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Ankit Mishra</h3>
            <p className="text-sm text-muted-foreground">
              Full-Stack Developer passionate about creating innovative
              solutions with modern technologies.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-border hover:border-foreground hover:bg-accent transition-all"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ankit Mishra. All rights reserved.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="gap-2"
          >
            Back to Top <ArrowUp size={16} />
          </Button>
        </div>
      </div>
    </footer>
  );
}
