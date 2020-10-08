const Review = require("../../models/Review");

module.exports = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { _id: userId } = req.user;
    const { rating, comment } = req.body;

    const newReview = new Review({
      user: userId,
      vendor: vendorId,
      reviewDate: new Date(),
      createdAt: new Date(),
      rating,
      comment
    });

    const savedReview = await newReview.save();

    res.json(savedReview);
  } catch (error) {
    const { name, message } = error;
    if (name === "Error") {
      res.status(409).json({ message });
    } else {
      res.status(409).json({ message: "User has already reviewed." });
    }
  }
};
