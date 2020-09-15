const Field = require("../../models/Field");

module.exports = async (req, res) => {
  try {
    const { fieldId, name, disabled } = req.body;

    const updatedField = await Field.updateOne(
      { _id: fieldId },
      { $set: { name, disabled } }
    );

    res.json(updatedField);
  } catch (error) {
    const { name, message } = error;
    if (name === "Error") {
      res.status(409).json({ message });
    } else {
      res.status(409).json({ message: "Field name already exists" });
    }
  }
};
