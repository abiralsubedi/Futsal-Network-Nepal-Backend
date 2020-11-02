const { Router } = require("express");
const router = Router();
const { ObjectId } = require("mongoose").Types;

const User = require("../../../models/User");
const Field = require("../../../models/Field");
const Day = require("../../../models/Day");
const Clock = require("../../../models/Clock");
const WorkingHour = require("../../../models/WorkingHour");
const VendorInfo = require("../../../models/VendorInfo");
const { requireLogin, verifyAdmin } = require("../../../config/passport");
const { genPassword } = require("../../../utils/passwordCrypt");

router.get("/", requireLogin, verifyAdmin, async (req, res) => {
  try {
    const { searchText } = req.query;
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;

    const searchRegex = { $regex: searchText, $options: "i" };

    const items = await User.find(
      { role: "Vendor", fullName: searchRegex },
      { hash: 0, salt: 0, __v: 0 }
    )
      .collation({ locale: "en" })
      .sort({ fullName: 1 })
      .skip(pageSize * currentPage - pageSize)
      .limit(pageSize);

    const searchCount = await User.countDocuments({
      role: "Vendor",
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
      location,
      emailAddress,
      photoUri,
      newPassword,
      phone,
      fields,
      startPeriod,
      endPeriod,
      price
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

    if (price <= 0) {
      throw new Error("Price needs to be greater than 0");
    }

    if (endPeriod.clockNo < startPeriod.clockNo) {
      throw new Error("End game can not be earlier than start game");
    }

    const saltHash = genPassword(newPassword);
    const { salt, hash } = saltHash;

    const newUser = new User({
      fullName,
      username,
      location,
      emailAddress,
      photoUri,
      salt,
      hash,
      phone,
      role: "Vendor",
      createdAt: new Date()
    });
    const savedUser = await newUser.save();

    const vendorId = savedUser._id;

    const updatedFields = (fields || []).map(field => ({
      ...field,
      vendor: vendorId
    }));

    await Field.insertMany(updatedFields);

    const dayRange = await Day.find({});

    const clockRange = await Clock.find({
      clockNo: { $gte: startPeriod.clockNo, $lte: endPeriod.clockNo }
    });

    const vendorHours = [];
    (dayRange || []).forEach(day => {
      (clockRange || []).forEach(hour => {
        vendorHours.push({
          vendor: vendorId,
          day: day._id,
          clock: hour._id,
          price
        });
      });
    });

    await WorkingHour.insertMany(vendorHours);

    const newVendorInfo = new VendorInfo({
      vendor: vendorId,
      description: "",
      gallery: []
    });

    await newVendorInfo.save();

    res.json(savedUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.get("/:userId", requireLogin, verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = await User.findOne(
      { _id: userId, role: "Vendor" },
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
      photoUri,
      newPassword,
      phone
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
      {
        $set: {
          fullName,
          username,
          location,
          emailAddress,
          photoUri,
          phone
        }
      }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

module.exports = router;
