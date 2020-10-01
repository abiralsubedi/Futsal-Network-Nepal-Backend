const Review = require("../../models/Review");

module.exports = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const selectedReview = await Review.findOne(
      {
        vendor: vendorId
      },
      { __v: 0 }
    );

    const averageRating = await Review.aggregate([
      {
        $match: {
          vendor: vendorId
        }
      },
      {
        $group: {
          _id: null,
          average: { $avg: "$rating" },
          totalReview: { $sum: 1 }
        }
      }
    ]);

    const rateNumber = await Review.aggregate([
      {
        $match: {
          vendor: vendorId
        }
      },
      {
        $group: {
          _id: "$rating",
          totalNumber: { $sum: 1 }
        }
      }
    ]);

    res.json(selectedReview);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
