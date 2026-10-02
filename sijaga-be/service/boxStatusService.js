const {
  createBoxStatus,
  getLatestBoxStatus,
} = require("../repository/boxStatusRepository");
const {
  normalizeBoxStatus,
  normalizeDistanceCm,
} = require("../domain/boxStatus");
const { getIo } = require("../socket");

const reportBoxStatusService = async ({ status, distance_cm }) => {
  const normalizedStatus = normalizeBoxStatus(status);

  if (!normalizedStatus) {
    const error = new Error("Status must be ADA BARANG or TIDAK ADA BARANG.");
    error.statusCode = 400;
    throw error;
  }

  const distanceCm = normalizeDistanceCm(distance_cm);
  if (distance_cm !== undefined && distance_cm !== null && distanceCm === null) {
    const error = new Error("distance_cm must be a non-negative integer.");
    error.statusCode = 400;
    throw error;
  }

  const boxStatus = await createBoxStatus({
    status: normalizedStatus,
    distanceCm,
  });

  getIo().emit("boxStatus_update", boxStatus);
  return boxStatus;
};

const getLatestBoxStatusService = async () => getLatestBoxStatus();

module.exports = {
  reportBoxStatusService,
  getLatestBoxStatusService,
};
