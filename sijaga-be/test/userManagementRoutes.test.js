const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
test("management list and delete endpoints are authenticated and admin-only", () => {
  const source = fs.readFileSync(path.join(__dirname, "../routes/userRoute.js"), "utf8");
  assert.match(source, /router\.get\("\/users", requireAdmin,/);
  assert.match(source, /router\.delete\("\/users\/:id", requireAdmin,/);
  assert.ok(source.indexOf("router.use(authenticateUser)") < source.indexOf('router.get("/users"'));
});
