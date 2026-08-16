import {
  BubbleSortInteractive,
  CommandBarDemo,
  HighlightedInputDemo,
  KaleidoscopeViewer,
  LeatherButtonFinal,
} from "@/components/demos/demo-exports";
import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAvailableLabDemos, getLabDemo } from "@/lib/labs-data";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowUpRight01Icon,
  GithubIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

const demoComponents: Record<string, () => ReactNode> = {
  "bubble-sort": () => <BubbleSortInteractive />,
  "leather-button": () => <LeatherButtonFinal />,
  kaleidoscope: () => <KaleidoscopeViewer />,
  "highlighted-input": () => <HighlightedInputDemo />,
  "command-bar": () => <CommandBarDemo inline defaultOpen />,
};

type LabDemoPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAvailableLabDemos().map((demo) => ({
    slug: demo.id,
  }));
}

export default async function LabDemoPage({ params }: LabDemoPageProps) {
  const { slug } = await params;
  const demo = getLabDemo(slug);

  if (!demo || demo.comingSoon) {
    notFound();
  }

  const renderDemo = demoComponents[slug];

  if (!renderDemo) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <Container size="wide" className="py-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="space-y-2">
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href="/labs">
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                Labs
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
      </Container>

      <div className="flex-1 border-t border-border/60 bg-muted/20">
        <Container
          size="wide"
          className="py-8 min-h-[60vh] flex items-center justify-center"
        >
          <div className="w-full">{renderDemo()}</div>
        </Container>
      </div>
    </div>
  );
}
