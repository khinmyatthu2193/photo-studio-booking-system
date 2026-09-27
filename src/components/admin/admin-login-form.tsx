"use client";

import { useActionState } from "react";

import { loginAdmin } from "@/app/admin/actions";
import { initialAdminLoginState } from "@/lib/admin-auth";

export function AdminLoginForm() {
  const [state, action, isPending] = useActionState(loginAdmin, initialAdminLoginState);

  return (
    <form action={action} className="mt-8 space-y-5">
      <label className="block text-sm font-semibold text-ink">
        Email
        <input
          autoComplete="email"
          className="mt-2 min-h-12 w-full rounded-sm border border-line bg-white px-4 text-base outline-none transition focus:border-purple focus:ring-2 focus:ring-purple/15"
          disabled={isPending}
          name="email"
          required
          type="email"
        />
      </label>
      <label className="block text-sm font-semibold text-ink">
        Password
        <input
          autoComplete="current-password"
          className="mt-2 min-h-12 w-full rounded-sm border border-line bg-white px-4 text-base outline-none transition focus:border-purple focus:ring-2 focus:ring-purple/15"
          disabled={isPending}
          name="password"
          required
          type="password"
        />
      </label>

      {state.status === "error" ? (
        <p
          aria-live="polite"
          className="border-l-2 border-coral-deep bg-coral/15 px-4 py-3 text-sm leading-6 text-ink"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}

      <button
        className="min-h-12 w-full rounded-full bg-ink px-6 text-sm font-semibold text-cream transition hover:bg-ink-soft disabled:cursor-wait disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Signing in…" : "Sign in to dashboard"}
      </button>
    </form>
  );
}
