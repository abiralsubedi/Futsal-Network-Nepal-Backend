const Review = require("../../models/Review");
const { ObjectId } = require("mongoose").Types;

module.exports = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { _id: userId } = req.user;

    let vendorReview = await Review.aggregate([
      {
        $match: {
          vendor: ObjectId(vendorId)
        }
      },
      {
        $group: {
          _id: null,
          rating: { $avg: "$rating" },
          totalReview: { $sum: 1 }
        }
      }
    ]);
    vendorReview = vendorReview[0] || { rating: 0, totalReview: 0 };

    const ratingList = await Review.aggregate([
      {
        $match: {
          vendor: ObjectId(vendorId)
        }
      },
      {
        $group: {
          _id: "$rating",
          totalNumber: { $sum: 1 }
        }
      }
    ]);

    const selfReview =
      (await Review.findOne({ user: userId, vendor: vendorId }, { __v: 0 })) ||
      {};

    const reviewDetail = {
      vendorReview,
      selfReview,
      ratingList
    };

    res.json(reviewDetail);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
