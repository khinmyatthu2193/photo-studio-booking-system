type SectionHeadingProps = {
  action?: React.ReactNode;
  description?: string;
  eyebrow: string;
  title: string;
};

export function SectionHeading({
  action,
  description,
  eyebrow,
  title,
}: SectionHeadingProps) {
  return (
    <header className="grid gap-6 border-t border-line pt-6 md:grid-cols-[1fr_auto] md:items-end">
      <div className="max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-4 font-display text-4xl leading-[1.02] tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-5 max-w-2xl leading-7 text-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}
