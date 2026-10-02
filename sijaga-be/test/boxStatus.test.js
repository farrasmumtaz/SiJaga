const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeBoxStatus,
  normalizeDistanceCm,
} = require("../domain/boxStatus");

test("normalizes supported ultrasonic statuses", () => {
  assert.equal(normalizeBoxStatus(" ada barang "), "ADA BARANG");
  assert.equal(normalizeBoxStatus("TIDAK ADA BARANG"), "TIDAK ADA BARANG");
});

test("rejects unsupported ultrasonic statuses", () => {
  assert.equal(normalizeBoxStatus("LOCKED_CARD-A"), null);
  assert.equal(normalizeBoxStatus(undefined), null);
});

test("accepts only non-negative integer distances", () => {
  assert.equal(normalizeDistanceCm(14), 14);
  assert.equal(normalizeDistanceCm("15"), 15);
  assert.equal(normalizeDistanceCm(-1), null);
  assert.equal(normalizeDistanceCm(1.5), null);
});
