const { getUserDetailsService, updateUserProfileService, changePasswordService, deleteUserService } = require("../service/userService");
const {
  getPendingUsersService,
  approveUserService,
  rejectUserService,
} = require("../service/userService");
// Get user details (Who am I API)
const whoamiController = async (req, res) => {
  try {
    // The user ID is already decoded in the request via the authentication middleware
    const userId = req.user.id;
    const user = await getUserDetailsService(userId);

    return res.json({
      success: true,
      message: "User details retrieved successfully.",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user details by ID (for admin or profile-related updates)
const getUserDetailsController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserDetailsService(userId);
    return res.json({
      status: true,
      data: latestStatus,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user profile
const updateUserProfileController = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming userId comes from the authenticated user
    const { name, email, cardId } = req.body; // Destructuring from the request body

    // Pass individual parameters to the service function
    const updatedUser = await updateUserProfileService(userId, name, email, cardId);

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Change password
const changePasswordController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const updatedUser = await changePasswordService(userId, currentPassword, newPassword);

    return res.json({
      success: true,
      message: "Password updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const userId = req.user.id;  // Assuming userId comes from the authenticated user
    const result = await deleteUserService(userId);

    return res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getPendingUsersController = async (
  req,
  res
) => {
  try {
    const users =
      await getPendingUsersService();

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveUserController = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const user =
      await approveUserService(id);

    res.json({
      success: true,
      message:
        "User approved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectUserController = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const user =
      await rejectUserService(id);

    res.json({
      success: true,
      message:
        "User rejected successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  whoamiController,
  getUserDetailsController,
  updateUserProfileController,
  changePasswordController,
  deleteUserController,
  getPendingUsersController,
  approveUserController,
  rejectUserController,
};
