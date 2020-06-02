const User = require("../../models/User");
const { genPassword, issueJWT } = require("../../utils/passwordCrypt");

module.exports = async (req, res) => {
  try {
    const saltHash = genPassword(req.body.password);

    const { salt, hash } = saltHash;
    const newUser = new User({
      username: req.body.username,
      hash: hash,
      salt: salt
    });

    const savedUser = await newUser.save();
    const jwt = issueJWT(savedUser);
    res.json({
      success: true,
      user: savedUser,
      token: jwt.token,
      expiresIn: jwt.expires
    });
  } catch (err) {
    res.json({ message: err });
  }
};
