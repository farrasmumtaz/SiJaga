const BOX_STATUSES = new Set(["ADA BARANG", "TIDAK ADA BARANG"]);

const normalizeBoxStatus = (status) => {
  if (typeof status !== "string") {
    return null;
  }

  const normalizedStatus = status.trim().toUpperCase();
  return BOX_STATUSES.has(normalizedStatus) ? normalizedStatus : null;
};

const normalizeDistanceCm = (distanceCm) => {
  if (distanceCm === undefined || distanceCm === null || distanceCm === "") {
    return null;
  }

  const parsedDistance = Number(distanceCm);
  return Number.isInteger(parsedDistance) && parsedDistance >= 0
    ? parsedDistance
    : null;
};

module.exports = {
  normalizeBoxStatus,
  normalizeDistanceCm,
};
