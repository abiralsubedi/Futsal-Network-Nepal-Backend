const nodemailer = require("nodemailer");

const { NODEMAILER_PASS } = process.env;

module.exports = async ({ subject, receiver, htmlContent }) => {
  try {
    const transport = nodemailer.createTransport({
      name: "smtp.gmail.com",
      host: "smtp.gmail.com",
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: "abiralsubedi119@gmail.com",
        pass: NODEMAILER_PASS
      }
    });

    const message = {
      from: "abiralsubedi119@gmail.com",
      replyTo: "abiralsubedi119@gmail.com",
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
    return "error";
  }
};
