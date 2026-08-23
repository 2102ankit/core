import {
  BubbleSortInteractive,
  Clock24Demo,
  CommandBarDemo,
  GooeyThemeToggleDemo,
  HighlightedInputDemo,
  KaleidoscopeViewer,
  LeatherButtonFinal,
  OutlineDemo,
  SegmentedControlDemo,
} from "@/components/demos/demo-exports";
import { ComponentShell } from "@/components/component-shell";
import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAvailableComponents,
  getComponentDemo,
} from "@/lib/components-data";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowUpRight01Icon,
  GithubIcon,
} from "@hugeicons/core-free-icons";
import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

const demoComponents: Record<string, () => ReactNode> = {
  "bubble-sort": () => <BubbleSortInteractive />,
  "leather-button": () => <LeatherButtonFinal />,
  kaleidoscope: () => <KaleidoscopeViewer />,
  "highlighted-input": () => <HighlightedInputDemo />,
  "command-bar": () => <CommandBarDemo inline defaultOpen />,
  outline: () => <OutlineDemo />,
  "24h-clock": () => <Clock24Demo />,
  "theme-toggle": () => <GooeyThemeToggleDemo />,
  "segmented-control": () => <SegmentedControlDemo />,
};

type ComponentDemoPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAvailableComponents().map((demo) => ({
    slug: demo.id,
  }));
}

export default async function ComponentDemoPage({
  params,
}: ComponentDemoPageProps) {
  const { slug } = await params;
  const demo = getComponentDemo(slug);

  if (!demo || demo.comingSoon) {
    notFound();
  }

  const renderDemo = demoComponents[slug];

  if (!renderDemo) {
    notFound();
  }

  // Read the component source at build time for the Source tab
  let source = "";
  if (demo.source) {
    try {
      source = await fs.readFile(
        path.join(process.cwd(), demo.source),
        "utf8",
      );
    } catch {
      source = `// Source file not found: ${demo.source}`;
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <Container size="wide" className="py-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="space-y-2">
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href="/components">
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                Components
              </Link>
            </Button>
            <h1 className="text-title-1 text-foreground">{demo.title}</h1>
            <p className="text-callout text-muted-foreground max-w-2xl">
              {demo.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {demo.tech.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          {demo.github && (
            <Button variant="outline" size="sm" asChild className="shrink-0">
              <Link
                href={demo.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <HugeiconsIcon icon={GithubIcon} size={16} />
                GitHub
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={12} />
              </Link>
            </Button>
          )}
        </div>

        <ComponentShell
          source={source}
          sourcePath={demo.source}
          docs={demo.docs}
        >
          {renderDemo()}
        </ComponentShell>
      </Container>
      <div className="flex-1" />
    </div>
  );
}
