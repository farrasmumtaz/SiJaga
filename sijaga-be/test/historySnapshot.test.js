const test = require("node:test");
const assert = require("node:assert/strict");
const { sensorSnapshot } = require("../domain/historySnapshot");
test("history records only fresh valid sensor readings", () => {
  assert.equal(sensorSnapshot(null, 100000), null);
  assert.equal(sensorSnapshot({ status: "ADA BARANG", Timestamp: new Date(90000) }, 100000), "ADA BARANG");
  assert.equal(sensorSnapshot({ status: "TIDAK ADA BARANG", Timestamp: new Date(90000) }, 100000), "TIDAK ADA BARANG");
  assert.equal(sensorSnapshot({ status: "ADA BARANG", Timestamp: new Date(0) }, 100000), null);
  assert.equal(sensorSnapshot({ status: "ADA BARANG", Timestamp: new Date(110000) }, 100000), null);
});
