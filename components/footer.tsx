"use client";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowUp01Icon,
  CallIcon,
  CodeIcon,
  GithubIcon,
  Linkedin01Icon,
  Mail01Icon,
  Location08Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

const contactInfo: {
  icon: IconSvgElement;
  value: string;
  href?: string;
}[] = [
  { icon: Location08Icon, value: "Mumbai, India" },
  {
    icon: CallIcon,
    value: "+91 7738228239",
    href: "tel:+917738228239",
  },
  {
    icon: Mail01Icon,
    value: "2102ankitm@gmail.com",
    href: "mailto:2102ankitm@gmail.com",
  },
  {
    icon: NewTwitterIcon,
    value: "X (formerly Twitter)",
    href: "https://x.com/2102ankit",
  },
  {
    icon: Linkedin01Icon,
    value: "LinkedIn",
    href: "https://linkedin.com/in/2102ankit",
  },
  {
    icon: GithubIcon,
    value: "GitHub",
    href: "https://github.com/2102ankit",
  },
  {
    icon: CodeIcon,
    value: "LeetCode",
    href: "https://www.leetcode.com/2102ankit",
  },
];

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/components", label: "Components" },
  { href: "/reading", label: "Reading" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/60 bg-background/50">
      <Container size="wide" className="pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-title-3 text-foreground mb-4">Ankit Mishra</h3>
            <p className="text-callout text-muted-foreground max-w-xs">
              Full-Stack Developer passionate about creating innovative
              solutions with modern technologies.
            </p>
          </div>

          <div>
            <h3 className="text-title-3 text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-callout text-muted-foreground hover:text-foreground transition-fast"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-title-3 text-foreground mb-4">Connect</h3>
            <ul className="space-y-2">
              {contactInfo.map((info) => (
                <li key={info.value} className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={info.icon}
                    size={14}
                    className="text-muted-foreground shrink-0"
                  />
                  {info.href ? (
                    <Link
                      href={info.href}
                      className="text-callout text-muted-foreground hover:text-foreground transition-fast"
                    >
                      {info.value}
                    </Link>
                  ) : (
                    <span className="text-callout text-muted-foreground">
                      {info.value}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-caption text-muted-foreground">
            © {new Date().getFullYear()} Ankit Mishra. All rights reserved.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="gap-2"
          >
            Back to Top <HugeiconsIcon icon={ArrowUp01Icon} size={16} />
          </Button>
        </div>
      </Container>
    </footer>
  );
}
