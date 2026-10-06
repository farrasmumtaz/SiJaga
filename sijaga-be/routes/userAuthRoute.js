const express = require("express");
const {
  registerUserController,
  loginUserController,
  logoutUserController,
} = require("../controller/userAuthController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../domain/authorization");

const router = express.Router();

router.post("/register", authenticateUser, requireAdmin, registerUserController);
router.post("/login", loginUserController);
router.post("/logout", authenticateUser, logoutUserController);

module.exports = router;
