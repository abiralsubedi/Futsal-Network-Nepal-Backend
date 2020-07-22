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
const setPassword = require("./routes/Users/setPassword");
const forgotPassword = require("./routes/Users/forgotPassword");
const changeEmail = require("./routes/Users/changeEmail");
const confirmEmail = require("./routes/Users/confirmEmail");
const uploadFile = require("./Helper/uploadFile");
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
app.post("/change-password", requireLogin, changePassword);
app.post("/forgot-password", forgotPassword);
app.post("/set-password", requireLogin, setPassword);
app.post("/change-email", requireLogin, changeEmail);
app.post("/confirm-email", requireLogin, confirmEmail);
app.post("/upload-file", requireLogin, uploadFile);
app.use("/profile", profileRoutes);
app.use("/auth", oauthRoutes);
app.use("/posts", postsRoute);
app.get("/health", (req, res) => res.json({ status: "health ok" }));

app.listen(process.env.PORT);
