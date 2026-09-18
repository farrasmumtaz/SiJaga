const {
  getAllUsersService,
  addUsageHistoryService,
  getAllUsageHistoryService,
  getLatestUsageHistoryService,
  getTop3NamesService,
  getTop3TimestampsService,
  createLockedStatusService,
  getLatestLockedStatusService
} = require("../service/usageHistoryService");

const { processLockerAccess } = require("../repository/usageHistoryRepository");
const { resolveCardId } = require("../utils/cardId");

// Controller to get all users
const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.json({ success: true, users });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controller to add usage history
const addUsageHistoryController = async (req, res) => {
  try {
    const { card_id, status } = req.body;
    const usageHistory = await addUsageHistoryService(card_id, status);
    res.json({ success: true, usageHistory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controller to get all usage history
const getAllUsageHistoryController = async (req, res) => {
  try {
    const usageHistory = await getAllUsageHistoryService();
    res.json({ success: true, usageHistory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controller to get the latest usage history
const getLatestUsageHistoryController = async (req, res) => {
  try {
    const latestUsageHistory = await getLatestUsageHistoryService();
    res.json({ success: true, latestUsageHistory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controller to get top 3 names
const getTop3NamesController = async (req, res) => {
  try {
    const top3Names = await getTop3NamesService();
    res.json({ success: true, top3Names });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controller to get top 3 timestamps
const getTop3TimestampsController = async (req, res) => {
  try {
    const top3Timestamps = await getTop3TimestampsService();
    res.json({ success: true, top3Timestamps });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// API to post a status
const createLockedStatusController = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const newStatus = await createLockedStatusService(status);

    return res.json({
      success: true,
      message: "Status added successfully.",
      status: newStatus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API to get the latest status
const getLatestLockedStatusController = async (req, res) => {
  try {
    const latestStatus = await getLatestLockedStatusService();

    if (!latestStatus) {
      return res.json({
        success: true,
        status: null,
        message: "No status found.",
      });
    }

    return res.json({
      success: true,
      message: "Latest status retrieved successfully.",
      status: latestStatus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const processLockerAccessController = async (req, res) => {
  try {
    const cardId = resolveCardId(req.body);

    if (!cardId) {
      return res.status(400).json({
        success: false,
        action: "DENIED",
        message: "Card ID is required.",
      });
    }

    const result = await processLockerAccess(cardId);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllUsersController,
  addUsageHistoryController,
  getAllUsageHistoryController,
  getLatestUsageHistoryController,
  getTop3NamesController,
  getTop3TimestampsController,
  createLockedStatusController,
  getLatestLockedStatusController,
  processLockerAccessController
};
