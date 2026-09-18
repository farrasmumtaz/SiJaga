const bcrypt = require("bcryptjs");
const { getUserById, updateUserProfile, changeUserPassword, deleteUser } = require("../repository/userRepository");
const {
  getPendingUsers,
  approveUser,
  rejectUser,
} = require("../repository/userRepository");
const { sanitizeUser, sanitizeUsers } = require("../utils/userResponse");
const { normalizeProfileInput, normalizeUserId } = require("../utils/userInput");
// Get user details
const getUserDetailsService = async (userId) => {
  const normalizedUserId = normalizeUserId(userId);
  const user = await getUserById(normalizedUserId);

  if (!user) {
    throw new Error("User not found.");
  }

  return sanitizeUser(user);
};

// Update user profile
const updateUserProfileService = async (userId, input) => {
  const normalizedUserId = normalizeUserId(userId);
  const profile = normalizeProfileInput(input);
  const updatedUser = await updateUserProfile(normalizedUserId, profile);

  return sanitizeUser(updatedUser);
};

// Change password
const changePasswordService = async (userId, oldPassword, newPassword) => {
  const normalizedUserId = normalizeUserId(userId);
  const user = await getUserById(normalizedUserId);
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
  
  const updatedUser = await changeUserPassword(normalizedUserId, hashedPassword);
  return sanitizeUser(updatedUser);
};

const deleteUserService = async (userId) => {
  const normalizedUserId = normalizeUserId(userId);
  const result = await deleteUser(normalizedUserId);
  return result;
};

const getPendingUsersService = async () => {
  const users = await getPendingUsers();

  return sanitizeUsers(users);
};

const approveUserService = async (
  id
) => {
  const userId = normalizeUserId(id);
  const user = await approveUser(userId);

  return sanitizeUser(user);
};

const rejectUserService = async (id) => {
  const userId = normalizeUserId(id);
  const user = await rejectUser(userId);

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
