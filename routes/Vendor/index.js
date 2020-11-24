const { Router } = require("express");
const router = Router();

const searchVendor = require("./searchVendor");
const customSearchVendor = require("./customSearchVendor");
const getNearbyVendor = require("./getNearbyVendor");
const getMostRatedVendor = require("./getMostRatedVendor");
const getVendorDistance = require("./getVendorDistance");

const getDashboardInfo = require("./getDashboardInfo");
const getCurrentBooking = require("./getCurrentBooking");
const getAvailableField = require("./getAvailableField");
const getAvailableGame = require("./getAvailableGame");

const getVendorBookingDetail = require("./getVendorBookingDetail");
const getVendorProfile = require("./getVendorProfile");

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
  verifyAdminUser,
  verifyVendor
} = require("../../config/passport");

router.get("/search", requireLogin, searchVendor);
router.get("/custom-search", requireLogin, customSearchVendor);
router.get("/nearby", requireLogin, getNearbyVendor);
router.get("/most-rated", requireLogin, getMostRatedVendor);
router.get("/:vendorId/distance", requireLogin, getVendorDistance);

router.get("/dashboard-info", requireLogin, verifyVendor, getDashboardInfo);
router.get("/current-booking", requireLogin, verifyVendor, getCurrentBooking);
router.get("/:vendorId/available-field", requireLogin, getAvailableField);
router.get("/:vendorId/available-game", requireLogin, getAvailableGame);

router.get("/:vendorId/booking", requireLogin, getVendorBookingDetail);
router.get("/:vendorId/profile", requireLogin, getVendorProfile);

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
