import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const sizes = {
  narrow: "max-w-[45rem]",
  default: "max-w-[60rem]",
  wide: "max-w-[75rem]",
} as const;

type ContainerSize = keyof typeof sizes;

type ContainerProps = {
  children: ReactNode;
  size?: ContainerSize;
  className?: string;
  as?: "div" | "section" | "article" | "main";
};

export function Container({
  children,
  size = "default",
  className,
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizes[size],
        className,
      )}
    >
      {children}
    </Component>
  );
}
