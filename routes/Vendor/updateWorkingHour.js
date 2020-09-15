const WorkingHour = require("../../models/WorkingHour");

module.exports = async (req, res) => {
  try {
    const { gameHourId, gameHour, price, disabled } = req.body;

    if (price <= 0) {
      throw new Error("Price needs to be greater than 0");
    }
    const updatedHour = await WorkingHour.updateOne(
      { _id: gameHourId },
      { $set: { clock: gameHour._id, price, disabled } }
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
};
