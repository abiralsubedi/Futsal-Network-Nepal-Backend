const { Router } = require("express");
const router = Router();

const searchVendor = require("./searchVendor");
const getAvailableField = require("./getAvailableField");
const getAvailableGame = require("./getAvailableGame");

const postBookGame = require("./postBookGame");
const getVendorBookingDetail = require("./getVendorBookingDetail");
const getUserBookingDetail = require("./getUserBookingDetail");

const getWorkingHour = require("./getWorkingHour");
const postWorkingHour = require("./postWorkingHour");
const updateWorkingHour = require("./updateWorkingHour");
const deleteWorkingHour = require("./deleteWorkingHour");

const getField = require("./getField");
const postField = require("./postField");
const updateField = require("./updateField");

const getInfo = require("./getInfo");
const updateDescription = require("./updateDescription");
const updateGallery = require("./updateGallery");

const getReviewDetail = require("./getReviewDetail");
const getReview = require("./getReview");
const postReview = require("./postReview");
const updateReview = require("./updateReview");
const deleteReview = require("./deleteReview");

const {
  requireLogin,
  verifyAdminVendor,
  verifyUser,
  verifyAdminUser
} = require("../../config/passport");

router.get("/search", requireLogin, searchVendor);
router.get("/:vendorId/available-field", requireLogin, getAvailableField);
router.get("/:vendorId/available-game", requireLogin, getAvailableGame);

router.post("/:vendorId/book-game", requireLogin, verifyUser, postBookGame);
router.get("/:vendorId/booking-detail", requireLogin, getVendorBookingDetail);
router.get("/booking-detail", requireLogin, getUserBookingDetail);

router.get(
  "/:vendorId/working-hour",
  requireLogin,
  verifyAdminVendor,
  getWorkingHour
);

router.post(
  "/:vendorId/working-hour",
  requireLogin,
  verifyAdminVendor,
  postWorkingHour
);

router.put(
  "/:vendorId/working-hour",
  requireLogin,
  verifyAdminVendor,
  updateWorkingHour
);

router.delete(
  "/:vendorId/working-hour",
  requireLogin,
  verifyAdminVendor,
  deleteWorkingHour
);

router.get("/:vendorId/field", requireLogin, verifyAdminVendor, getField);
router.post("/:vendorId/field", requireLogin, verifyAdminVendor, postField);
router.put("/:vendorId/field", requireLogin, verifyAdminVendor, updateField);

router.get("/:vendorId/info", requireLogin, getInfo);
router.put(
  "/:vendorId/description",
  requireLogin,
  verifyAdminVendor,
  updateDescription
);
router.put(
  "/:vendorId/gallery",
  requireLogin,
  verifyAdminVendor,
  updateGallery
);

router.get("/:vendorId/review-detail", requireLogin, getReviewDetail);
router.get("/:vendorId/review", requireLogin, getReview);
router.post("/:vendorId/review", requireLogin, verifyUser, postReview);
router.put("/:vendorId/review", requireLogin, verifyUser, updateReview);
router.delete("/:vendorId/review", requireLogin, verifyAdminUser, deleteReview);

module.exports = router;
