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

module.exports = {
  setIo,
  getIo,
};