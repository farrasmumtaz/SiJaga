const bcrypt = require("bcryptjs");
const { getUserById, updateUserProfile, changeUserPassword, deleteUser } = require("../repository/userRepository");
const {
  getPendingUsers,
  approveUser,
  rejectUser,
} = require("../repository/userRepository");
const { sanitizeUser, sanitizeUsers } = require("../utils/userResponse");
// Get user details
const getUserDetailsService = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found.");
  }
  return sanitizeUser(user);
};

// Update user profile
const updateUserProfileService = async (userId, name, email, status, cardId) => {
  const updatedUser = await updateUserProfile(userId, name, email, status, cardId);
  return sanitizeUser(updatedUser);
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
  return sanitizeUser(updatedUser);
};

const deleteUserService = async (userId) => {
  const result = await deleteUser(userId);
  return result;
};

const getPendingUsersService = async () => {
  const users = await getPendingUsers();

  return sanitizeUsers(users);
};

const approveUserService = async (
  id
) => {
  const user = await approveUser(id);

  return sanitizeUser(user);
};

const rejectUserService = async (id) => {
  const user = await rejectUser(id);

  return sanitizeUser(user);
};

module.exports = {
  getUserDetailsService,
  updateUserProfileService,
  changePasswordService,
  deleteUserService,
  getPendingUsersService,
  approveUserService,
  rejectUserService,
};
