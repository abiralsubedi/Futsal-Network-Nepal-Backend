const Booking = require("../../models/Booking");
const WorkingHour = require("../../models/WorkingHour");
const CreditHistory = require("../../models/CreditHistory");
const User = require("../../models/User");

module.exports = async (req, res) => {
  try {
    const { searchText } = req.query;
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;

    const searchRegex = { $regex: searchText, $options: "i" };

    const items = await User.find(
      { fullName: searchRegex, role: "User" },
      { hash: 0, salt: 0, __v: 0 }
    )
      .collation({ locale: "en" })
      .sort({ fullName: 1 })
      .skip(pageSize * currentPage - pageSize)
      .limit(pageSize);

    const searchCount = await User.countDocuments({
      fullName: searchRegex,
      role: "User"
    });

    res.json({ searchCount, items });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
