const {
    createCardIdDumpService,
    getLatestCardIdDumpService,
  } = require("../service/sendIdCardService");
  
  // Controller to create a CardIdDump
  const createCardIdDumpController = async (req, res) => {
    try {
      const { cardId } = req.body;
      const result = await createCardIdDumpService(cardId);
      res.status(201).json({
        status: true,
        message: "CardIdDump created successfully.",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  };
  
  // Controller to fetch the latest CardIdDump
  const getLatestCardIdDumpController = async (req, res) => {
    try {
      const result = await getLatestCardIdDumpService();
      res.status(200).json({
        status: true,
        message: "Latest CardIdDump fetched successfully.",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  };
  
  module.exports = { createCardIdDumpController, getLatestCardIdDumpController };
  