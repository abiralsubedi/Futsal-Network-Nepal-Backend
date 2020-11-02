const VendorInfo = require("../../models/VendorInfo");
const { clearCache } = require("../../services/cache");

module.exports = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { description } = req.body;

    const { _id: userId, role } = req.user;

    if (role === "Vendor" && !userId.equals(vendorId)) {
      throw new Error("You are not authorized.");
    }

    const updatedDescription = await VendorInfo.updateOne(
      { vendor: vendorId },
      { $set: { description } }
    );

    clearCache(`vendor/${vendorId}/info`);
    res.json(updatedDescription);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
