const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN
} = process.env;

module.exports = async ({ subject, receiver, htmlContent }) => {
  try {
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
      to: receiver,
      subject: subject,
      html: htmlContent
    };

    transport.sendMail(message, function(err, info) {
      if (err) {
        return "error";
      } else {
        return "success";
      }
    });
  } catch (error) {
    return "error"
  }
};
