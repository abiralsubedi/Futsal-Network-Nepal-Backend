var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  emailAddress: {
    type: String,
    default: "",
    unique: true
  },
  hash: {
    type: String,
    default: ""
  },
  salt: {
    type: String,
    default: ""
  },
  googleId: {
    type: String,
    default: ""
  },
  fullName: {
    type: String,
    required: true
  },
  photoUri: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    default: ""
  },
  credit: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("User", UserSchema);
