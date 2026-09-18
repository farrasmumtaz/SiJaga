const test = require("node:test");
const assert = require("node:assert/strict");
const { decideLockerAccess } = require("../domain/lockerAccess");

test("an empty locker is claimed by the scanned card", () => {
  assert.deepEqual(decideLockerAccess("UNLOCKED", "CARD-A"), {
    nextLockerStatus: "LOCKED_CARD-A",
    historyStatus: "STORE_ITEM",
    response: {
      success: true,
      action: "OPEN",
      message: "Locker opened for storing item",
    },
  });
});

test("the current owner can retrieve the stored item", () => {
  assert.deepEqual(decideLockerAccess("LOCKED_CARD-A", "CARD-A"), {
    nextLockerStatus: "UNLOCKED",
    historyStatus: "TAKE_ITEM",
    response: {
      success: true,
      action: "OPEN",
      message: "Locker opened for owner",
    },
  });
});

test("another card is denied without changing locker state", () => {
  assert.deepEqual(decideLockerAccess("LOCKED_CARD-A", "CARD-B"), {
    nextLockerStatus: null,
    historyStatus: "ACCESS_DENIED",
    response: {
      success: false,
      action: "DENIED",
      message: "Access denied",
    },
  });
});
