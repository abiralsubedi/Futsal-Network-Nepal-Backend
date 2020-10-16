var mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

var BookingSchema = mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User"
  },
  vendor: {
    type: ObjectId,
    ref: "User"
  },
  bookingDate: {
    type: Date,
    required: true
  },
  field: {
    type: ObjectId,
    ref: "Field"
  },
  workingHour: {
    type: ObjectId,
    ref: "WorkingHour"
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  cancelled: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Booking", BookingSchema);
