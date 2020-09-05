var mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

var BookingSchema = mongoose.Schema({
  user: {
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
  }
});

BookingSchema.index(
  { bookingDate: 1, field: 1, workingHour: 1 },
  { unique: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
