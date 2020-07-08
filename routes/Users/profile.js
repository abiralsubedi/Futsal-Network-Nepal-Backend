const { Router } = require("express");
const router = Router();
const mongoose = require("mongoose");

const User = require("../../models/User");
const { requireLogin } = require("../../config/passport");

router.get("/", requireLogin, async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await User.findOne(
      { _id: userId },
      { hash: 0, salt: 0, __v: 0 }
    );
    if (!user) {
      throw new Error("User does not exist");
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

router.put("/", requireLogin, async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { fullName, username, location } = req.body;

    const otherUser = await User.findOne({
      _id: { $ne: mongoose.Types.ObjectId(userId) },
      username
    });
    if (otherUser) {
      throw new Error("Sorry, the username is already taken.");
    }

    const updatedUser = await User.updateOne(
      { _id: userId },
      { $set: { fullName, username, location } }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

module.exports = router;
