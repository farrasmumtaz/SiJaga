const express = require("express");
const {
  whoamiController,
  getUserDetailsController,
  updateUserProfileController,
  changePasswordController,
  deleteUserController,
  getPendingUsersController,
  approveUserController,
  rejectUserController,
} = require("../controller/userController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../domain/authorization");

const router = express.Router();

// Middleware to authenticate user
router.use(authenticateUser);
router.get("/users", requireAdmin, require("../controller/userController").getRegularUsersController);
router.delete("/users/:id", requireAdmin, require("../controller/userController").deleteRegularUserController);

// Route to get current user details (whoami)
router.get("/whoami", whoamiController);

router.get("/pending", requireAdmin, getPendingUsersController);

router.put("/approve/:id", requireAdmin, approveUserController);

router.put("/reject/:id", requireAdmin, rejectUserController);

// Route to get user details by ID (for admin or profile-related)
router.get("/:id", requireAdmin, getUserDetailsController);

// Route to update user profile
router.put("/update", updateUserProfileController);

// Route to change user password
router.put("/changepassword", changePasswordController);

router.delete("/delete", deleteUserController);

module.exports = router;
