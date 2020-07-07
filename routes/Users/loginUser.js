const User = require("../../models/User");
const { issueJWT, validPassword } = require("../../utils/passwordCrypt");

module.exports = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new Error("Username and password are required.");
    }

    const user =
      (await User.findOne({ username: username })) ||
      (await User.findOne({ emailAddress: username }));
    if (!user) {
      throw new Error("Username or password is incorrect");
    }
    const isValid = validPassword(password, user.hash, user.salt);
    if (!isValid) {
      throw new Error("Username or password is incorrect");
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
