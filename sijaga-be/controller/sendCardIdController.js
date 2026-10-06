const {
  createCardIdDumpService,
  getLatestCardIdDumpService,
} = require("../service/sendIdCardService");
const { emitAdmin } = require("../socket");
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

    await emitAdmin("cardIdDump_latest", result);

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
    const createdAfter = req.query.createdAfter;
    const parsedCreatedAfter = createdAfter ? new Date(createdAfter) : null;

    if (parsedCreatedAfter && Number.isNaN(parsedCreatedAfter.getTime())) {
      return res.status(400).json({
        status: false,
        message: "createdAfter must be a valid ISO date.",
      });
    }

    const latestCard = await getLatestCardIdDumpService(parsedCreatedAfter);

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
