const User = require("../../models/User");
const { issueJWT } = require("../../utils/passwordCrypt");
const sendEmail = require("../../Helper/Common/sendEmail");
const singleButtonLink = require("../../templates/singleButtonLink");

const { CLIENT_DOMAIN } = process.env;

module.exports = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const { _id: userId } = req.user;
    if (!newEmail) {
      throw new Error("Email address is required.");
    }

    if (!/^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newEmail)) {
      throw new Error("Email is invalid");
    }

    const oldUser = await User.findOne({ _id: userId });
    if (!oldUser) {
      return res.json({ success: true, message: "Email is sent" });
    }

    if (oldUser.googleId) {
      throw new Error("Sorry it is not available for google logged in user.");
    }

    const otherUser = await User.findOne({ emailAddress: newEmail });
    if (otherUser) {
      throw new Error("Sorry the email address is already registered");
    }

    const jwt = issueJWT(oldUser, { newEmail });
    const { fullName } = oldUser;

    const htmlContent = singleButtonLink({
      fullName,
      plainText: "Click on the button below to confirm new email address.",
      buttonText: "Confirm",
      buttonLink: `${CLIENT_DOMAIN}/set-password?confirm_email=true&token=${jwt.token}`
    });

    const response = await sendEmail({
      htmlContent,
      subject: "Change your Email Address",
      receiver: newEmail
    });

    if (response === "error") {
      throw new Error("Sorry email was not sent");
    }

    res.json({ success: true });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
