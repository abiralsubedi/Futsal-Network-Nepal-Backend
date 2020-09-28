const VendorInfo = require("../../models/VendorInfo");

module.exports = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { gallery } = req.body;

    if (gallery.length > 5) {
      throw new Error("Only up to 5 images are allowed.");
    }

    const updatedGallery = await VendorInfo.updateOne(
      { vendor: vendorId },
      { $set: { gallery } }
    );

    res.json(updatedGallery);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
