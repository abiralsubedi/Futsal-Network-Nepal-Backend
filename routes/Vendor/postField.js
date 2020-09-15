const Field = require("../../models/Field");

module.exports = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { name, disabled } = req.body;

    const newField = new Field({
      vendor: vendorId,
      name,
      disabled
    });

    const savedField = await newField.save();

    res.json(savedField);
  } catch (error) {
    const { name, message } = error;
    if (name === "Error") {
      res.status(409).json({ message });
    } else {
      res.status(409).json({ message: "Field name already exists" });
    }
  }
};
