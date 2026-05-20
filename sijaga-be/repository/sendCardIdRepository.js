const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Function to create a new CardIdDump
const createCardIdDump = async (cardId) => {
  try {
    const cardIdDump = await prisma.cardIdDumps.create({
      data: { card_id: cardId },
    });
    return cardIdDump;
  } catch (error) {
    throw new Error("Error creating CardIdDump: " + error.message);
  }
};

// Function to fetch the latest CardIdDump
const getLatestCardIdDump = async () => {
  try {
    const latest = await prisma.cardIdDumps.findFirst({
      orderBy: { id: "desc" },
    });
    return latest;
  } catch (error) {
    throw new Error("Error fetching latest CardIdDump: " + error.message);
  }
};

module.exports = { createCardIdDump, getLatestCardIdDump };
