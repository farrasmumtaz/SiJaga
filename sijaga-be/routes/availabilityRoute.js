const express = require("express");
const {
  getLatestLockedStatusController,
} = require("../controller/usageHistoryController");

const router = express.Router();

router.get("/get-latest", getLatestLockedStatusController);

module.exports = router;