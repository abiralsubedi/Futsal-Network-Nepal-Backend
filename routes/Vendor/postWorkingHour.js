const WorkingHour = require("../../models/WorkingHour");

module.exports = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { gameHour, price, dayId, disabled } = req.body;

    if (price <= 0) {
      throw new Error("Price needs to be greater than 0");
    }

    const newHour = new WorkingHour({
      vendor: vendorId,
      day: dayId,
      clock: gameHour._id,
      price,
      disabled
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
};
