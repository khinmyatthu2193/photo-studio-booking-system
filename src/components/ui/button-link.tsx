import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  tone?: "dark" | "light" | "outline";
};

const tones = {
  dark: "bg-ink text-canvas hover:bg-ink-soft",
  light: "bg-canvas text-ink hover:bg-stone",
  outline: "border border-line text-ink hover:border-ink",
} as const;

export function ButtonLink({
  className = "",
  tone = "dark",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${tones[tone]} ${className}`}
      {...props}
    />
  );
}
