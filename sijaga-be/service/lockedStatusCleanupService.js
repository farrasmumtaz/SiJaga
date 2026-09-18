const { getIo } = require("../socket"); // Import the io instance
const { deleteLockedStatusesOlderThanOneDay } = require("../repository/lockedStatusRepository");

// Function to clean up old locked statuses and emit an event to notify clients
const cleanUpOldLockedStatuses = async () => {
  try {
    const result = await deleteLockedStatusesOlderThanOneDay();

    if (result.count > 0) {
      const io = getIo();
      io.emit("status_cleanup", {
        deletedCount: result.count,
        preservedStatusId: result.preservedStatusId,
      });
    }

    console.log(
      `Deleted ${result.count} old locker statuses; preserved status ${result.preservedStatusId ?? "none"}.`
    );

    return result;
  } catch (error) {
    console.error("Error in cleanup service:", error);
    throw error;
  }
};

module.exports = {
  cleanUpOldLockedStatuses,
};
