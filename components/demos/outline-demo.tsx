"use client";

import { Outline, OutlineInline } from "@/components/outline";

type Heading = {
  id: string;
  text: string;
  level: number;
};

const HEADINGS: Heading[] = [
  { id: "introduction", text: "Introduction", level: 2 },
  { id: "the-gooey-filter", text: "The gooey filter", level: 2 },
  { id: "gaussian-blur", text: "Gaussian blur", level: 3 },
  { id: "alpha-contrast", text: "Alpha contrast", level: 3 },
  { id: "droplet-physics", text: "Droplet physics", level: 2 },
  { id: "springs", text: "Springs, not tweens", level: 3 },
  { id: "performance", text: "Performance notes", level: 2 },
  { id: "further-reading", text: "Further reading", level: 2 },
];

function Section({
  heading,
  children,
}: {
  heading: Heading;
  children: React.ReactNode;
}) {
  return (
    <section id={heading.id} className="scroll-mt-24">
      {heading.level === 2 ? (
        <h2 className="text-title-2 text-foreground mt-10 mb-3 first:mt-0">
          {heading.text}
        </h2>
      ) : (
        <h3 className="text-title-3 text-foreground mt-8 mb-2">
          {heading.text}
        </h3>
      )}
      <div className="space-y-3 text-body text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export function OutlineDemo() {
  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 sm:px-0 py-6">
      
      <Outline headings={HEADINGS} />

      <p className="text-caption text-muted-foreground mb-8 rounded-lg border border-dashed border-border p-3">
        On large screens the live outline is pinned to the right edge. Below
        that, an inline version follows right here — and on blog posts it also
        appears behind a divider in the mobile menu.
      </p>

      
      <OutlineInline
        headings={HEADINGS}
        className="lg:hidden mb-10 rounded-lg border border-border bg-muted/40 p-4"
      />

      <article className="max-w-xl space-y-1">
        <Section heading={HEADINGS[0]}>
          <p>
            An outline is the quiet navigator of a long page. It sits at the
            edge of your peripheral vision, quietly reporting where you are and
            offering a shortcut to everywhere else.
          </p>
          <p>
            The component on this page watches every heading below, decides
            which section currently owns the viewport, and moves a small pip
            along its rail with a spring.
          </p>
        </Section>

        <Section heading={HEADINGS[1]}>
          <p>
            Scroll detection is deliberately boring: cache each heading&apos;s
            document offset, then on scroll find the last one above a threshold
            that matches the sticky header height.
          </p>
        </Section>

        <Section heading={HEADINGS[2]}>
          <p>
            Offsets are cached rather than queried per frame. A resize event
            invalidates the cache, which keeps scrolling cheap even on very
            long documents.
          </p>
        </Section>

        <Section heading={HEADINGS[3]}>
          <p>
            When you click an item, scroll listeners are briefly suppressed so
            the active state doesn&apos;t flicker through intermediate sections
            while the page glides to its destination.
          </p>
        </Section>

        <Section heading={HEADINGS[4]}>
          <p>
            The indicator is a tiny pill that lags behind your clicks on
            purpose. Spring physics give it weight, so moving three items down
            feels different from moving one.
          </p>
        </Section>

        <Section heading={HEADINGS[5]}>
          <p>
            Stiffness controls how snappy the pip is; damping keeps it from
            overshooting into jitter. Values around stiffness 380 and damping
            32 land quickly without bouncing.
          </p>
        </Section>

        <Section heading={HEADINGS[6]}>
          <p>
            Everything runs in a single passive scroll listener with rAF-batched
            state updates. No intersection observers were harmed.
          </p>
        </Section>

        <Section heading={HEADINGS[7]}>
          <p>
            Try clicking around, scrolling fast, or deep-linking with a hash —
            the outline reconciles all three without losing its place.
          </p>
        </Section>

        <div className="h-[40vh]" aria-hidden="true" />
      </article>
    </div>
  );
}

export default OutlineDemo;
