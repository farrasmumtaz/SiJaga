const express = require("express");
const {
  reportBoxStatusController,
  getLatestBoxStatusController,
} = require("../controller/boxStatusController");

const router = express.Router();

router.post("/report", reportBoxStatusController);
router.get("/get-latest", getLatestBoxStatusController);

module.exports = router;
