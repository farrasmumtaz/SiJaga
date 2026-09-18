const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Keep the newest row because it is the current single-locker state.
const deleteLockedStatusesOlderThanOneDay = async ({
  client = prisma,
  now = new Date(),
} = {}) => {
  const latestStatus = await client.lockedStatus.findFirst({
    select: { id: true },
    orderBy: [
      { Timestamp: "desc" },
      { id: "desc" },
    ],
  });

  if (!latestStatus) {
    return {
      count: 0,
      preservedStatusId: null,
    };
  }

  const cutoff = new Date(now.getTime() - ONE_DAY_MS);
  const deletedStatuses = await client.lockedStatus.deleteMany({
    where: {
      id: {
        not: latestStatus.id,
      },
      Timestamp: {
        lt: cutoff,
      },
    },
  });

  return {
    count: deletedStatuses.count,
    preservedStatusId: latestStatus.id,
  };
};

module.exports = {
  deleteLockedStatusesOlderThanOneDay,
};
