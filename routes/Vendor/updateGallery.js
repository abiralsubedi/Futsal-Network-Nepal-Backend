const VendorInfo = require("../../models/VendorInfo");
const { clearCache } = require("../../services/cache");

module.exports = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { gallery } = req.body;

    if (gallery.length > 5) {
      throw new Error("Only up to 5 images are allowed.");
    }

    const { _id: userId, role } = req.user;

    if (role === "Vendor" && !userId.equals(vendorId)) {
      throw new Error("You are not authorized.");
    }

    const updatedGallery = await VendorInfo.updateOne(
      { vendor: vendorId },
      { $set: { gallery } }
    );

    clearCache(`vendor/${vendorId}/info`);
    res.json(updatedGallery);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
