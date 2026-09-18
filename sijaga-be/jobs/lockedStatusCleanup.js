const cron = require("node-cron");
const { cleanUpOldLockedStatuses } = require("../service/lockedStatusCleanupService");

// Schedule the cleanup job to run once a day (midnight)
cron.schedule("0 0 * * *", async () => {
  console.log("Running locked status cleanup job...");

  try {
    await cleanUpOldLockedStatuses();
  } catch (error) {
    console.error("Locked status cleanup job failed:", error);
  }
}, {
  timezone: "Asia/Jakarta" // Use your desired timezone
});
