const test = require("node:test");
const assert = require("node:assert/strict");
const {
  deleteLockedStatusesOlderThanOneDay,
} = require("../repository/lockedStatusRepository");

test("cleanup always excludes the latest locker status", async () => {
  const now = new Date("2026-09-18T12:00:00.000Z");
  let deleteFilter;
  const client = {
    lockedStatus: {
      findFirst: async () => ({ id: 42 }),
      deleteMany: async ({ where }) => {
        deleteFilter = where;
        return { count: 7 };
      },
    },
  };

  const result = await deleteLockedStatusesOlderThanOneDay({ client, now });

  assert.deepEqual(result, {
    count: 7,
    preservedStatusId: 42,
  });
  assert.equal(deleteFilter.id.not, 42);
  assert.equal(
    deleteFilter.Timestamp.lt.toISOString(),
    "2026-09-17T12:00:00.000Z"
  );
});

test("cleanup does not issue a delete when no status exists", async () => {
  let deleteCalled = false;
  const client = {
    lockedStatus: {
      findFirst: async () => null,
      deleteMany: async () => {
        deleteCalled = true;
        return { count: 0 };
      },
    },
  };

  const result = await deleteLockedStatusesOlderThanOneDay({ client });

  assert.deepEqual(result, {
    count: 0,
    preservedStatusId: null,
  });
  assert.equal(deleteCalled, false);
});
