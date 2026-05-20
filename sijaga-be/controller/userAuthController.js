const {
  registerUserService,
  loginUserService,
  logoutUserService,
} = require("../service/userAuthService");

// Register user
const registerUserController = async (req, res) => {
  const { name, email, card_id, password } = req.body;

  if (!card_id) {
    return res.status(400).json({
      success: false,
      message: "Card ID is required.",
    });
  }

  try {
    const user = await registerUserService(name, email, card_id, password);
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Login user
const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await loginUserService(email, password);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout user
const logoutUserController = async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  try {
    await logoutUserService(token);
    res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
};
