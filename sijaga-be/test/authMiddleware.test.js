const test = require("node:test");
const assert = require("node:assert/strict");
const { createAuthenticateUser } = require("../middleware/authMiddleware");

const createResponse = () => {
  const response = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  return response;
};

test("authentication rejects a missing Bearer token", async () => {
  const middleware = createAuthenticateUser({
    verifyToken: () => ({ id: 1 }),
    isBlacklisted: async () => false,
  });
  const request = { header: () => undefined };
  const response = createResponse();
  let nextCalled = false;

  await middleware(request, response, () => {
    nextCalled = true;
  });

  assert.equal(response.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("authentication rejects a blacklisted token", async () => {
  const middleware = createAuthenticateUser({
    verifyToken: () => ({ id: 1 }),
    isBlacklisted: async () => true,
  });
  const request = { header: () => "Bearer revoked-token" };
  const response = createResponse();
  let nextCalled = false;

  await middleware(request, response, () => {
    nextCalled = true;
  });

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.message, "Token has been revoked.");
  assert.equal(nextCalled, false);
});

test("authentication exposes verified identity and token to protected routes", async () => {
  const decodedUser = { id: 7, email: "user@sijaga.test" };
  const middleware = createAuthenticateUser({
    verifyToken: () => decodedUser,
    isBlacklisted: async () => false,
  });
  const request = { header: () => "Bearer active-token" };
  const response = createResponse();
  let nextCalled = false;

  await middleware(request, response, () => {
    nextCalled = true;
  });

  assert.deepEqual(request.user, decodedUser);
  assert.equal(request.authToken, "active-token");
  assert.equal(nextCalled, true);
  assert.equal(response.statusCode, null);
});

test("authorization reads current database role rather than trusting token role", async () => {
  const middleware = createAuthenticateUser({
    verifyToken: () => ({ id: 7, role: "ADMIN" }),
    isBlacklisted: async () => false,
    getUser: async () => ({ id: 7, role: "USER", status: "APPROVED" }),
  });
  const request = { header: () => "Bearer active-token" };
  await middleware(request, createResponse(), () => {});
  assert.equal(request.user.role, "USER");
});

test("deleted or rejected accounts cannot reuse existing tokens", async () => {
  for (const user of [null, { id: 7, status: "REJECTED", role: "USER" }]) {
    const middleware = createAuthenticateUser({
      verifyToken: () => ({ id: 7 }),
      isBlacklisted: async () => false,
      getUser: async () => user,
    });
    const response = createResponse();
    await middleware({ header: () => "Bearer active-token" }, response,
      () => assert.fail("Rejected account must not proceed"));
    assert.equal(response.statusCode, 401);
  }
});
