const { Router } = require("express");
const router = Router();

const { requireLogin, verifyAdmin } = require("../../config/passport");

const getDashboardInfo = require("./getDashboardInfo");
const getCurrentBooking = require("./getCurrentBooking");

router.get("/dashboard-info", requireLogin, verifyAdmin, getDashboardInfo);
router.get("/current-booking", requireLogin, verifyAdmin, getCurrentBooking);

module.exports = router;
