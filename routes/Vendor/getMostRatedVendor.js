const Review = require("../../models/Review");
const User = require("../../models/User");

module.exports = async (req, res) => {
  try {
    const ratedVendor = await Review.aggregate([
      {
        $group: {
          _id: "$vendor",
          rating: { $avg: "$rating" },
          totalReview: { $sum: 1 }
        }
      },
      {
        $match: { totalReview: { $gte: 1 } }
      },
      {
        $sort: { rating: -1, totalReview: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "vendor"
        }
      },
      { $unwind: "$vendor" },
      {
        $project: {
          "vendor.hash": 0,
          "vendor.salt": 0
        }
      }
    ]);

    res.json(ratedVendor);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
