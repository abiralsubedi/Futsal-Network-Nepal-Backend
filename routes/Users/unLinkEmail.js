const { Router } = require("express");
const router = Router();

const User = require("../../models/User");

const { genPassword, issueJWT } = require("../../utils/passwordCrypt");
const getJWTPayload = require("../../utils/getJWTPayload");
const sendEmail = require("../../Helper/sendEmail");
const { requireLogin } = require("../../config/passport");

const singleButtonLink = require("../../templates/singleButtonLink");

const { CLIENT_DOMAIN } = process.env;

router.get("/", requireLogin, async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const oldUser = await User.findOne({ _id: userId });
    if (!oldUser) {
      throw new Error("User does not exist");
    }

    if (!oldUser.googleId) {
      throw new Error("Sorry, the user is not linked to google account.");
    }

    const jwt = issueJWT(oldUser, { unLinkEmail: true });
    const { fullName } = oldUser;

    const htmlContent = singleButtonLink({
      fullName,
      plainText: "Click on the button below to unlink from GMail account",
      buttonText: "Confirm",
      buttonLink: `${CLIENT_DOMAIN}/set-password?unlink_email=true&token=${jwt.token}`
    });

    const response = await sendEmail({
      htmlContent,
      subject: "Unlink from GMail account",
      receiver: oldUser.emailAddress
    });

    if (response === "error") {
      throw new Error("Sorry email was not sent");
    }

    res.json({ success: true });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.post("/", requireLogin, async (req, res) => {
  try {
    const { unLinkEmail } = getJWTPayload(req.headers.authorization);

    const { newPassword } = req.body;
    const { _id: userId } = req.user;
    if (!newPassword) {
      throw new Error("New password is required.");
    }

    if (!unLinkEmail) {
      throw new Error("Sorry token is invalid");
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User does not exist");
    }

    if (!user.googleId) {
      throw new Error("Sorry, the user is not linked to google account.");
    }

    const saltHash = genPassword(newPassword);
    const { salt, hash } = saltHash;

    await User.updateOne(
      { _id: userId },
      { $set: { salt, hash, googleId: "" } }
    );
    res.json({
      success: true,
      message: "Your account has been unlinked from google."
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

module.exports = router;
