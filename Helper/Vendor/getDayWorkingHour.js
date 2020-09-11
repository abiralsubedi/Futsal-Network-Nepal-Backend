const WorkingHour = require("../../models/WorkingHour");

module.exports = async ({ vendorId, dayId }) => {
  try {
    const selectedHours = await WorkingHour.find(
      {
        vendor: vendorId,
        day: dayId
      },
      { __v: 0 }
    ).populate({ path: "clock" });
    return selectedHours;
  } catch (error) {
    return "error";
  }
};
