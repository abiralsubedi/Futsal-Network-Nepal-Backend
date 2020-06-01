const whitelist = process.env.WHITE_LIST;

const origin = (originUrl, callback) => {
  if (whitelist.indexOf(originUrl) !== -1) {
    callback(null, true);
  } else {
    callback(`${originUrl} not allowed by CORS`);
  }
};

module.exports = origin;
