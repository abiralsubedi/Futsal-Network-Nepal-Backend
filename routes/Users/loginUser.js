const User = require("../../models/User");
const { issueJWT, validPassword } = require("../../utils/passwordCrypt");

module.exports = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      throw new Error("Username and password are required.");
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      throw new Error("Incorrect");
    }
    const isValid = validPassword(req.body.password, user.hash, user.salt);
    if (!isValid) {
      throw new Error("Incorrect");
    }

    const tokenObject = issueJWT(user);
    res.json({
      success: true,
      user: user,
      token: tokenObject.token,
      expires: tokenObject.expiresIn
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
