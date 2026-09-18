const test = require("node:test");
const assert = require("node:assert/strict");
const { retryTransaction } = require("../utils/transaction");

test("retryTransaction retries serialization conflicts", async () => {
  let attempts = 0;

  const result = await retryTransaction(async () => {
    attempts += 1;

    if (attempts < 3) {
      const error = new Error("transaction conflict");
      error.code = "P2034";
      throw error;
    }

    return "committed";
  });

  assert.equal(result, "committed");
  assert.equal(attempts, 3);
});

test("retryTransaction does not retry unrelated errors", async () => {
  let attempts = 0;

  await assert.rejects(
    retryTransaction(async () => {
      attempts += 1;
      throw new Error("validation failed");
    }),
    /validation failed/
  );

  assert.equal(attempts, 1);
});
