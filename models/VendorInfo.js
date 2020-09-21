var mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const GallerySchema = new mongoose.Schema({
  photoUri: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ""
  }
});

var VendorInfoSchema = new mongoose.Schema({
  vendor: {
    type: ObjectId,
    ref: "User",
    unique: true
  },
  description: {
    type: String,
    default: ""
  },
  gallery: [GallerySchema]
});

module.exports = mongoose.model("VendorInfo", VendorInfoSchema);
