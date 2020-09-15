const { Router } = require("express");
const router = Router();

const getWorkingHour = require("./getWorkingHour");
const postWorkingHour = require("./postWorkingHour");
const updateWorkingHour = require("./updateWorkingHour");
const deleteWorkingHour = require("./deleteWorkingHour");

const getField = require("./getField");
const postField = require("./postField");
const updateField = require("./updateField");

const { requireLogin, verifyAdminVendor } = require("../../config/passport");

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

module.exports = router;
