const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../domain/authorization");
const {
  createCardIdDumpController,
  getLatestCardIdDumpController,
} = require("../controller/sendCardIdController");

// Route to create a new CardIdDump
router.post("/create", createCardIdDumpController);

// Route to fetch the latest CardIdDump
router.get("/latest", authenticateUser, requireAdmin, getLatestCardIdDumpController);


module.exports = router;
