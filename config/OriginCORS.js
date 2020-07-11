const whiteList = process.env.WHITE_LIST;

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;

  if (whiteList.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

module.exports = corsOptionsDelegate;
