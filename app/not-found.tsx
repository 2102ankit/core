import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-mono text-caption tracking-[0.3em] uppercase text-muted-foreground mb-4">
        404
      </p>
      <h1 className="text-display text-foreground mb-3">
        This page wandered off
      </h1>
      <p className="text-body text-muted-foreground max-w-md mx-auto mb-8">
        It may have been moved, renamed, or never existed in the first place.
        The rest of the site is right where you left it.
      </p>
      <Button asChild size="lg" className="gap-2">
        <Link href="/">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
