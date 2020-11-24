const Booking = require("../../models/Booking");

module.exports = async (req, res) => {
  try {
    const { presentDate } = req.query;
    const { _id: vendorId } = req.user;

    const booking = await Booking.aggregate([
      {
        $match: {
          vendor: vendorId,
          cancelled: false,
          bookingDate: { $eq: new Date(presentDate) }
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
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
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
          "vendor.salt": 0,
          "user.hash": 0,
          "user.salt": 0
        }
      },
      {
        $sort: {
          "workingHour.clock.clockNo": 1
        }
      }
    ]);

    res.json(booking);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
