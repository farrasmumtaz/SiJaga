const jwt = require("jsonwebtoken");
const { isTokenBlacklisted } = require("../repository/userAuthRepository");
const { getUserById } = require("../repository/userRepository");

const createAuthenticateUser = ({ verifyToken, isBlacklisted, getUser }) => {
  return async (req, res, next) => {
    const authorization = req.header("Authorization");
    const [scheme, token] = authorization?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "A valid Bearer token is required.",
      });
    }

    try {
      const decoded = verifyToken(token);
      const tokenIsBlacklisted = await isBlacklisted(token);

      if (tokenIsBlacklisted) {
        return res.status(401).json({
          success: false,
          message: "Token has been revoked.",
        });
      }

      const user = getUser ? await getUser(decoded.id) : decoded;
      if (!user || (getUser && user.status !== "APPROVED")) {
        return res.status(401).json({ success: false, message: "Account is unavailable or not approved." });
      }
      req.user = user;
      req.authToken = token;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }
  };
};

const authenticateUser = createAuthenticateUser({
  verifyToken: (token) => jwt.verify(token, process.env.JWT_SECRET),
  isBlacklisted: isTokenBlacklisted,
  getUser: getUserById,
});

const authenticateSocketToken = async (token) => {
  if (typeof token !== "string" || !token) throw new Error("Token required.");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (await isTokenBlacklisted(token)) throw new Error("Token revoked.");
  const user = await getUserById(decoded.id);
  if (!user || user.status !== "APPROVED") throw new Error("Account unavailable.");
  return user;
};

module.exports = { authenticateUser, createAuthenticateUser, authenticateSocketToken };
