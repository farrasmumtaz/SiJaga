const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Function to delete locked statuses older than 1 day
const deleteLockedStatusesOlderThanOneDay = async () => {
  try {
    // Count the number of records in the locked_status table
    const totalRecords = await prisma.lockedStatus.count();

    // If there's only 1 record left, don't delete it
    if (totalRecords <= 1) {
      console.log("Only one record left, skipping deletion.");
      return;
    }

    // Delete records older than 1 day
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1); // Set the threshold to 1 day ago

    const deletedStatuses = await prisma.lockedStatus.deleteMany({
      where: {
        timestamp: {
          lt: oneDayAgo, // Find records older than 1 day
        },
      },
    });

    console.log(`Deleted ${deletedStatuses.count} locked status records older than 1 day.`);
  } catch (error) {
    console.error("Error during locked status cleanup:", error);
  }
};

module.exports = {
  deleteLockedStatusesOlderThanOneDay,
};
