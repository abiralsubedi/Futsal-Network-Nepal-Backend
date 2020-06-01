const mongoose = require("mongoose");

async function connect() {
  try {
    mongoose.set("useCreateIndex", true);
    // mongoose.set('debug', true);
    const connection = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    if (connection) {
      console.log("Connected to DB!");
    }
  } catch (err) {
    console.error(`Can't connect to the MongoDB ${err}`);
  }
}

module.exports = {
  connect
};
