const test = require("node:test");
const assert = require("node:assert/strict");
const {
  sanitizeUser,
  sanitizeUsers,
} = require("../utils/userResponse");

test("sanitizeUser removes password without mutating the source", () => {
  const source = {
    id: 1,
    name: "Admin SiJaga",
    email: "admin@sijaga.test",
    password: "hashed-password",
    status: "APPROVED",
    card_id: "CARD-001",
  };

  const result = sanitizeUser(source);

  assert.deepEqual(result, {
    id: 1,
    name: "Admin SiJaga",
    email: "admin@sijaga.test",
    status: "APPROVED",
    card_id: "CARD-001",
  });
  assert.equal(source.password, "hashed-password");
});

test("sanitizeUsers removes passwords from every user", () => {
  const result = sanitizeUsers([
    { id: 1, password: "hash-1" },
    { id: 2, password: "hash-2" },
  ]);

  assert.deepEqual(result, [{ id: 1 }, { id: 2 }]);
});
