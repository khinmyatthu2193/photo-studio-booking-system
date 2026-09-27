"use client";

import { useState } from "react";

export function ConfirmActionButton({ label, question }: { label: string; question: string }) {
  const [open, setOpen] = useState(false);
  return open ? (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className="text-sm">{question}</span>
      <button className="rounded-full bg-coral-deep px-4 py-2 text-sm text-white" type="submit">Yes, {label.toLowerCase()}</button>
      <button className="rounded-full border border-line px-4 py-2 text-sm" onClick={() => setOpen(false)} type="button">Keep it</button>
    </span>
  ) : (
    <button className="rounded-full border border-coral-deep px-4 py-2 text-sm text-coral-deep" onClick={() => setOpen(true)} type="button">{label}</button>
  );
}
