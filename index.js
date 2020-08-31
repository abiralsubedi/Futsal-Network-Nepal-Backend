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
const registerUser = require("./routes/Users/registerUser");
const loginUser = require("./routes/Users/loginUser");
const changePassword = require("./routes/Users/changePassword");
const setPassword = require("./routes/Users/setPassword");
const forgotPassword = require("./routes/Users/forgotPassword");
const changeEmail = require("./routes/Users/changeEmail");
const creditHistory = require("./routes/Users/creditHistory");
const confirmEmail = require("./routes/Users/confirmEmail");

const postsRoute = require("./routes/Posts");
const oauthRoutes = require("./routes/OAuth");
const paymentRoutes = require("./routes/Payment");
const profileRoutes = require("./routes/Users/profile");
const unLinkEmailRoutes = require("./routes/Users/unLinkEmail");
const peopleUserRoutes = require("./routes/People/Users");
const peopleVendorRoutes = require("./routes/People/Vendors");

const uploadFile = require("./Helper/uploadFile");
const { corsOptionsDelegate } = require("./config/OriginCORS");
const { requireLogin } = require("./config/passport");

//middleware
app.use(
  bodyParser.json({
    verify: function(req, res, buf) {
      var url = req.originalUrl;
      if (url.startsWith("/payment/webhooks")) req.rawBody = buf.toString();
    }
  })
);

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
app.get("/credit-history", requireLogin, creditHistory);

app.post("/upload-file", requireLogin, uploadFile);
app.use("/profile", profileRoutes);
app.use("/unlink-email", unLinkEmailRoutes);
app.use("/auth", oauthRoutes);
app.use("/payment", paymentRoutes);

app.use("/people/user", peopleUserRoutes);
app.use("/people/vendor", peopleVendorRoutes);

app.use("/posts", postsRoute);
app.get("/health", (req, res) => res.json({ status: "health ok" }));

app.listen(process.env.PORT);
