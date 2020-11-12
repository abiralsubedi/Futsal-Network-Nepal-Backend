const User = require("../../models/User");
const Review = require("../../models/Review");

module.exports = async (req, res) => {
  try {
    const { vendorName } = req.query;
    const lat = +req.query.lat;
    const lng = +req.query.lng;
    const radius = +req.query.radius;

    const minRate = +req.query.minRate;
    const maxRate = +req.query.maxRate;

    const boundaryDegree = 0.009009 * radius;
    const minLat = lat - boundaryDegree;
    const maxLat = lat + boundaryDegree;

    const minLng = lng - boundaryDegree;
    const maxLng = lng + boundaryDegree;

    const searchRegex = { $regex: vendorName, $options: "i" };

    let vendors;
    if (radius && lat) {
      vendors = await User.find({
        role: "Vendor",
        "location.coordinates.lat": { $gt: minLat, $lt: maxLat },
        "location.coordinates.lng": { $gt: minLng, $lt: maxLng },
        fullName: searchRegex
      });
    } else {
      vendors = await User.find({ role: "Vendor", fullName: searchRegex });
    }

    const vendorListId = vendors.map(item => item._id);

    const customVendor = await Review.aggregate([
      {
        $group: {
          _id: "$vendor",
          rating: { $avg: "$rating" },
          totalReview: { $sum: 1 }
        }
      },
      {
        $match: {
          _id: { $in: vendorListId }
        }
      },
      {
        $match: { rating: { $gte: minRate, $lte: maxRate } }
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
        $sort: { rating: -1, totalReview: -1, fullName: 1 }
      }
    ]);

    res.json(customVendor);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
