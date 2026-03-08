const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

//const user = require("../models/user");

router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // if (!password || password.length < 6) {
    //   return res.status(404).json({ error: "password must be atleast " });
    // }

    // const existingUser = await User.findOne({ username });
    // if (existingUser) {
    //   res.status(404).json({ error: "user already exist" });
    // }
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

    res.status(200).json({ message: "login successfll", accessToken });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
