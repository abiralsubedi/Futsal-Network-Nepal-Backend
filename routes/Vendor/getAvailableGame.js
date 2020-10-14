const WorkingHour = require("../../models/WorkingHour");
const Day = require("../../models/Day");
const Booking = require("../../models/Booking");

module.exports = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { day, fieldId, bookingDate } = req.query;

    const selectedDay = await Day.findOne({ dayNo: day });

    const selectedHours = await WorkingHour.find(
      {
        vendor: vendorId,
        day: selectedDay._id,
        disabled: false
      },
      { __v: 0 }
    ).populate({ path: "clock" });

    const reqDate = new Date(bookingDate);

    const currentFieldBooking = await Booking.find({
      field: fieldId,
      bookingDate: { $eq: reqDate }
    });

    const filteredHours = (selectedHours || []).filter(item => {
      if (
        currentFieldBooking.some(bookHour =>
          bookHour.workingHour.equals(item._id)
        )
      ) {
        return false;
      }
      return true;
    });

    res.json(filteredHours);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
