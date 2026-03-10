const User = require("../models/user");
const bcrypt = require("bcrypt");

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token provided" });
    }
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const remainingTokens = [];
    for (const tokenObj of user.refreshTokens) {
      const match = bcrypt.compare(refreshToken, tokenObj.tokenHash);
      if (!match) {
        remainingTokens.push(tokenObj);
      }
    }
    user.refreshTokens = remainingTokens;
    await user.save();
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out from this device" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const logoutAll = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.refreshToken = [];
    await user.save();
    res.clearCookie("refreshToken");
    return res.json({ message: "logged out from all devices " });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

module.exports = { logout, logoutAll };
