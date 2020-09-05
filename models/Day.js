var mongoose = require("mongoose");

var DaysSchema = mongoose.Schema({
  dayNo: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  abbr: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("Day", DaysSchema);
