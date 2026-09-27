---
name: supabase
description: Design, migrate, secure, and verify Snapora's Supabase database, Auth, Storage, RLS, and generated types. Use for backend data and authorization work, not general UI tasks.
---

# Supabase

- Read the relevant PRD data/security sections, `AGENTS.md`, and all existing migrations and Supabase helpers before making changes.
- Make additive, reviewable SQL migrations the schema source of truth. Do not edit already-applied migrations; add a corrective migration.
- Model only the single-studio MVP. Use foreign keys, checks, sensible defaults, timestamps, and indexes that support actual queries.
- Enable RLS on every exposed table. Define and verify explicit anonymous, authenticated-admin, and unauthorized behavior for each operation.
- Authorize admins through Supabase Auth plus `admin_profiles`; never treat any authenticated account as an admin automatically.
- Expose only active/published catalog content publicly. Do not expose booking/customer rows or admin profile data to anonymous users.
- Route public booking creation through one controlled transactional database/server operation that derives status, booking number, catalog prices, and total.
- Enforce active-slot uniqueness in PostgreSQL for `pending` and `confirmed` bookings. Do not rely on frontend checks or application-only transactions.
- Keep portfolio objects in a deliberate bucket/path scheme. Public reads and admin-only validated writes/deletes must be enforced by storage policies.
- Use the anon/publishable key where RLS applies. Keep service-role credentials server-only and avoid them unless a narrowly scoped operation truly requires bypassing RLS.
- Regenerate typed database definitions after schema changes and update callers in the same change.
- Test policies and constraints with anonymous, admin, and unauthorized sessions, including two concurrent attempts for one slot.
- Stop before destructive or production migration work, policy broadening, or any change whose data migration/recovery behavior is unclear.
