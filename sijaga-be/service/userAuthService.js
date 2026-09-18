const {
  isCardIdAvailable,
  registerUser,
  getUserByEmail,
  getUserByCardId,
  blacklistToken,
  isTokenBlacklisted,
} = require("../repository/userAuthRepository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  addUsageHistory
} = require("../repository/usageHistoryRepository");
const { sanitizeUser } = require("../utils/userResponse");

// Register a new user
const registerUserService = async (
  name,
  email,
  cardId,
  password
) => {

  const cardAvailable =
    await isCardIdAvailable(cardId);

  if (!cardAvailable) {
    throw new Error(
      "The card ID is not available in the database."
    );
  }

  const existingUser =
    await getUserByEmail(email);

  if (existingUser) {
    throw new Error(
      "Email already registered."
    );
  }

  const existingCard =
    await getUserByCardId(cardId);

  if (existingCard) {
    throw new Error(
      "Card sudah terdaftar."
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user = await registerUser(
    name,
    email,
    cardId,
    hashedPassword
  );

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
