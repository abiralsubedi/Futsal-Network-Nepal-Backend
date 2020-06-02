var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
  username: {
    type: String,
    default: ""
  },
  hash: {
    type: String,
    default: ""
  },
  salt: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Users", UserSchema);
