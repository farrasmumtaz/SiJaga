const express = require("express");
const router = express.Router();
const {
  createCardIdDumpController,
  getLatestCardIdDumpController,
} = require("../controller/sendCardIdController");

// Route to create a new CardIdDump
router.post("/create", createCardIdDumpController);

// Route to fetch the latest CardIdDump
router.get("/latest", getLatestCardIdDumpController);

module.exports = router;
