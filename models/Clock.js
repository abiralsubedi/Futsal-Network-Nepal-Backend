var mongoose = require("mongoose");

var ClocksSchema = mongoose.Schema({
  clockNo: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("Clock", ClocksSchema);
