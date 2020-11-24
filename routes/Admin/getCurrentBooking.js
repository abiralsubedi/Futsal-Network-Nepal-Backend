const Booking = require("../../models/Booking");

module.exports = async (req, res) => {
  try {
    const { presentDate } = req.query;

    const booking = await Booking.aggregate([
      {
        $match: {
          cancelled: false,
          bookingDate: { $eq: new Date(presentDate) }
        }
      },
      {
        $lookup: {
          from: "workinghours",
          localField: "workingHour",
          foreignField: "_id",
          as: "gameDetail"
        }
      },
      { $unwind: "$gameDetail" },
      {
        $group: {
          _id: "$vendor",
          count: { $sum: 1 },
          amount: { $sum: "$gameDetail.price" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "vendor"
        }
      },
      {
        $unwind: "$vendor"
      },
      {
        $project: {
          "vendor.hash": 0,
          "vendor.salt": 0
        }
      },
      {
        $sort: {
          count: -1,
          "vendor.fullName": 1
        }
      }
    ]);

    res.json(booking);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
