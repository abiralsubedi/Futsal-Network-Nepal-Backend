const User = require("../../models/User");
const { genPassword, issueJWT } = require("../../utils/passwordCrypt");
const generateRandomString = require("../../utils/generateRandomString");

module.exports = async (req, res) => {
  try {
    const { emailAddress, password, fullName, location } = req.body;
    if (!emailAddress || !password || !fullName || !location) {
      throw new Error("All fields are mandatory.");
    }

    if (!/^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress)) {
      throw new Error("Email is invalid");
    }
    const oldUser = await User.findOne({ emailAddress: req.body.emailAddress });
    if (oldUser) {
      throw new Error("User already exists");
    }
    const saltHash = genPassword(req.body.password);
    const { salt, hash } = saltHash;

    let [username] = emailAddress.split("@");
    if (await User.findOne({ username })) {
      username = username + `-${generateRandomString()}`;
    }
    const newUser = new User({
      username,
      emailAddress,
      fullName,
      location,
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
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
