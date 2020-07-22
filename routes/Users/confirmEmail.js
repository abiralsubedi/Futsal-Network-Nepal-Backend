const User = require("../../models/User");
const { validPassword } = require("../../utils/passwordCrypt");
const getJWTPayload = require("../../utils/getJWTPayload");

module.exports = async (req, res) => {
  try {
    const { newEmail } = getJWTPayload(req.headers.authorization);

    const { password } = req.body;
    const { _id: userId } = req.user;
    if (!password) {
      throw new Error("Password is required.");
    }

    if (!newEmail) {
      throw new Error("Sorry token is invalid");
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User does not exist");
    }

    if (user.googleId) {
      throw new Error("Sorry it is not available for google logged in user.");
    }

    const isValid = validPassword(password, user.hash, user.salt);
    if (!isValid) {
      throw new Error("Password is incorrect");
    }

    await User.updateOne({ _id: userId }, { $set: { emailAddress: newEmail } });
    res.json({ success: true, message: "Email updated successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
