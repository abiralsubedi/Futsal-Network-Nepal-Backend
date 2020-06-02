const User = require("../../models/User");
const {
  genPassword,
  issueJWT,
  validPassword
} = require("../../utils/passwordCrypt");

module.exports = async (req, res) => {
  try {
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
  } catch (err) {
    res
      .status(401)
      .json({ success: false, msg: "Incorrect username or password" });
  }
};
