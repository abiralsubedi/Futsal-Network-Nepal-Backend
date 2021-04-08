const Booking = require("../../models/Booking");
const Field = require("../../models/Field");
const Day = require("../../models/Day");
const WorkingHour = require("../../models/WorkingHour");

module.exports = async (req, res) => {
  try {
    const { presentDate, day } = req.query;
    const { _id: vendorId } = req.user;

    const todayBooking = await Booking.countDocuments({
      vendor: vendorId,
      cancelled: false,
      bookingDate: { $eq: new Date(presentDate) }
    });

    const fieldCount = await Field.countDocuments({
      vendor: vendorId,
      disabled: false
    });

    const selectedDay = await Day.findOne({ dayNo: day });

    const todayGames = await WorkingHour.countDocuments({
      vendor: vendorId,
      day: selectedDay._id,
      disabled: false
    });

    const availableBooking = todayGames * fieldCount - todayBooking;

    const booking = await Booking.aggregate([
      {
        $match: { cancelled: false, vendor: vendorId }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 }
        }
      }
    ]);

    res.json({
      todayBooking,
      fieldCount,
      availableBooking,
      totalBooking: booking.length ? booking[0].total : 0
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
