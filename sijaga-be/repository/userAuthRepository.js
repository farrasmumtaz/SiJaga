const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Check if the card_id exists in CardIdDumps
const isCardIdAvailable = async (cardId) => {
  if (!cardId) {
    throw new Error("Card ID is undefined or missing.");
  }

  const card = await prisma.cardIdDumps.findUnique({
    where: { card_id: cardId },
  });

  return !!card; // Returns true if the card exists, false otherwise
};

// Register a new user
const registerUser = async (name, email, cardId, hashedPassword) => {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      card_id: cardId,
      password: hashedPassword,
    },
  });
  return user;
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

module.exports = {
  isCardIdAvailable,
  registerUser,
  getUserByEmail,
  blacklistToken,
  isTokenBlacklisted,
};
