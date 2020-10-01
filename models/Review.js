var mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

var ReviewSchema = mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User"
  },
  vendor: {
    type: ObjectId,
    ref: "User"
  },
  reviewDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    default: ""
  }
});

ReviewSchema.index({ user: 1, vendor: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);
