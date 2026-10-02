const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Admin access required." });
  }
  return next();
};

const historyScope = (user) => {
  if (!user || !Number.isSafeInteger(user.id) || user.id <= 0) {
    throw new Error("Authenticated user required.");
  }
  return user.role === "ADMIN" ? {} : { userId: user.id };
};

const canReadHistory = (user, history) =>
  user.role === "ADMIN" || (history.userId != null && history.userId === user.id);

module.exports = { requireAdmin, historyScope, canReadHistory };
