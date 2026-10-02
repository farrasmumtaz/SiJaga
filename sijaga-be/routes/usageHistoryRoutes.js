const express = require("express");
const {
  getAllUsersController,
  addUsageHistoryController,
  getAllUsageHistoryController,
  getLatestUsageHistoryController,
  getTop3NamesController,
  getTop3TimestampsController,
  getLatestLockedStatusController,
  processLockerAccessController,
} = require("../controller/usageHistoryController");

const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../domain/authorization");

router.get("/users", authenticateUser, requireAdmin, getAllUsersController);
router.post("/add", authenticateUser, requireAdmin, addUsageHistoryController);
router.get("/all", authenticateUser, getAllUsageHistoryController);
router.get("/latest", authenticateUser, getLatestUsageHistoryController);
router.get("/top3/names", authenticateUser, getTop3NamesController);
router.get("/top3/timestamps", authenticateUser, getTop3TimestampsController);
router.get("/latest-box-status", getLatestLockedStatusController); // Route to get the latest status
router.post("/scan-locker", processLockerAccessController); // Route to process locker access based on card_id and locker_id

module.exports = router;
