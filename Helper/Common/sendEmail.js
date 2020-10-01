const nodemailer = require("nodemailer");

const { NODEMAILER_PASS } = process.env;

module.exports = async ({ subject, receiver, htmlContent }) => {
  try {
    // const transport = nodemailer.createTransport({
    //   name: "smtp.gmail.com",
    //   host: "smtp.gmail.com",
    //   service: "gmail",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: "abiralsubedi119@gmail.com",
    //     pass: NODEMAILER_PASS
    //   }
    // });
    const transport = nodemailer.createTransport({
      name: "smtp.zoho.com",
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: "abiral0999@gmail.com",
        pass: NODEMAILER_PASS
      }
    });

    const email = {
      from: "abiral0999@zohomail.com",
      replyTo: "abiral0999@zohomail.com",
      to: receiver,
      subject: subject,
      html: htmlContent
    };

    transport.sendMail(email, function(err, info) {
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
