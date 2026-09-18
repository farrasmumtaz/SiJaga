const decideLockerAccess = (latestStatus, cardId) => {
  if (!latestStatus || latestStatus === "UNLOCKED") {
    return {
      nextLockerStatus: `LOCKED_${cardId}`,
      historyStatus: "STORE_ITEM",
      response: {
        success: true,
        action: "OPEN",
        message: "Locker opened for storing item",
      },
    };
  }

  if (latestStatus === `LOCKED_${cardId}`) {
    return {
      nextLockerStatus: "UNLOCKED",
      historyStatus: "TAKE_ITEM",
      response: {
        success: true,
        action: "OPEN",
        message: "Locker opened for owner",
      },
    };
  }

  return {
    nextLockerStatus: null,
    historyStatus: "ACCESS_DENIED",
    response: {
      success: false,
      action: "DENIED",
      message: "Access denied",
    },
  };
};

module.exports = { decideLockerAccess };
