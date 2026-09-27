type PageIntroProps = {
  description: string;
  eyebrow: string;
  title: string;
};

export function PageIntro({ description, eyebrow, title }: PageIntroProps) {
  return (
    <header className="max-w-3xl py-16 sm:py-24">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-5 font-display text-5xl leading-[0.98] tracking-[-0.04em] text-balance sm:text-7xl">
        {title}
      </h1>
      <p className="mt-7 max-w-2xl text-base leading-7 text-muted sm:text-lg">
        {description}
      </p>
    </header>
  );
}
