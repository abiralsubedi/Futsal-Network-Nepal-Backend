const { Router } = require("express");
const router = Router();

const getUserBookingDetail = require("./getUserBookingDetail");
const postBookGame = require("./postBookGame");
const deleteBooking = require("./deleteBooking");

const { requireLogin, verifyUser } = require("../../config/passport");

router.get("/", requireLogin, getUserBookingDetail);
router.post("/", requireLogin, verifyUser, postBookGame);

router.delete("/:bookingId", requireLogin, deleteBooking);

module.exports = router;
