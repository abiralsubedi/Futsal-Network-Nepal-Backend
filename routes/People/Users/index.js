const { Router } = require("express");
const router = Router();
const { ObjectId } = require("mongoose").Types;

const User = require("../../../models/User");
const { requireLogin, verifyAdmin } = require("../../../config/passport");
const { genPassword } = require("../../../utils/passwordCrypt");

router.get("/", requireLogin, verifyAdmin, async (req, res) => {
  try {
    const { searchText } = req.query;
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;

    const searchRegex = { $regex: searchText, $options: "i" };

    const items = await User.find(
      { role: "User", fullName: searchRegex },
      { hash: 0, salt: 0, __v: 0 }
    )
      .collation({ locale: "en" })
      .sort({ fullName: 1 })
      .skip(pageSize * currentPage - pageSize)
      .limit(pageSize);

    const searchCount = await User.countDocuments({
      role: "User",
      fullName: searchRegex
    });

    res.json({ searchCount, items });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.post("/", requireLogin, verifyAdmin, async (req, res) => {
  try {
    const {
      fullName,
      username,
      phone,
      emailAddress,
      credit,
      photoUri,
      newPassword
    } = req.body;

    let otherUser = await User.findOne({
      username
    });
    if (otherUser) {
      throw new Error("Sorry, the username is already taken.");
    }

    otherUser = await User.findOne({
      emailAddress
    });
    if (otherUser) {
      throw new Error("Sorry, the email is already taken.");
    }

    const saltHash = genPassword(newPassword);
    const { salt, hash } = saltHash;

    const newUser = new User({
      fullName,
      username,
      phone,
      emailAddress,
      credit,
      photoUri,
      salt,
      hash,
      createdAt: new Date()
    });
    const savedUser = await newUser.save();

    res.json(savedUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.get("/:userId", requireLogin, verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = await User.findOne(
      { _id: userId, role: "User" },
      { hash: 0, salt: 0, __v: 0 }
    );

    if (!currentUser) {
      throw new Error("Sorry, The user is not found.");
    }

    res.json(currentUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.put("/:userId", requireLogin, verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      fullName,
      username,
      phone,
      emailAddress,
      credit,
      photoUri,
      newPassword
    } = req.body;

    let otherUser = await User.findOne({
      _id: { $ne: ObjectId(userId) },
      username
    });
    if (otherUser) {
      throw new Error("Sorry, the username is already taken.");
    }

    otherUser = await User.findOne({
      _id: { $ne: ObjectId(userId) },
      emailAddress
    });
    if (otherUser) {
      throw new Error("Sorry, the email is already taken.");
    }

    const currentUser = await User.findOne({ _id: userId });
    if (!currentUser) {
      throw new Error("User does not exist");
    }

    if (newPassword && !currentUser.googleId) {
      const saltHash = genPassword(newPassword);
      const { salt, hash } = saltHash;

      await User.updateOne({ _id: userId }, { $set: { salt, hash } });
    }

    const updatedUser = await User.updateOne(
      { _id: userId },
      { $set: { fullName, username, phone, emailAddress, credit, photoUri } }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

module.exports = router;
