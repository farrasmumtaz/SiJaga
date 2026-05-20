const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get user by ID
const getUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
};

// Update user profile
const updateUserProfile = async (userId, name, email, card_id) => {
  try {
    console.log("Updating user with values:", { userId, name, email, card_id });

    // Perform the update query
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        name: name,        // Update name field
        email: email,      // Update email field
        card_id: card_id   // Update card_id field
      }
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


module.exports = {
  getUserById,
  updateUserProfile,
  changeUserPassword,
  deleteUser
};
