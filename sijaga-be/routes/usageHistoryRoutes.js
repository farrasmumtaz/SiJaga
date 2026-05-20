const express = require("express");
const {
  getAllUsersController,
  addUsageHistoryController,
  getAllUsageHistoryController,
  getLatestUsageHistoryController,
  getTop3NamesController,
  getTop3TimestampsController,
  createLockedStatusController,
  getLatestLockedStatusController,
} = require("../controller/usageHistoryController");

const router = express.Router();

router.get("/users", getAllUsersController); // Get all users
router.post("/add", addUsageHistoryController); // Add new usage history
router.get("/all", getAllUsageHistoryController); // Get all usage history
router.get("/latest", getLatestUsageHistoryController); // Get the latest usage history
router.get("/top3/names", getTop3NamesController); // Get top 3 names
router.get("/top3/timestamps", getTop3TimestampsController); // Get top 3 timestamps
router.post("/box-status", createLockedStatusController); // Route to post a new status
router.get("/latest-box-status", getLatestLockedStatusController); // Route to get the latest status

module.exports = router;
