var mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

var CreditHistorySchema = mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User"
  },
  transactionDate: {
    type: Date,
    required: true
  },
  remark: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("CreditHistory", CreditHistorySchema);
