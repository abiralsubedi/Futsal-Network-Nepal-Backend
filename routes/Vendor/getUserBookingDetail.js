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
      .sort({ bookingDate: 1 })
      .populate({ path: "vendor", select: "-hash -salt" })
      .populate({
        path: "workingHour",
        populate: { path: "clock" },
        options: { sort: { price: 1 } }
      })
      .skip(pageSize * currentPage - pageSize)
      .limit(pageSize);
    const searchCount = await Booking.countDocuments({
      user: userId,
      bookingDate: { $gte: startDate, $lt: endDate }
    });

    res.json({ searchCount, items });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
