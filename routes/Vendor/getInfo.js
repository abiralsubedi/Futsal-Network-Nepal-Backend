const VendorInfo = require("../../models/VendorInfo");

module.exports = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const selectedVendorInfo = await VendorInfo.findOne(
      {
        vendor: vendorId
      },
      { __v: 0 }
    );

    res.json(selectedVendorInfo);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
