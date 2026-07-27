const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getIo } = require("../socket"); // Assuming io is initialized in app.js

// Get all users
const getAllUsers = async () => {
  return await prisma.user.findMany();
};

// Add a new usage history entry
const addUsageHistory = async (card_id, status) => {
  const user = await prisma.user.findUnique({ where: { card_id } });
  if (!user) {
    throw new Error("User with this card_id does not exist.");
  }

  const usageHistory = await prisma.usageHistory.create({
    data: {
      Timestamp: new Date(),
      name: user.name,
      status: status,
      card_id: card_id,
    },
  });

  // Emit real-time event for usage history
  getIo().emit("usageHistory_update", usageHistory);

  return usageHistory;
};

// Get all usage history
const getAllUsageHistory = async () => {
  return await prisma.usageHistory.findMany({ orderBy: { Timestamp: "desc" } });
};

// Get the latest usage history entry
const getLatestUsageHistory = async () => {
  return await prisma.usageHistory.findFirst({ orderBy: { Timestamp: "desc" } });
};

// Get top 3 names from usage history
const getTop3NamesFromUsageHistory = async () => {
  return await prisma.usageHistory.findMany({
    select: { name: true },
    distinct: ["name"],
    take: 3,
    orderBy: { Timestamp: "desc" },
  });
};

// Get top 3 timestamps from usage history
const getTop3TimestampsFromUsageHistory = async () => {
  return await prisma.usageHistory.findMany({
    select: { Timestamp: true },
    take: 3,
    orderBy: { Timestamp: "desc" },
  });
};

// Post status to locked_status table
const createLockedStatus = async (status) => {
  const newStatus = await prisma.lockedStatus.create({
    data: {
      status,
    },
  });

  // Emit real-time event for locked status
  getIo().emit("lockedStatus_update", newStatus);

  return newStatus;
};

// Get the latest status from locked_status table
const getLatestLockedStatus = async () => {
  return await prisma.lockedStatus.findFirst({
    orderBy: {
      Timestamp: "desc",
    },
  });
};

const processLockerAccess = async (card_id) => {
  const user =
    await prisma.user.findUnique({
      where: {
        card_id
      }
    });

  if (!user) {
    return {
      success: false,
      action: "DENIED",
      message: "Card not registered"
    };
  }
  const latestStatus = await getLatestLockedStatus();

  // kalau belum ada status
  if (!latestStatus || latestStatus.status === "UNLOCKED") {

    // owner baru
    await createLockedStatus(`LOCKED_${card_id}`);

    await addUsageHistory(card_id, "STORE_ITEM");

    return {
      success: true,
      action: "OPEN",
      message: "Locker opened for storing item"
    };
  }

  // cek owner
  if (latestStatus.status === `LOCKED_${card_id}`) {

    // owner ambil barang
    await createLockedStatus("UNLOCKED");

    await addUsageHistory(card_id, "TAKE_ITEM");

    return {
      success: true,
      action: "OPEN",
      message: "Locker opened for owner"
    };
  }

  // bukan owner
  await addUsageHistory(card_id, "ACCESS_DENIED");

  return {
    success: false,
    action: "DENIED",
    message: "Access denied"
  };
};

module.exports = {
  getAllUsers,
  addUsageHistory,
  getAllUsageHistory,
  getLatestUsageHistory,
  getTop3NamesFromUsageHistory,
  getTop3TimestampsFromUsageHistory,
  createLockedStatus,
  getLatestLockedStatus,
  processLockerAccess
};
