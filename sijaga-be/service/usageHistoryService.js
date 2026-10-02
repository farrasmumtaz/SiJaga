const {
    getAllUsers,
    addUsageHistory,
    getAllUsageHistory,
    getLatestUsageHistory,
    getTop3NamesFromUsageHistory,
    getTop3TimestampsFromUsageHistory,
    createLockedStatus,
    getLatestLockedStatus
  } = require("../repository/usageHistoryRepository");
  const { sanitizeUsers } = require("../utils/userResponse");
  
  // Service to get all users
  const getAllUsersService = async () => {
    const users = await getAllUsers();

    return sanitizeUsers(users);
  };
  
  // Service to add usage history
  const addUsageHistoryService = async (card_id, status) => {
    return await addUsageHistory(card_id, status);
  };
  
  // Service to get all usage history
  const getAllUsageHistoryService = async (user) => {
    return await getAllUsageHistory(user);
  };
  
  // Service to get the latest usage history
  const getLatestUsageHistoryService = async (user) => {
    return await getLatestUsageHistory(user);
  };
  
  // Service to get top 3 names from usage history
  const getTop3NamesService = async (user) => {
    return await getTop3NamesFromUsageHistory(user);
  };
  
  // Service to get top 3 timestamps from usage history
  const getTop3TimestampsService = async (user) => {
    return await getTop3TimestampsFromUsageHistory(user);
  };

  // Post a new status
  const createLockedStatusService = async (status) => {
    return await createLockedStatus(status);
  };
  
  // Get the latest status
  const getLatestLockedStatusService = async () => {
    return await getLatestLockedStatus();
  };
  
  module.exports = {
    getAllUsersService,
    addUsageHistoryService,
    getAllUsageHistoryService,
    getLatestUsageHistoryService,
    getTop3NamesService,
    getTop3TimestampsService,
    createLockedStatusService,
    getLatestLockedStatusService,
  };
