const User = require("../../models/User");

module.exports = async (req, res) => {
  try {
    const lat = +req.query.lat;
    const lng = +req.query.lng;

    const boundaryDegree = 0.009009 * 5;
    const minLat = lat - boundaryDegree;
    const maxLat = lat + boundaryDegree;

    const minLng = lng - boundaryDegree;
    const maxLng = lng + boundaryDegree;

    const items = await User.find(
      {
        role: "Vendor",
        "location.coordinates.lat": { $gt: minLat, $lt: maxLat },
        "location.coordinates.lng": { $gt: minLng, $lt: maxLng }
      },
      { hash: 0, salt: 0, __v: 0 }
    );

    res.json(items);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
