const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.header("Authorization")?.split(" ")[1];

  // If no token is provided, return an error response
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is required.",
    });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user data to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If the token is invalid or expired, return an error response
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = { authenticateUser };
