const logoutAll = async (req, res) => {
  const User = require("../models/user");
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.refreshTokens = [];
    await user.save();
    res.clearCookie("refreshToken");

    return res.json({ message: "Logged out from all devices" });
  } catch (error) {
    res.status(505).json({ message: "Server error" });
  }
};

module.exports = logoutAll;
