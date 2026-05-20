const cron = require("node-cron");
const { cleanUpOldLockedStatuses } = require("../service/lockedStatusCleanupService");

// Schedule the cleanup job to run once a day (midnight)
cron.schedule("0 0 * * *", async () => {
  console.log("Running locked status cleanup job...");
  await cleanUpOldLockedStatuses();
}, {
  timezone: "Asia/Jakarta" // Use your desired timezone
});
