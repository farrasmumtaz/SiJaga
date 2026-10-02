const { createCardIdDump, getLatestCardIdDump } = require("../repository/sendCardIdRepository");

// Service to create a CardIdDump
const createCardIdDumpService = async (cardId) => {
  if (!cardId) {
    throw new Error("Card ID is required.");
  }
  return await createCardIdDump(cardId);
};

// Service to fetch the latest CardIdDump
const getLatestCardIdDumpService = async (createdAfter = null) =>
  getLatestCardIdDump(createdAfter);

module.exports = { createCardIdDumpService, getLatestCardIdDumpService };
