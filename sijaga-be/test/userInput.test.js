const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizePasswordChange,
  normalizeProfileInput,
  normalizeUserId,
} = require("../utils/userInput");

test("normalizeUserId returns a positive integer", () => {
  assert.equal(normalizeUserId("12"), 12);
  assert.equal(normalizeUserId(7), 7);
});

test("normalizeUserId rejects invalid Prisma IDs", () => {
  assert.throws(() => normalizeUserId("abc"), /Invalid user ID/);
  assert.throws(() => normalizeUserId(0), /Invalid user ID/);
  assert.throws(() => normalizeUserId(1.5), /Invalid user ID/);
});

test("normalizeProfileInput supports partial profile updates", () => {
  assert.deepEqual(
    normalizeProfileInput({
      name: "  User SiJaga  ",
      email: "USER@SIJAGA.TEST ",
      cardId: " a1b2c3d4 ",
      status: "APPROVED",
    }),
    {
      name: "User SiJaga",
      email: "user@sijaga.test",
      card_id: "A1B2C3D4",
    }
  );

  assert.deepEqual(normalizeProfileInput({ name: "Nama Baru" }), {
    name: "Nama Baru",
  });
});

test("normalizeProfileInput rejects empty and invalid updates", () => {
  assert.throws(() => normalizeProfileInput({}), /At least one profile field/);
  assert.throws(() => normalizeProfileInput({ name: " " }), /Name must/);
  assert.throws(() => normalizeProfileInput({ email: "invalid" }), /valid email/);
  assert.throws(() => normalizeProfileInput({ card_id: " " }), /valid Card ID/);
});

test("normalizePasswordChange validates password updates", () => {
  assert.deepEqual(
    normalizePasswordChange({
      currentPassword: "password123",
      newPassword: "new-password-123",
    }),
    {
      currentPassword: "password123",
      newPassword: "new-password-123",
    }
  );

  assert.throws(() => normalizePasswordChange({}), /Current password/);
  assert.throws(
    () => normalizePasswordChange({ currentPassword: "old", newPassword: "short" }),
    /at least 8/
  );
  assert.throws(
    () =>
      normalizePasswordChange({
        currentPassword: "same-password",
        newPassword: "same-password",
      }),
    /must be different/
  );
});
