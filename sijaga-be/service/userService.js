const bcrypt = require("bcryptjs");
const { getUserById, updateUserProfile, changeUserPassword, deleteUser } = require("../repository/userRepository");

// Get user details
const getUserDetailsService = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
};

// Update user profile
const updateUserProfileService = async (userId, name, email, cardId) => {
  const updatedUser = await updateUserProfile(userId, name, email, cardId);
  return updatedUser;
};

// Change password
const changePasswordService = async (userId, oldPassword, newPassword) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  // Compare old password with the stored one
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new Error("Old password is incorrect.");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const updatedUser = await changeUserPassword(userId, hashedPassword);
  return updatedUser;
};

const deleteUserService = async (userId) => {
  const result = await deleteUser(userId);
  return result;
};

module.exports = {
  getUserDetailsService,
  updateUserProfileService,
  changePasswordService,
  deleteUserService
};
