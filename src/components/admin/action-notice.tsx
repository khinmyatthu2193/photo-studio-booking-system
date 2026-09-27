export function ActionNotice({ error, notice }: { error?: string; notice?: string }) {
  if (!error && !notice) return null;
  return <p className={`mb-6 border p-4 text-sm ${error ? "border-coral-deep bg-coral/15" : "border-purple bg-peach"}`} role={error ? "alert" : "status"}>{error || notice}</p>;
}
