let io;

const setIo = (socketIo) => {
  io = socketIo;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }

  return io;
};

const emitHistory = async (history) => {
  const { authenticateSocketToken } = require("./middleware/authMiddleware");
  const { canReadHistory } = require("./domain/authorization");
  await Promise.all([...getIo().sockets.sockets.values()].map(async (socket) => {
    try {
      const user = await authenticateSocketToken(socket.handshake.auth?.token);
      if (canReadHistory(user, history)) socket.emit("usageHistory_update", history);
    } catch {
      socket.disconnect(true);
    }
  }));
};

module.exports = {
  setIo,
  getIo,
  emitHistory,
};
