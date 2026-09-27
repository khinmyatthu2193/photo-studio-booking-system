import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { validateAdminCredentials } from "../src/lib/admin-auth";
import { getStudioMonthBounds } from "../src/lib/dashboard-dates";

test("accepts a complete admin credential submission", () => {
  const result = validateAdminCredentials({
    email: " admin@example.com ",
    password: "secret-password",
  });

  assert.equal(result.valid, true);
  if (!result.valid) return;
  assert.equal(result.credentials.email, "admin@example.com");
  assert.equal(result.credentials.password, "secret-password");
});

test("rejects missing or malformed admin credentials", () => {
  assert.equal(validateAdminCredentials({ email: "", password: "" }).valid, false);
  assert.equal(
    validateAdminCredentials({ email: "not-an-email", password: "secret" }).valid,
    false,
  );
});

test("calculates dashboard month boundaries across a year change", () => {
  assert.deepEqual(getStudioMonthBounds("2026-12-31"), {
    firstDay: "2026-12-01",
    nextMonth: "2027-01-01",
  });
});

test("schema restricts booking reads to authenticated admins", async () => {
  const migration = await readFile(
    new URL("../supabase/migrations/20260927050000_initial_snapora_schema.sql", import.meta.url),
    "utf8",
  );

  assert.match(
    migration,
    /create policy "Admins can read bookings"[\s\S]*to authenticated[\s\S]*private\.is_admin\(\)/i,
  );
  assert.match(migration, /revoke all on table public\.bookings from anon, authenticated/i);
  assert.match(
    migration,
    /grant select on table public\.bookings, public\.booking_addons to authenticated/i,
  );
  assert.doesNotMatch(migration, /grant select on table public\.bookings[^;]*to anon/i);
});
