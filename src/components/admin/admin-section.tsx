type AdminSectionProps = {
  description: string;
  title: string;
};

export function AdminSection({ description, title }: AdminSectionProps) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">Studio operations</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 leading-7 text-muted">{description}</p>
      <div className="mt-10 rounded-2xl border border-dashed border-line bg-surface p-8 text-sm leading-6 text-muted">
        This route is established. Its authenticated Supabase workflow will be
        implemented in the relevant MVP phase.
      </div>
    </div>
  );
}
