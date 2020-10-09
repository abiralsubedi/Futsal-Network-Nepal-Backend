const Review = require("../../models/Review");
const { ObjectId } = require("mongoose").Types;

module.exports = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { _id: userId } = req.user;

    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;

    const review = await Review.find(
      { vendor: vendorId, user: { $ne: ObjectId(userId) } },
      { __v: 0 }
    )
      .sort({ reviewDate: -1 })
      .skip(pageSize * currentPage - pageSize)
      .limit(pageSize)
      .populate({ path: "user", select: "-hash -salt" });

    res.json(review);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
