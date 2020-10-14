const Booking = require("../../models/Booking");
const WorkingHour = require("../../models/WorkingHour");
const CreditHistory = require("../../models/CreditHistory");
const User = require("../../models/User");

module.exports = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { bookingDate, fieldId, gameHourId } = req.body;

    const newBooking = new Booking({
      user: userId,
      bookingDate: new Date(bookingDate),
      field: fieldId,
      workingHour: gameHourId
    });

    const selectedGame = await WorkingHour.findOne({ _id: gameHourId });

    let newCredit = req.user.credit - selectedGame.price;
    newCredit = Math.round(newCredit * 100) / 100;
    await User.updateOne({ _id: userId }, { $set: { credit: newCredit } });

    const newCreditTransaction = new CreditHistory({
      user: userId,
      transactionDate: new Date(),
      remark: "Deduction for booking",
      amount: -selectedGame.price
    });

    await newCreditTransaction.save();

    await newBooking.save();
    res.json({ amount: -selectedGame.price });
  } catch (error) {
    const { name, message } = error;
    if (name === "Error") {
      res.status(409).json({ message });
    } else {
      res.status(409).json({ message: "Booking already exists." });
    }
  }
};
