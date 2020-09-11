const User = require("../../models/User");
const { issueJWT } = require("../../utils/passwordCrypt");
const generateRandomString = require("../../utils/generateRandomString");

const sendEmail = require("../../Helper/Common/sendEmail");
const validateReCaptcha = require("../../Helper/Common/validateReCaptcha");

const singleButtonLink = require("../../templates/singleButtonLink");

const { CLIENT_DOMAIN } = process.env;

module.exports = async (req, res) => {
  try {
    const { emailAddress, fullName, location, reCaptchaValue } = req.body;
    if (!emailAddress || !fullName || !location) {
      throw new Error("All fields are mandatory.");
    }

    if (!/^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress)) {
      throw new Error("Email is invalid");
    }
    const oldUser = await User.findOne({ emailAddress: req.body.emailAddress });
    if (oldUser) {
      throw new Error("User already exists");
    }

    const result = await validateReCaptcha({ reCaptchaValue });
    if (result === "error") {
      throw new Error("Recaptcha is not invalid");
    }

    let [username] = emailAddress.split("@");
    if (await User.findOne({ username })) {
      username = username + `-${generateRandomString()}`;
    }
    const newUser = new User({
      username,
      emailAddress,
      fullName,
      location,
      createdAt: new Date()
    });

    const savedUser = await newUser.save();
    const jwt = issueJWT(savedUser, { setNewPassword: true });

    const htmlContent = singleButtonLink({
      fullName,
      plainText:
        "Your account has been successfully created. Click on the button below to set your password.",
      buttonText: "Set my Password",
      buttonLink: `${CLIENT_DOMAIN}/set-password?token=${jwt.token}`
    });

    const response = await sendEmail({
      htmlContent,
      subject: "Activate your account",
      receiver: emailAddress
    });

    if (response === "error") {
      throw new Error("Sorry email was not sent");
    }

    res.json({
      success: true,
      user: savedUser
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
