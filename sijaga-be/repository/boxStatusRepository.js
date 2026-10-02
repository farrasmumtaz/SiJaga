const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createBoxStatus = async ({ status, distanceCm }) => {
  return prisma.boxStatus.create({
    data: {
      status,
      distanceCm,
    },
  });
};

const getLatestBoxStatus = async () => {
  return prisma.boxStatus.findFirst({
    orderBy: [
      { Timestamp: "desc" },
      { id: "desc" },
    ],
  });
};

module.exports = {
  createBoxStatus,
  getLatestBoxStatus,
};
