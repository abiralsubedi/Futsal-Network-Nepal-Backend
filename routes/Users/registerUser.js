const User = require("../../models/User");
const { genPassword, issueJWT } = require("../../utils/passwordCrypt");

module.exports = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      throw new Error("Username and password are required.");
    }
    const oldUser = await User.findOne({ username: req.body.username });
    if (oldUser) {
      throw new Error("User already exists");
    }
    const saltHash = genPassword(req.body.password);

    const { salt, hash } = saltHash;
    const newUser = new User({
      username: req.body.username,
      hash: hash,
      salt: salt,
      googleId: ""
    });

    const savedUser = await newUser.save();
    const jwt = issueJWT(savedUser);
    res.json({
      success: true,
      user: savedUser,
      token: jwt.token,
      expiresIn: jwt.expires
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
