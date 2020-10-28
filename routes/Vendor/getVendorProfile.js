const User = require("../../models/User");

module.exports = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const profile = await User.findOne(
      { _id: vendorId },
      { __v: 0, hash: 0, salt: 0 }
    );

    res.json(profile);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
