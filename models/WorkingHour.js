var mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

var WorkingHourSchema = mongoose.Schema({
  vendor: {
    type: ObjectId,
    ref: "User"
  },
  day: {
    type: ObjectId,
    ref: "Day"
  },
  clock: {
    type: ObjectId,
    ref: "Clock"
  },
  price: {
    type: Number,
    required: true
  }
});

WorkingHourSchema.index({ vendor: 1, day: 1, clock: 1 }, { unique: true });

module.exports = mongoose.model("WorkingHour", WorkingHourSchema);
