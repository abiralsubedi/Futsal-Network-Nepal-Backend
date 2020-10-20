const Booking = require("../../models/Booking");
const WorkingHour = require("../../models/WorkingHour");
const CreditHistory = require("../../models/CreditHistory");
const User = require("../../models/User");

module.exports = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { bookingDate, fieldId, gameHourId, vendorId } = req.body;

    const selectedGame = await WorkingHour.findOne({ _id: gameHourId });

    if (req.user.credit < selectedGame.price) {
      throw new Error("You do not have enough balance.");
    }

    const newBooking = new Booking({
      user: userId,
      vendor: vendorId,
      bookingDate: new Date(bookingDate),
      field: fieldId,
      workingHour: gameHourId
    });

    await newBooking.save();

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
