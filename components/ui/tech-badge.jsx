import { cn } from "@/lib/utils";

const variantStyles = {
  mern: "bg-blue-500 text-blue-200 dark:bg-blue-400/30 dark:text-blue-400",
  python:
    "bg-yellow-500 text-yellow-200 dark:bg-yellow-400/30 dark:text-yellow-400",
  spring:
    "bg-green-500 text-green-200 dark:bg-green-400/30 dark:text-green-400",
  devops:
    "bg-purple-500 text-purple-200 dark:bg-purple-400/30 dark:text-purple-400",
  ml: "bg-pink-500 text-pink-200 dark:bg-pink-400/30 dark:text-pink-400",
  default: "bg-muted text-muted-foreground",
};

export function TechBadge({ children, variant = "default", className = "" }) {
  return (
    <code
      className={cn(
        "px-2 py-1 rounded font-medium text-sm transition-colors",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </code>
  );
}
