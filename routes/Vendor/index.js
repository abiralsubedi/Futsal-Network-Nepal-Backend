const { Router } = require("express");
const router = Router();

const WorkingHour = require("../../models/WorkingHour");
const getDayWorkingHour = require("../../Helper/Vendor/getDayWorkingHour");
const { requireLogin, verifyAdminVendor } = require("../../config/passport");

router.get(
  "/:vendorId/working-hour",
  requireLogin,
  verifyAdminVendor,
  async (req, res) => {
    try {
      const { vendorId } = req.params;
      const { dayId } = req.query;

      const selectedHours = await getDayWorkingHour({ vendorId, dayId });

      if (selectedHours === "error") {
        throw new Error("failed");
      }
      res.json(selectedHours);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  }
);

router.post(
  "/:vendorId/working-hour",
  requireLogin,
  verifyAdminVendor,
  async (req, res) => {
    try {
      const { vendorId } = req.params;
      const { gameHour, price, dayId } = req.body;

      if (price <= 0) {
        throw new Error("Price needs to be greater than 0");
      }

      const newHour = new WorkingHour({
        vendor: vendorId,
        day: dayId,
        clock: gameHour._id,
        price
      });

      const savedHour = await newHour.save();

      res.json(savedHour);
    } catch (error) {
      const { name, message } = error;
      if (name === "Error") {
        res.status(409).json({ message });
      } else {
        res.status(409).json({ message: "Game hour already exists" });
      }
    }
  }
);

router.put(
  "/:vendorId/working-hour",
  requireLogin,
  verifyAdminVendor,
  async (req, res) => {
    try {
      const { gameHourId, gameHour, price } = req.body;

      if (price <= 0) {
        throw new Error("Price needs to be greater than 0");
      }
      const updatedHour = await WorkingHour.updateOne(
        { _id: gameHourId },
        { $set: { clock: gameHour._id, price } }
      );

      res.json(updatedHour);
    } catch (error) {
      const { name, message } = error;
      if (name === "Error") {
        res.status(409).json({ message });
      } else {
        res.status(409).json({ message: "Game hour already exists" });
      }
    }
  }
);

module.exports = router;
