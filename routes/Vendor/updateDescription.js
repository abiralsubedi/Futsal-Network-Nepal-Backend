const VendorInfo = require("../../models/VendorInfo");

module.exports = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { description } = req.body;

    const updatedDescription = await VendorInfo.updateOne(
      { vendor: vendorId },
      { $set: { description } }
    );

    res.json(updatedDescription);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
