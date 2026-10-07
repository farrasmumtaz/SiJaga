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
      status: "PENDING",
      role: "USER",
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
      status: "PENDING",
      role: "USER",
    },
    data: {
      status: "REJECTED",
    },
  });
};

module.exports = {
  getRegularUsers: () => prisma.user.findMany({ where: { role: "USER" }, select: { id: true, name: true, email: true, card_id: true, status: true }, orderBy: { id: "desc" } }),
  deleteRegularUser: (id) => prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id } });
    const locker = await tx.lockedStatus.findFirst({ orderBy: [{ Timestamp: "desc" }, { id: "desc" }] });
    require("../domain/userDeletion").assertDeletableUser(user, locker?.status);
    await tx.user.delete({ where: { id, role: "USER" } });
  }, { isolationLevel: "Serializable" }),
  getUserById,
  updateUserProfile,
  changeUserPassword,
  deleteUser,
  getPendingUsers,
  approveUser,
  rejectUser
};
