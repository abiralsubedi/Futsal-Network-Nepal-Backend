const User = require("../../models/User");
const calculateDistance = require("../../utils/calculateDistance");

module.exports = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { lat, lng } = req.query;

    const selectedUser = await User.findOne(
      {
        _id: vendorId
      },
      { __v: 0 }
    );

    const userLocation = `${lat},${lng}`;
    const { lat: latitude, lng: longitude } = selectedUser.location.coordinates;
    const vendorLocation = `${latitude},${longitude}`;

    const distance = await calculateDistance(userLocation, vendorLocation);

    res.json({ distance });
  } catch (error) {
    console.log(error, "er");
    res.status(409).json({ message: error.message });
  }
};
