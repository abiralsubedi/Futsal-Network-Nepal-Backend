const User = require("../../models/User");

module.exports = async (req, res) => {
  try {
    const { searchText } = req.query;

    const searchRegex = { $regex: searchText, $options: "i" };

    const items = await User.find(
      { role: "Vendor", fullName: searchRegex },
      { hash: 0, salt: 0, __v: 0 }
    )
      .collation({ locale: "en" })
      .sort({ fullName: 1 });

    res.json(items);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
