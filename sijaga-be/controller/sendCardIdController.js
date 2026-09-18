const {
  createCardIdDumpService,
  getLatestCardIdDumpService,
} = require("../service/sendIdCardService");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getIo } = require("../socket");
const { resolveCardId } = require("../utils/cardId");
// Controller to create a CardIdDump

const createCardIdDumpController = async (req, res) => {
  try {
    const cardId = resolveCardId(req.body);

    if (!cardId) {
      return res.status(400).json({
        status: false,
        message: "Card ID is required.",
      });
    }

    const result = await createCardIdDumpService(cardId);

    // SOCKET EMIT
    const io = getIo();

    io.emit("cardIdDump_latest", {
      card_id: cardId
    });

    res.status(201).json({
      status: true,
      message: "CardIdDump created successfully.",
      data: result,
    });

  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error);

    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

// Controller to fetch the latest CardIdDump
const getLatestCardIdDumpController = async (req, res) => {
  try {
    const latestCard = await prisma.cardIdDumps.findFirst({
      orderBy: {
        id: "desc"
      }
    });

    if (!latestCard) {
      return res.status(404).json({
        status: false,
        message: "No card found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Latest CardIdDump fetched successfully.",
      data: latestCard
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

module.exports = { createCardIdDumpController, getLatestCardIdDumpController };
