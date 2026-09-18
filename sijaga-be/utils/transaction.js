const isTransactionConflict = (error) => error?.code === "P2034";

const retryTransaction = async (operation, maxAttempts = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isTransactionConflict(error) || attempt === maxAttempts) {
        throw error;
      }
    }
  }

  throw lastError;
};

module.exports = { retryTransaction };
