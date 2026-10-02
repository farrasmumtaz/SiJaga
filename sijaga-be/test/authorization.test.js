const test = require("node:test");
const assert = require("node:assert/strict");
const { historyScope, canReadHistory, requireAdmin } = require("../domain/authorization");

test("user history scope uses account ID and ignores supplied card/role filters", () => {
  assert.deepEqual(historyScope({ id: 7, role: "USER", card_id: "CHANGED" }), { userId: 7 });
  assert.deepEqual(historyScope({ id: 1, role: "ADMIN" }), {});
  assert.throws(() => historyScope(undefined));
});

test("realtime history is visible only to the owner or admin", () => {
  assert.equal(canReadHistory({ id: 7, role: "USER" }, { userId: 8 }), false);
  assert.equal(canReadHistory({ id: 7, role: "USER" }, { userId: null }), false);
  assert.equal(canReadHistory({ id: 7, role: "USER" }, { userId: 7 }), true);
  assert.equal(canReadHistory({ id: 1, role: "ADMIN" }, { userId: 8 }), true);
});

test("approval rejects ordinary authenticated users", () => {
  const response = {
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
  let called = false;
  requireAdmin({ user: { role: "USER" } }, response, () => { called = true; });
  assert.equal(response.code, 403);
  assert.equal(called, false);
  requireAdmin({ user: { role: "ADMIN" } }, response, () => { called = true; });
  assert.equal(called, true);
});
