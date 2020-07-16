const { SES } = require("aws-sdk");
const setPasswordTemplate = require('../templates/setPassword.js')

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY } = process.env;

const ses = new SES({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: "us-east-1"
});

module.exports = async (req, res) => {
  try {
    const htmlContent = setPasswordTemplate({fullName: 'Abiral Subedi', resetLink: 'https://apfyp.herokuapp.com'})
    const params = {
      Source: "abiral0999@gmail.com",
      Destination: {
        ToAddresses: ["abiral.us@gmail.com"]
      },
      ReplyToAddresses: ["abiral0999@gmail.com"],
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: htmlContent
          }
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Create new account"
        }
      }
    };
    await ses.sendEmail(params).promise();
    res.json({ message: "Email is sent" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
