import assert from "node:assert/strict";
import test from "node:test";
import { canTransition } from "../src/lib/booking-status";

test("booking status permits only the studio lifecycle", () => {
  assert.equal(canTransition("pending", "confirmed"), true);
  assert.equal(canTransition("pending", "cancelled"), true);
  assert.equal(canTransition("confirmed", "completed"), true);
  assert.equal(canTransition("confirmed", "cancelled"), true);
  assert.equal(canTransition("pending", "completed"), false);
  assert.equal(canTransition("cancelled", "confirmed"), false);
  assert.equal(canTransition("completed", "pending"), false);
});
