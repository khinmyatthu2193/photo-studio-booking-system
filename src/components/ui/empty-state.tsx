type EmptyStateProps = {
  children: string;
  title: string;
};

export function EmptyState({ children, title }: EmptyStateProps) {
  return (
    <section className="border-y border-line px-1 py-14 sm:py-16">
      <p className="eyebrow">Studio update</p>
      <p className="mt-4 font-display text-3xl tracking-[-0.025em]">{title}</p>
      <p className="mt-3 max-w-xl leading-7 text-muted">{children}</p>
    </section>
  );
}
