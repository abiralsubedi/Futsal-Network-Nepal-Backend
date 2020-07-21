const User = require("../../models/User");
const { issueJWT } = require("../../utils/passwordCrypt");
const sendEmail = require("../../Helper/sendEmail");
const singleButtonLink = require("../../templates/singleButtonLink");

const { CLIENT_DOMAIN } = process.env;

module.exports = async (req, res) => {
  try {
    const { forgotEmail } = req.body;
    if (!forgotEmail) {
      throw new Error("Email address is required.");
    }

    if (!/^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(forgotEmail)) {
      throw new Error("Email is invalid");
    }

    const oldUser = await User.findOne({ emailAddress: forgotEmail });
    if (!oldUser) {
      return res.json({ success: true, message: "Email is sent" });
    }

    const jwt = issueJWT(oldUser, { setNewPassword: true });
    const { fullName } = oldUser;

    const htmlContent = singleButtonLink({
      fullName,
      plainText: "Click on the button below to set your password.",
      buttonText: "Set my Password",
      buttonLink: `${CLIENT_DOMAIN}/set-password?token=${jwt.token}`
    });

    const response = await sendEmail({
      htmlContent,
      subject: "Reset your Password",
      receiver: forgotEmail
    });

    if (response === "error") {
      throw new Error("Sorry email was not sent");
    }

    res.json({ success: true });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
