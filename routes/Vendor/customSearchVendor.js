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
    let minLat = -90,
      maxLat = 90,
      minLng = -180,
      maxLng = 180;
    if (radius && lat) {
      minLat = lat - boundaryDegree;
      maxLat = lat + boundaryDegree;

      minLng = lng - boundaryDegree;
      maxLng = lng + boundaryDegree;
    }

    const searchRegex = { $regex: vendorName, $options: "i" };

    let customVendors = await User.aggregate([
      {
        $match: {
          role: "Vendor",
          fullName: searchRegex,
          "location.coordinates.lat": { $gt: minLat, $lt: maxLat },
          "location.coordinates.lng": { $gt: minLng, $lt: maxLng }
        }
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "vendor",
          as: "review"
        }
      },
      {
        $unwind: {
          path: "$review",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$_id",
          rating: { $avg: "$review.rating" },
          totalReview: { $sum: 1 }
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
      { $unwind: "$vendor" },
      {
        $sort: { rating: -1, totalReview: -1, "vendor.fullName": 1 }
      }
    ]);

    customVendors = customVendors.map(item => {
      if (item.rating === null) {
        return { ...item, rating: 0, totalReview: 0 };
      }
      return item;
    });

    customVendors = customVendors.filter(
      item => item.rating >= minRate && item.rating <= maxRate
    );

    res.json(customVendors);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
