# Snapora Engineering Guide

## Product and scope

- Build **Snapora — Photography Studio Booking Platform** for one photography studio.
- Treat `prd.md` as the product source of truth. Read the relevant sections before planning or changing behavior; never edit it unless the user explicitly asks.
- Deliver only the MVP: public studio/portfolio/package browsing, guest booking and confirmation, plus authenticated admin management of bookings, packages, add-ons, portfolio, availability, blocked dates, and studio settings.
- Exclude customer accounts, multi-studio/multi-branch behavior, marketplaces, online payments, notifications, chat, delivery, advanced accounting, and all PRD future phases unless explicitly requested.

## Stack

- Next.js App Router with strict TypeScript.
- Tailwind CSS for styling.
- Supabase PostgreSQL, Auth, Storage, and Row Level Security.
- Vercel deployment.
- Add React Hook Form, Zod, Lucide React, or a date library only when an implemented MVP requirement justifies them.

## Architecture

- Keep routes in `src/app`, feature components in `src/components/<feature>`, Supabase clients in `src/lib/supabase`, validation in `src/lib/validations`, shared types in `src/types`, and stable site configuration in `src/config`.
- Prefer Server Components. Add `"use client"` only for browser state, interactive controls, or browser-only APIs.
- Perform privileged reads and all mutations at a trusted server/database boundary. Keep client components focused on interaction and presentation.
- Organize code by the existing feature boundaries before creating shared abstractions. Extract shared code only after a real second use.
- Use Supabase migrations as the database schema source of truth. Generate database types after schema changes when tooling is available.
- Preserve established project patterns. Inspect relevant routes, components, migrations, utilities, and tests before creating new files or conventions.

## Coding conventions

- Keep TypeScript strict; avoid `any`, unsafe casts, and duplicated domain types.
- Prefer small named functions, explicit inputs/outputs at trust boundaries, and readable code over clever abstractions.
- Validate untrusted input on the server. Client validation is usability only.
- Use integer MMK amounts; never use floating-point arithmetic for prices.
- Store dates/times with an explicit, documented studio-timezone convention. Do not rely on the browser timezone for booking rules.
- Implement real Supabase-backed behavior. Do not ship controls that imply a working operation without persistence and feedback.
- Do not add dependencies, services, layers, repositories, or generic component systems without a concrete MVP need.

## Security and Supabase

- Never expose, log, commit, or place a Supabase service-role key in a `NEXT_PUBLIC_*` variable. Prefer authenticated RLS and narrowly scoped server/database operations over service-role access.
- Keep secrets in ignored environment files and maintain only placeholder names in an example environment file.
- Enable RLS on every exposed table and test policies for anonymous, authenticated admin, and unauthorized access.
- Public users may read only publishable/active content and submit a controlled booking request. They must not list bookings, choose status or price, mutate catalog data, or access admin profiles.
- Admin access requires Supabase Auth plus authorization against `admin_profiles`; authentication alone is not admin authorization.
- Validate file type, size, and storage path for portfolio uploads. Restrict write/delete policies to admins.
- Never place customer contact details in public responses, logs, URLs, cacheable pages, or analytics.

## Booking invariants

- Treat availability shown in the browser as advisory. Re-check all rules atomically at booking creation.
- The database must prevent more than one active booking for the same studio date/time slot. `pending` and `confirmed` occupy a slot; `cancelled` and `completed` do not.
- Enforce conflicts with a database constraint/index or transactional database function, not a check-then-insert sequence in application code.
- A trusted server/database operation must verify: active package and add-ons, non-past date, weekly availability, blocked dates, valid time slot, and no active conflict.
- Create public submissions as `pending`. The server/database assigns booking number, authoritative prices, and total; never accept these values or booking status from the client.
- Store add-on price snapshots with each booking. Preserve historical totals when catalog prices change.
- Return a clear conflict result so the UI can refresh availability and ask the customer to choose another slot.

## UI/UX

- Keep the public site elegant, editorial, responsive, and photography-led; photographs supply most visual color.
- Make booking mobile-first with clear progress, large touch targets, a persistent summary where useful, and no dead ends.
- Keep admin screens practical, information-dense, responsive, and task-focused rather than decorative.
- Provide accessible labels, keyboard navigation, visible focus, adequate contrast, and semantic HTML.
- Implement relevant loading, empty, validation, success, conflict, and error states from the PRD.
- Avoid generic SaaS styling, excessive gradients, glass effects, animation, and visual clutter.

## Testing and quality gates

- Test pure pricing, availability, status-transition, and validation logic.
- Add integration tests for booking creation, simultaneous conflict attempts, price authority, RLS access, and admin authorization.
- Add focused end-to-end coverage for the core guest booking journey and admin login/booking status flow when those flows exist.
- For each phase, run the smallest relevant checks first, then the repository's full typecheck, lint, and test commands before reporting completion.
- Do not weaken types, policies, constraints, or tests to make checks pass. Report unrelated pre-existing failures separately.

## Deployment

- Target Vercel with separate local/preview/production Supabase configuration.
- Apply reviewed migrations before deploying code that depends on them; document required environment variable names without values.
- Confirm production RLS, admin authorization, storage policies, public URLs, and the complete booking flow before release.
- Never run destructive production migrations or alter production data without explicit user approval and a recovery plan.

## Codex workflow

1. **Orient:** Read `prd.md`, this file, the relevant skill, current Git status, and existing code/configuration. Summarize constraints; do not rediscover unrelated areas.
2. **Plan the phase:** Define one small vertical outcome, affected files/schema, acceptance checks, and security implications. Keep later phases out of the change.
3. **Data foundation:** Establish schema, constraints, RLS, storage policies, and generated types before UI that depends on them.
4. **Public experience:** Build read-only studio content, then the booking flow backed by real availability and atomic submission.
5. **Admin experience:** Add auth/authorization, booking operations, then catalog, portfolio, availability, and settings management.
6. **Harden:** Verify responsive/accessibility states, conflicts, policy boundaries, tests, and deployment configuration.
7. **Report:** State what changed, checks run, remaining risks, and the next bounded phase. Keep durable decisions in code, migrations, or this guide rather than repeating context in chat.

## Stop conditions

- Stop and report when a request conflicts with `prd.md`, expands beyond the MVP, or requires a product decision that changes data shape or user behavior.
- Stop before destructive data/schema operations, production changes, secret rotation, or external service setup that lacks explicit authorization.
- Stop when required credentials or external configuration are missing; name what is needed without requesting secret values in chat.
- When implementation already exists, extend or repair it instead of scaffolding a parallel solution. If existing behavior contradicts the PRD or these invariants, show the evidence and request direction before a broad rewrite.
