const express = require("express");
require("dotenv/config");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connect } = require("./mongoConnect");

// creating app and connecting to mongoDB
const app = express();
connect();

//importing routes
const postsRoute = require("./routes/Posts/posts");
const registerUser = require("./routes/Users/registerUser");
const loginUser = require("./routes/Users/loginUser");
const { origin } = require("./config/OriginCORS");

//middleware
app.use(bodyParser.json());
app.use(cors({ origin }));

// routes
app.post("/register", registerUser);
app.post("/login", loginUser);
app.use("/posts", postsRoute);
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(process.env.PORT);
