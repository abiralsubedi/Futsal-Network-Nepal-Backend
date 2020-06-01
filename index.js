const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connect } = require("./mongoConnect");

// creating app and connecting to mongoDB
const app = express();
connect();

//importing routes
const postsRoute = require("./routes/Posts/posts");
const { origin } = require("./config/OriginCORS");

//middleware
app.use(bodyParser.json());
app.use(cors({ origin }));

app.use("/posts", postsRoute);
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(5000);
