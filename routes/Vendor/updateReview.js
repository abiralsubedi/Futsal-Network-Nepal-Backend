const Review = require("../../models/Review");

module.exports = async (req, res) => {
  try {
    const { reviewId, rating, comment } = req.body;
    const { _id: userId, role } = req.user;

    const oldReview = await Review.findOne({ _id: reviewId });

    if (role === "User" && !oldReview.user.equals(userId)) {
      throw new Error("You are not authorized");
    }

    const updatedReview = await Review.updateOne(
      { _id: reviewId },
      { $set: { rating, comment } }
    );

    res.json(updatedReview);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
