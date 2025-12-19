import Image from "next/image";
import type { ComponentProps } from "react";

const proseClasses = {
  wrapper: "prose text-zinc-700 dark:text-zinc-300 leading-7 max-w-none",
  h1: "text-3xl font-bold text-zinc-950 dark:text-zinc-50 mt-8 mb-4",
  h2: "text-2xl font-semibold text-zinc-950 dark:text-zinc-50 mt-8 mb-4",
  h3: "text-xl font-semibold text-zinc-950 dark:text-zinc-50 mt-6 mb-3",
  p: "mb-4 leading-relaxed",
  a: "text-zinc-950 dark:text-zinc-50 underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4 hover:decoration-zinc-950 dark:hover:decoration-zinc-50 transition-colors duration-200",
  ul: "mb-4 ml-6 list-disc",
  ol: "mb-4 ml-6 list-decimal",
  li: "mb-2",
  codeInline: "px-1.5 py-0.5 rounded text-sm font-mono",
  pre: "bg-zinc-800 p-4 rounded-lg mb-4 leading-snug",
  blockquote:
    "border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 italic my-4",
  hr: "border-zinc-200 dark:border-zinc-800 my-8",
  figcaption: "text-sm text-center text-zinc-500 dark:text-zinc-400 mt-2",
};

const BlockImage = ({
  src,
  alt = "",
  caption,
  ...rest
}: {
  src: string;
  alt?: string;
  caption?: string;
} & ComponentProps<typeof Image>) => {
  const finalSrc =
    src.startsWith("http") || src.startsWith("/") ? src : `/images/blog/${src}`;

  return (
    <figure className="my-8">
      <Image
        src={finalSrc}
        alt={alt}
        width={1200}
        height={675}
        className="rounded-lg w-full shadow-lg"
        style={{ width: "100%", height: "auto" }}
        {...rest}
      />
      {caption && (
        <figcaption className={proseClasses.figcaption}>{caption}</figcaption>
      )}
    </figure>
  );
};

export const mdxComponents: Record<string, React.ComponentType<any>> = {
  // === Block-level image: use <Image src="..." /> in MDX ===
  Image: BlockImage,

  // === Inline image: keep simple (no <figure>) ===
  img: (props: ComponentProps<"img">) => {
    const { src, alt = "", width, height, ...rest } = props;
    if (!src || typeof src !== "string") return null;

    const finalSrc =
      src.startsWith("http") || src.startsWith("/")
        ? src
        : `/images/blog/${src}`;

    // Only use width/height if they are valid numbers
    const imgWidth = typeof width === "number" ? width : 800;
    const imgHeight = typeof height === "number" ? height : 450;

    return (
      <Image
        src={finalSrc}
        alt={alt}
        width={imgWidth}
        height={imgHeight}
        style={{ width: "100%", height: "auto" }}
        className="inline-block align-middle rounded"
        // style={{ width: "auto", height: "auto", maxWidth: "100%" }}
        {...rest}
      />
    );
  },

  h1: ({ children }: ComponentProps<"h1">) => (
    <h1 className={proseClasses.h1}>{children}</h1>
  ),
  h2: ({ children }: ComponentProps<"h2">) => (
    <h2 className={proseClasses.h2}>{children}</h2>
  ),
  h3: ({ children }: ComponentProps<"h3">) => (
    <h3 className={proseClasses.h3}>{children}</h3>
  ),

  p: ({ children }: ComponentProps<"p">) => (
    <p className={proseClasses.p}>{children}</p>
  ),
  a: ({ href, children, ...props }: ComponentProps<"a">) => (
    <a href={href} className={proseClasses.a} {...props}>
      {children}
    </a>
  ),

  ul: ({ children }: ComponentProps<"ul">) => (
    <ul className={proseClasses.ul}>{children}</ul>
  ),
  ol: ({ children }: ComponentProps<"ol">) => (
    <ol className={proseClasses.ol}>{children}</ol>
  ),
  li: ({ children }: ComponentProps<"li">) => (
    <li className={proseClasses.li}>{children}</li>
  ),

  code: ({ children, className }: ComponentProps<"code">) => {
    const isBlock = className?.includes("language-");
    return isBlock ? (
      <code>{children}</code>
    ) : (
      <code className={proseClasses.codeInline}>{children}</code>
    );
  },
  pre: ({ children }: ComponentProps<"pre">) => (
    <pre className={proseClasses.pre}>{children}</pre>
  ),

  blockquote: ({ children }: ComponentProps<"blockquote">) => (
    <blockquote className={proseClasses.blockquote}>{children}</blockquote>
  ),
  hr: () => <hr className={proseClasses.hr} />,

  figcaption: ({ children }: ComponentProps<"figcaption">) => (
    <figcaption className={proseClasses.figcaption}>{children}</figcaption>
  ),
};
