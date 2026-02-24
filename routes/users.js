const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
//const user = require("../models/user");

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!password || password.length < 6) {
      return res.status(404).json({ error: "password must be atleast " });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(404).json({ error: "user already exist" });
    }
    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound);

    const user = new User({ username, passwordHash });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
