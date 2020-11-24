const Booking = require("../../models/Booking");

module.exports = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { startDate, endDate } = req.query;
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;

    const items = await Booking.aggregate([
      {
        $match: {
          user: userId,
          bookingDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $lookup: {
          from: "workinghours",
          localField: "workingHour",
          foreignField: "_id",
          as: "workingHour"
        }
      },
      { $unwind: "$workingHour" },
      {
        $lookup: {
          from: "clocks",
          localField: "workingHour.clock",
          foreignField: "_id",
          as: "workingHour.clock"
        }
      },
      { $unwind: "$workingHour.clock" },
      {
        $sort: {
          bookingDate: 1,
          "workingHour.clock.clockNo": 1
        }
      },
      { $skip: pageSize * currentPage - pageSize },
      {
        $limit: pageSize
      },
      {
        $lookup: {
          from: "users",
          localField: "vendor",
          foreignField: "_id",
          as: "vendor"
        }
      },
      { $unwind: "$vendor" },
      {
        $lookup: {
          from: "fields",
          localField: "field",
          foreignField: "_id",
          as: "field"
        }
      },
      { $unwind: "$field" },
      {
        $project: {
          "vendor.hash": 0,
          "vendor.salt": 0
        }
      }
    ]);

    const searchCount = await Booking.countDocuments({
      user: userId,
      bookingDate: { $gte: startDate, $lte: endDate }
    });

    res.json({ searchCount, items });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
