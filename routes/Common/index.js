const { Router } = require("express");
const router = Router();
const Clock = require("../../models/Clock");
const { requireLogin } = require("../../config/passport");

router.get("/clock", requireLogin, async (req, res) => {
  try {
    const allClock = await Clock.find({}, { __v: 0 }).sort({ clockNo: 1 });
    res.json(allClock);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = router;
