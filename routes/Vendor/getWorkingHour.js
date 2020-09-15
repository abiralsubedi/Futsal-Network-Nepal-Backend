const WorkingHour = require("../../models/WorkingHour");

module.exports = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { dayId } = req.query;

    const selectedHours = await WorkingHour.find(
      {
        vendor: vendorId,
        day: dayId
      },
      { __v: 0 }
    ).populate({ path: "clock" });

    res.json(selectedHours);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
