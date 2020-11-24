const User = require("../../models/User");
const Booking = require("../../models/Booking");

module.exports = async (req, res) => {
  try {
    const userCount = await User.countDocuments({
      role: "User"
    });

    const vendorCount = await User.countDocuments({
      role: "Vendor"
    });

    const booking = await Booking.aggregate([
      {
        $match: { cancelled: false }
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
          _id: null,
          count: { $sum: 1 },
          amount: { $sum: "$gameDetail.price" }
        }
      }
    ]);

    res.json({ userCount, vendorCount, booking: booking[0] });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
