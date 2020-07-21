const jsonwebtoken = require("jsonwebtoken");

const getJWTPayload = token => {
  let updatedToken = token;
  if (token.includes(" ")) {
    updatedToken = token.split(" ")[1];
  }
  return jsonwebtoken.decode(updatedToken);
};

module.exports = getJWTPayload;
