const test = require("node:test");
const assert = require("node:assert/strict");
const { assertDeletableUser } = require("../domain/userDeletion");
test("deletion protects admin accounts and the current locker owner", () => {
  assert.throws(() => assertDeletableUser(null), { statusCode: 404 });
  assert.throws(() => assertDeletableUser({ role: "ADMIN", card_id: "AA" }), { statusCode: 403 });
  assert.throws(() => assertDeletableUser({ role: "USER", card_id: "AA" }, "LOCKED_AA"), { statusCode: 409 });
  assert.doesNotThrow(() => assertDeletableUser({ role: "USER", card_id: "AA" }, "LOCKED_BB"));
});
