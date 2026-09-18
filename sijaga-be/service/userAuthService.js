const {
  registerUserFromScan,
  getUserByEmail,
  blacklistToken,
  isTokenBlacklisted,
} = require("../repository/userAuthRepository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  addUsageHistory
} = require("../repository/usageHistoryRepository");
const { sanitizeUser } = require("../utils/userResponse");
const { resolveCardId, resolveCardScanId } = require("../utils/cardId");

// Register a new user
const registerUserService = async (input) => {
  const name = typeof input?.name === "string" ? input.name.trim() : "";
  const email = typeof input?.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = input?.password;
  const cardId = resolveCardId(input);
  const scanId = resolveCardScanId(input);

  if (name.length < 2) {
    throw new Error("Name must contain at least 2 characters.");
  }

  if (!email || !email.includes("@")) {
    throw new Error("A valid email is required.");
  }

  if (typeof password !== "string" || password.length < 8) {
    throw new Error("Password must contain at least 8 characters.");
  }

  if (!cardId || !scanId) {
    throw new Error("A fresh card scan is required.");
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user = await registerUserFromScan({
    scanId,
    name,
    email,
    cardId,
    hashedPassword,
  });

  return sanitizeUser(user);
};  
// Login user
const loginUserService = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  // Compare the entered password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  if (user.status !== "APPROVED") {
    throw new Error("Your account is not approved yet.");
  }
  await addUsageHistory(
    user.card_id,
    "LOGIN"
  );

  // Create JWT token
  const payload = { id: user.id, name: user.name, email: user.email, card_id: user.card_id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

  // Return user details first, then token
  return {
    success: true,
    message: "OPEN",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      cardId: user.card_id
    },
    token: token
  };
};

// Logout user
const logoutUserService = async (token) => {
  if (!token) {
    throw new Error("Authorization token is required.");
  }

  const tokenBlacklisted = await isTokenBlacklisted(token);
  if (tokenBlacklisted) {
    throw new Error("Token is already blacklisted.");
  }

  await blacklistToken(token);
  return { success: true, message: "Logout successful." };
};

module.exports = {
  registerUserService,
  loginUserService,
  logoutUserService,
};
