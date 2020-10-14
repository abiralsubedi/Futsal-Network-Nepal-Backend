const Field = require("../../models/Field");

module.exports = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const selectedField = await Field.find(
      {
        vendor: vendorId,
        disabled: false
      },
      { __v: 0 }
    );

    res.json(selectedField);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
