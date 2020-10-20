const Booking = require("../../models/Booking");
const User = require("../../models/User");
const CreditHistory = require("../../models/CreditHistory");

module.exports = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { _id: userId, role } = req.user;

    const oldBooking = await Booking.findOne({ _id: bookingId }).populate(
      "workingHour"
    );

    if (oldBooking.cancelled) {
      throw new Error("Booking is already cancelled");
    }

    if (role === "User" && !oldBooking.user.equals(userId)) {
      throw new Error("You are not authorized");
    }

    if (role === "Vendor" && !oldBooking.vendor.equals(userId)) {
      throw new Error("You are not authorized");
    }

    await Booking.updateOne({ _id: bookingId }, { $set: { cancelled: true } });
    const requiredUserId = role === "User" ? userId : oldBooking.user;
    const bookingPrice = oldBooking.workingHour.price;

    const requiredUser = await User.findOne({ _id: requiredUserId });

    let newCredit = requiredUser.credit + bookingPrice;
    newCredit = Math.round(newCredit * 100) / 100;
    await User.updateOne(
      { _id: requiredUserId },
      { $set: { credit: newCredit } }
    );

    const newCreditTransaction = new CreditHistory({
      user: requiredUserId,
      transactionDate: new Date(),
      remark: "Refund for booking cancellation",
      amount: bookingPrice
    });

    await newCreditTransaction.save();

    res.json({ amount: bookingPrice });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
