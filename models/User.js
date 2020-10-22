var { Schema, model } = require("mongoose");

var UserSchema = Schema({
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
  role: {
    type: String,
    default: "User"
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
    type: Schema.Types.Mixed,
    default: { place: "" }
  },
  credit: {
    type: Number,
    default: 0
  },
  phone: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

module.exports = model("User", UserSchema);
