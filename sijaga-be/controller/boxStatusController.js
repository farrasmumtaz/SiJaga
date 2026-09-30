const {
  reportBoxStatusService,
  getLatestBoxStatusService,
} = require("../service/boxStatusService");

const reportBoxStatusController = async (req, res) => {
  try {
    const status = await reportBoxStatusService(req.body);
    return res.status(201).json({ success: true, status });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLatestBoxStatusController = async (_req, res) => {
  try {
    const status = await getLatestBoxStatusService();
    return res.json({ success: true, status });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  reportBoxStatusController,
  getLatestBoxStatusController,
};
