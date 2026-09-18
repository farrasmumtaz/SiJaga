const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const CARD_SCAN_TTL_MS = 5 * 60 * 1000;

const registerUserFromScan = async ({
  scanId,
  name,
  email,
  cardId,
  hashedPassword,
}) => {
  const oldestAllowedScan = new Date(Date.now() - CARD_SCAN_TTL_MS);

  return await prisma.$transaction(async (transaction) => {
    const claimedScan = await transaction.cardIdDumps.updateMany({
      where: {
        id: scanId,
        card_id: cardId,
        consumedAt: null,
        createdAt: {
          gte: oldestAllowedScan,
        },
      },
      data: {
        consumedAt: new Date(),
      },
    });

    if (claimedScan.count !== 1) {
      throw new Error("Card scan is invalid, expired, or already used.");
    }

    const existingEmail = await transaction.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingEmail) {
      throw new Error("Email already registered.");
    }

    const existingCard = await transaction.user.findUnique({
      where: { card_id: cardId },
      select: { id: true },
    });

    if (existingCard) {
      throw new Error("Card sudah terdaftar.");
    }

    return await transaction.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        status: "PENDING",
        card_id: cardId,
      },
    });
  });
};

// Find a user by email
const getUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
};

// Add a token to the blacklist
const blacklistToken = async (token) => {
  const blacklisted = await prisma.blacklistedToken.create({
    data: { token },
  });
  return blacklisted;
};

// Check if a token is blacklisted
const isTokenBlacklisted = async (token) => {
  const blacklisted = await prisma.blacklistedToken.findUnique({
    where: { token },
  });
  return !!blacklisted; // Returns true if token is blacklisted
};

const getUserByCardId = async (cardId) => {
  return await prisma.user.findFirst({
    where: {
      card_id: cardId
    }
  });
};

module.exports = {
  registerUserFromScan,
  getUserByEmail,
  getUserByCardId,
  blacklistToken,
  isTokenBlacklisted,
};
