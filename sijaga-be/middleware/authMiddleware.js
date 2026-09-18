const jwt = require("jsonwebtoken");
const { isTokenBlacklisted } = require("../repository/userAuthRepository");

const createAuthenticateUser = ({ verifyToken, isBlacklisted }) => {
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

      req.user = decoded;
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
});

module.exports = { authenticateUser, createAuthenticateUser };
