const CreditHistory = require("../../models/CreditHistory");

module.exports = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { startDate, endDate } = req.query;

    const creditHistories = await CreditHistory.find(
      {
        user: userId,
        transactionDate: { $gte: startDate, $lt: endDate }
      },
      { __v: 0 }
    )
      .sort({ transactionDate: 1 })
      .populate({ path: "user", select: "-hash -salt" });

    res.json(creditHistories);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
