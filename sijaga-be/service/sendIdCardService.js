const { createCardIdDump, getLatestCardIdDump } = require("../repository/sendCardIdRepository");

// Service to create a CardIdDump
const createCardIdDumpService = async (cardId) => {
  if (!cardId) {
    throw new Error("Card ID is required.");
  }
  return await createCardIdDump(cardId);
};

// Service to fetch the latest CardIdDump
const getLatestCardIdDumpService = async () => {
  const latest = await getLatestCardIdDump();
  if (!latest) {
    throw new Error("No CardIdDumps found.");
  }
  return latest;
};

module.exports = { createCardIdDumpService, getLatestCardIdDumpService };
