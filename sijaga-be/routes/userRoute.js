const express = require("express");
const { whoamiController, getUserDetailsController, updateUserProfileController, changePasswordController, deleteUserController } = require("../controller/userController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware to authenticate user
router.use(authenticateUser);

// Route to get current user details (whoami)
router.get("/whoami", whoamiController);

// Route to get user details by ID (for admin or profile-related)
router.get("/:id", getUserDetailsController);

// Route to update user profile
router.put("/update", updateUserProfileController);

// Route to change user password
router.put("/changepassword", changePasswordController);

router.delete("/delete", deleteUserController); 

module.exports = router;
