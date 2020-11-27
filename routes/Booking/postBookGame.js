const Booking = require("../../models/Booking");
const WorkingHour = require("../../models/WorkingHour");
const CreditHistory = require("../../models/CreditHistory");
const User = require("../../models/User");

const plainInfoTemplate = require("../../templates/plainInfo");
const sendEmail = require("../../Helper/Common/sendEmail");

module.exports = async (req, res) => {
  try {
    const { _id: userId, emailAddress, fullName } = req.user;
    const {
      vendorName,
      fullBookingTime,
      fullBookingDate,
      bookingDate,
      fieldId,
      gameHourId,
      vendorId
    } = req.body;

    const selectedGame = await WorkingHour.findOne({ _id: gameHourId });

    if (req.user.credit < selectedGame.price) {
      throw new Error("Oops! Please try again.");
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

    const htmlContent = plainInfoTemplate({
      fullName,
      plainText: `Your booking has been confirmed at ${vendorName} on ${fullBookingDate} ${fullBookingTime}. $${selectedGame.price} has been deducted from your account.`
    });

    await sendEmail({
      htmlContent,
      subject: "Booking Confirmation",
      receiver: emailAddress
    });

    res.json({ amount: -selectedGame.price });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
