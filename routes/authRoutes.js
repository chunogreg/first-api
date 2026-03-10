const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authMiddleware = require("../middleware/authMiddleware");
const { logout, logoutAll } = require("../controller/authController");

//const user = require("../models/user");

router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const saltRound = 12;
    const passwordHash = await bcrypt.hash(password, saltRound);

    const user = new User({ username, passwordHash });

    //const savedUser = await user.save();
    await user.save();
    //res.status(201).json(savedUser);
    res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid username or password" });
    }
    const accessToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");

    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    user.refreshTokens.push({
      tokenHash: refreshTokenHash,
      createdAt: new Date(),
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "login successful", accessToken });
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }
    const users = await User.find({
      "refreshTokens.tokenHash": { $exists: true },
    });
    let validUser = null;
    let validTokenIndex = -1;
    for (const user of users) {
      for (let i = 0; i < user.refreshTokens.length; i++) {
        const storedHash = user.refreshTokens[i].tokenHash;
        const match = await bcrypt.compare(refreshToken, storedHash);
        if (match) {
          validUser = user;
          validTokenIndex = i;

          validUser.refreshTokens.splice(validTokenIndex, 1);

          break;
        }
      }
      if (validUser) break;
    }
    if (!validUser) {
      return res.status(403).json({ message: "invalid refresh token" });
    }
    const accessToken = jwt.sign(
      { userId: validUser._id, username: validUser.username },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );
    const newRefreshToken = crypto.randomBytes(64).toString("hex");
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 12);
    validUser.refreshTokens.push({
      tokenHash: newRefreshTokenHash,
      createdAt: new Date(),
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await validUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
});

router.post("/logout-all", authMiddleware, logoutAll);
router.post("/logout", authMiddleware, logout);

module.exports = router;
