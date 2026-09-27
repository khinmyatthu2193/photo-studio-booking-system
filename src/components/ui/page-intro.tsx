type PageIntroProps = {
  description: string;
  eyebrow: string;
  title: string;
};

export function PageIntro({ description, eyebrow, title }: PageIntroProps) {
  return (
    <header className="max-w-4xl py-16 sm:py-24 lg:py-28">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-[-0.05em] text-balance sm:text-7xl lg:text-8xl">
        {title}
      </h1>
      <p className="mt-7 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
        {description}
      </p>
    </header>
  );
}
