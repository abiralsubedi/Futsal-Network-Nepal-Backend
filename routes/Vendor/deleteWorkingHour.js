const WorkingHour = require("../../models/WorkingHour");

module.exports = async (req, res) => {
  try {
    const { gameHours } = req.body;

    const gameHourId = (gameHours || []).map(game => game._id);

    await WorkingHour.updateMany(
      {
        _id: { $in: gameHourId }
      },
      { $set: { disabled: true } }
    );

    res.json({ success: true });
  } catch (error) {
    const { name, message } = error;
    if (name === "Error") {
      res.status(409).json({ message });
    } else {
      res.status(409).json({ message: "Game hour already exists" });
    }
  }
};
