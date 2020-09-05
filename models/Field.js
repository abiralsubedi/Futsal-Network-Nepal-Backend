var mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

var FieldsSchema = mongoose.Schema({
  vendor: {
    type: ObjectId,
    ref: "User"
  },
  name: {
    type: String,
    required: true
  }
});

FieldsSchema.index({ vendor: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Field", FieldsSchema);
