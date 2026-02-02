"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  Code,
  Github,
  LaptopMinimal,
  Linkedin,
  Twitter,
} from "lucide-react";
import Link from "next/link";

const socialLinks = [
  { href: "https://x.com/2102ankit", icon: Twitter, label: "Twitter" },
  {
    href: "https://linkedin.com/in/2102ankit",
    icon: Linkedin,
    label: "LinkedIn",
  },
  { href: "https://github.com/2102ankit", icon: Github, label: "GitHub" },
  {
    href: "https://www.leetcode.com/2102ankit",
    icon: Code,
    label: "Codeforces",
  },
];

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/labs", label: "Labs" },
  { href: "/reading", label: "Reading" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-4">Ankit Mishra</h3>
            <p className="text-sm text-muted-foreground max-w-80">
              Full-Stack Developer passionate about creating innovative
              solutions with modern technologies.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-border hover:border-foreground hover:bg-accent transition-all"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </Link>
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
