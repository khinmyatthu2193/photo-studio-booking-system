import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  tone?: "coral" | "dark" | "light" | "outline";
};

const tones = {
  coral: "bg-coral text-ink hover:bg-coral-deep",
  dark: "bg-ink text-cream hover:bg-ink-soft",
  light: "bg-cream text-ink hover:bg-peach",
  outline: "border border-line text-ink hover:border-purple hover:text-purple",
} as const;

export function ButtonLink({
  className = "",
  tone = "coral",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple ${tones[tone]} ${className}`}
      {...props}
    />
  );
}
