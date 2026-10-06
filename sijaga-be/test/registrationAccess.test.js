const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const auth = require("../middleware/authMiddleware");
const controllers = require("../controller/userAuthController");
const cardControllers = require("../controller/sendCardIdController");

test("registration and latest scan enforce admin access; ESP32 scan remains available", async () => {
  const originalAuth = auth.authenticateUser;
  const originalRegister = controllers.registerUserController;
  const originalLatest = cardControllers.getLatestCardIdDumpController;
  const originalCreate = cardControllers.createCardIdDumpController;
  let registrations = 0;
  auth.authenticateUser = auth.createAuthenticateUser({
    verifyToken: (token) => ({ id: token === "admin" ? 1 : 2 }),
    isBlacklisted: async () => false,
    getUser: async (id) => ({ id, role: id === 1 ? "ADMIN" : "USER", status: "APPROVED" }),
  });
  controllers.registerUserController = (_req, res) => {
    registrations++;
    res.status(201).json({ success: true });
  };
  cardControllers.getLatestCardIdDumpController = (_req, res) => res.json({ status: true });
  cardControllers.createCardIdDumpController = (_req, res) => res.status(201).json({ status: true });
  const app = express();
  try {
    app.use("/user", require("../routes/userAuthRoute"));
    app.use("/card-id", require("../routes/sendCardIdRoute"));
  } finally {
    auth.authenticateUser = originalAuth;
    controllers.registerUserController = originalRegister;
    cardControllers.getLatestCardIdDumpController = originalLatest;
    cardControllers.createCardIdDumpController = originalCreate;
  }
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const [token, expected] of [[null, 401], ["user", 403], ["admin", 201]]) {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(`${base}/user/register`, { method: "POST", headers });
      assert.equal(response.status, expected);
      const latest = await fetch(`${base}/card-id/latest`, { headers });
      assert.equal(latest.status, expected === 201 ? 200 : expected);
    }
    assert.equal(registrations, 1, "Only the admin request can reach registration controller");
    assert.equal((await fetch(`${base}/card-id/create`, { method: "POST" })).status, 201);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
