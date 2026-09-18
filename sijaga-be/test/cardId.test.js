const test = require("node:test");
const assert = require("node:assert/strict");
const { resolveCardId } = require("../utils/cardId");

test("resolveCardId accepts the ESP32 cardId payload", () => {
  assert.equal(resolveCardId({ cardId: " a1b2c3d4 " }), "A1B2C3D4");
});

test("resolveCardId accepts the API card_id payload", () => {
  assert.equal(resolveCardId({ card_id: "A1B2C3D4" }), "A1B2C3D4");
});

test("resolveCardId rejects missing, blank, and non-string values", () => {
  assert.equal(resolveCardId(undefined), null);
  assert.equal(resolveCardId({}), null);
  assert.equal(resolveCardId({ cardId: "   " }), null);
  assert.equal(resolveCardId({ card_id: 1234 }), null);
});
