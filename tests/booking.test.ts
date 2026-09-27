import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  calculateBookingTotal,
  isBookingConflict,
  validateBookingInput,
} from "../src/lib/booking";

const packageId = "6ba7b810-9dad-41d1-80b4-00c04fd430c8";
const addonId = "6ba7b811-9dad-41d1-80b4-00c04fd430c8";

function validInput() {
  return {
    addonIds: [addonId],
    bookingDate: "2026-10-10",
    customerName: "  Khin Myat Thu  ",
    email: "customer@example.com",
    packageId,
    peopleCount: "2",
    phone: "09 123 456 789",
    socialContact: "@customer",
    specialRequest: "Outdoor portraits, if possible.",
    timeSlot: "14:30:00",
  };
}

test("validates and normalizes a complete booking request", () => {
  const result = validateBookingInput(validInput(), "2026-09-27");

  assert.equal(result.valid, true);
  if (!result.valid) return;
  assert.equal(result.data.customerName, "Khin Myat Thu");
  assert.equal(result.data.peopleCount, 2);
});

test("rejects past dates, invalid contacts, and duplicate add-ons", () => {
  const input = validInput();
  input.bookingDate = "2026-09-26";
  input.email = "not-an-email";
  input.phone = "abc";
  input.addonIds = [addonId, addonId];

  const result = validateBookingInput(input, "2026-09-27");

  assert.equal(result.valid, false);
  if (result.valid) return;
  assert.ok(result.errors.bookingDate);
  assert.ok(result.errors.email);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.addonIds);
});

test("rejects malformed calendar dates and non-string add-on values", () => {
  const input: Record<string, unknown> = validInput();
  input.bookingDate = "2026-02-31";
  input.addonIds = [addonId, 42];

  const result = validateBookingInput(input, "2026-01-01");

  assert.equal(result.valid, false);
  if (result.valid) return;
  assert.ok(result.errors.bookingDate);
  assert.ok(result.errors.addonIds);
});

test("calculates integer MMK totals from package and add-ons", () => {
  assert.equal(calculateBookingTotal(80_000, [15_000, 25_000]), 120_000);
  assert.equal(calculateBookingTotal(80_000, []), 80_000);
});

test("maps PostgreSQL overlap failures to a booking conflict", () => {
  assert.equal(isBookingConflict({ code: "23P01" }), true);
  assert.equal(
    isBookingConflict({ message: "The selected time overlaps an existing booking." }),
    true,
  );
  assert.equal(isBookingConflict({ code: "22023" }), false);
});

test("migration keeps conflict prevention and submission at the database boundary", async () => {
  const initialMigration = await readFile(
    new URL("../supabase/migrations/20260927050000_initial_snapora_schema.sql", import.meta.url),
    "utf8",
  );
  const bookingMigration = await readFile(
    new URL("../supabase/migrations/20260927090000_customer_booking_flow.sql", import.meta.url),
    "utf8",
  );

  assert.match(initialMigration, /exclude using gist/i);
  assert.match(initialMigration, /status in \('pending', 'confirmed'\)/i);
  assert.match(bookingMigration, /when exclusion_violation/i);
  assert.match(bookingMigration, /errcode = '23P01'/i);
  assert.match(bookingMigration, /status[\s\S]*'pending'/i);
  assert.match(bookingMigration, /revoke execute on function public\.create_booking_request/i);
});
