const Booking = require("../../models/Booking");

module.exports = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { startDate, endDate } = req.query;
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;

    const items = await Booking.find(
      { user: userId, bookingDate: { $gte: startDate, $lt: endDate } },
      { __v: 0 }
    )
      .populate({ path: "vendor", select: "-hash -salt" })
      .populate({ path: "field", select: "-__v" })
      .populate({
        path: "workingHour",
        populate: { path: "clock" }
      })
      .sort({ bookingDate: 1 });

    items.sort((a, b) => {
      if (
        new Date(a.bookingDate).toDateString() ===
        new Date(b.bookingDate).toDateString()
      ) {
        return a.workingHour.clock.clockNo - b.workingHour.clock.clockNo;
      }
      return 0;
    });

    const updatedItems = items.splice(
      pageSize * currentPage - pageSize,
      pageSize
    );

    const searchCount = await Booking.countDocuments({
      user: userId,
      bookingDate: { $gte: startDate, $lt: endDate }
    });

    res.json({ searchCount, items: updatedItems });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
