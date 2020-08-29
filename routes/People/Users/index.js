const { Router } = require("express");
const router = Router();
const { ObjectId } = require("mongoose").Types;

const User = require("../../../models/User");
const { requireLogin, verifyAdmin } = require("../../../config/passport");
const { validPassword, genPassword } = require("../../../utils/passwordCrypt");

router.get("/", requireLogin, verifyAdmin, async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { searchText } = req.query;
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;

    const currentUser = await User.findOne({ _id: userId });

    if (!currentUser || currentUser.role !== "Admin") {
      throw new Error("You are not authorized");
    }

    const searchRegex = { $regex: searchText, $options: "i" };

    const items = await User.find(
      { fullName: searchRegex, role: "User" },
      { hash: 0, salt: 0, __v: 0 }
    )
      .collation({ locale: "en" })
      .sort({ fullName: 1 })
      .skip(pageSize * currentPage - pageSize)
      .limit(pageSize);

    const searchCount = await User.countDocuments({
      fullName: searchRegex,
      role: "User"
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
      location,
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
      location,
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
      location,
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
      { $set: { fullName, username, location, emailAddress, credit, photoUri } }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

module.exports = router;
