type EmptyStateProps = {
  children: string;
  title: string;
};

export function EmptyState({ children, title }: EmptyStateProps) {
  return (
    <section className="rounded-[2rem] border border-line bg-surface px-6 py-14 sm:px-10">
      <p className="font-display text-3xl tracking-[-0.025em]">{title}</p>
      <p className="mt-3 max-w-xl leading-7 text-muted">{children}</p>
    </section>
  );
}
