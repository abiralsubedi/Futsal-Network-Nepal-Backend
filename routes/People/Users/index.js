const { Router } = require("express");
const router = Router();
const mongoose = require("mongoose");

const User = require("../../../models/User");
const { requireLogin } = require("../../../config/passport");

router.get("/", requireLogin, async (req, res) => {
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

    const searchCount = await User.count({ fullName: searchRegex });

    res.json({ searchCount, items });
  } catch (error) {
    res.status(409).json({ message: error.message });
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

router.put("/picture", requireLogin, async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { updatedUri } = req.body;

    const updatedUser = await User.updateOne(
      { _id: userId },
      { $set: { photoUri: updatedUri } }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = router;
