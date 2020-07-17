const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const setPasswordTemplate = require("../templates/setPassword.js");

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN
} = process.env;

module.exports = async (req, res) => {
  try {
    const htmlContent = setPasswordTemplate({
      fullName: "Abiral Subedi",
      resetLink: "https://apfyp.herokuapp.com"
    });

    const myOAuth2Client = new OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

    myOAuth2Client.setCredentials({
      refresh_token: GOOGLE_REFRESH_TOKEN
    });

    const myAccessToken = myOAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      name: "smtp.gmail.com",
      host: "smtp.gmail.com",
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: "abiral0999@gmail.com",
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
        accessToken: myAccessToken
      }
    });

    const message = {
      from: "abiral0999@gmail.com",
      replyTo: "abiral0999@gmail.com",
      to: "pobofap328@mailsecv.com",
      subject: "Create an account",
      html: htmlContent
    };

    transport.sendMail(message, function(err, info) {
      if (err) {
        throw new Error("Sorry we are unable to send email");
      } else {
        res.json({ message: "Email is sent" });
      }
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
