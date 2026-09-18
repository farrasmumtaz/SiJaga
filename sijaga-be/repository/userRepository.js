const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get user by ID
const getUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
};

// Update user profile
const updateUserProfile = async (userId, profile) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: profile,
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error(`Error updating user: ${error.message}`);
  }
};


// Change user password
const changeUserPassword = async (userId, newPassword) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      password: newPassword, // Store the hashed password
    },
  });
};

const deleteUser = async (userId) => {
  try {
    // Perform the delete query
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return { message: "User deleted successfully." };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

const getPendingUsers = async () => {
  return await prisma.user.findMany({
    where: {
      status: "PENDING",
    },
    orderBy: {
      id: "desc",
    },
  });
};

const approveUser = async (id) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: "APPROVED",
    },
  });
};

const rejectUser = async (id) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: "REJECTED",
    },
  });
};

module.exports = {
  getUserById,
  updateUserProfile,
  changeUserPassword,
  deleteUser,
  getPendingUsers,
  approveUser,
  rejectUser
};
