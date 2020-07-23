const axios = require("axios");

const { CAPTCHA_SECRET_KEY } = process.env;

module.exports = async ({ reCaptchaValue }) => {
  try {
    if (!reCaptchaValue) {
      throw new Error("Recaptcha is not invalid");
    }
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    };
    const { data } = await axios({
      method: "post",
      url: "https://www.google.com/recaptcha/api/siteverify",
      headers,
      data: `secret=${CAPTCHA_SECRET_KEY}&response=${reCaptchaValue}`
    });

    if (!data.success) {
      throw new Error("Recaptcha is not invalid");
    }
    return "success";
  } catch (error) {
    return "error";
  }
};
