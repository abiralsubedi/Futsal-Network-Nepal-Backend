const express = require("express");
require("dotenv/config");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connect } = require("./mongoConnect");
const passport = require("passport");

// creating app and connecting to mongoDB
const app = express();
connect();

//importing routes
const postsRoute = require("./routes/Posts");
const oauthRoutes = require("./routes/OAuth");
const registerUser = require("./routes/Users/registerUser");
const loginUser = require("./routes/Users/loginUser");
const changePassword = require("./routes/Users/changePassword");
const uploadFile = require("./Helper/uploadFile");
const sendEmail = require("./Helper/sendEmail");
const profileRoutes = require("./routes/Users/profile");
const { corsOptionsDelegate } = require("./config/OriginCORS");
const { requireLogin } = require("./config/passport");

//middleware
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors(corsOptionsDelegate));

// routes
app.post("/register", registerUser);
app.post("/login", loginUser);
app.post("/email", requireLogin, sendEmail);
app.post("/change-password", requireLogin, changePassword);
app.post("/upload-file", requireLogin, uploadFile);
app.use("/profile", profileRoutes);
app.use("/auth", oauthRoutes);
app.use("/posts", postsRoute);
app.get("/health", (req, res) => res.json({ status: "health ok" }));

app.listen(process.env.PORT);
