const sensorSnapshot = (sensor, now = Date.now()) => {
  if (!sensor || !["ADA BARANG", "TIDAK ADA BARANG"].includes(sensor.status)) return null;
  const age = now - new Date(sensor.Timestamp).getTime();
  return age >= 0 && age <= 60000 ? sensor.status : null;
};
module.exports = { sensorSnapshot };
