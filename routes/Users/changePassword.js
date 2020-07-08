const User = require("../../models/User");
const { validPassword, genPassword } = require("../../utils/passwordCrypt");

module.exports = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { _id: userId } = req.user;
    if (!oldPassword || !newPassword) {
      throw new Error("Old and new password are required.");
    }

    if (oldPassword === newPassword) {
      throw new Error("Both password can not be same");
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User does not exist");
    }

    if (user.googleId) {
      throw new Error("Sorry it is not available for google logged in user.");
    }

    const isValid = validPassword(oldPassword, user.hash, user.salt);
    if (!isValid) {
      throw new Error("Old password is incorrect");
    }

    const saltHash = genPassword(newPassword);
    const { salt, hash } = saltHash;

    await User.updateOne({ _id: userId }, { $set: { salt, hash } });
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
