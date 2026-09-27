type DataNoticeProps = {
  description: string;
  eyebrow?: string;
  title: string;
  tone?: "empty" | "error";
};

export function DataNotice({
  description,
  eyebrow = "Studio update",
  title,
  tone = "empty",
}: DataNoticeProps) {
  return (
    <section
      className={`border-y px-1 py-12 sm:py-16 ${
        tone === "error" ? "border-coral text-ink" : "border-line"
      }`}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 max-w-2xl font-display text-3xl tracking-[-0.03em] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-xl leading-7 text-muted">{description}</p>
    </section>
  );
}
