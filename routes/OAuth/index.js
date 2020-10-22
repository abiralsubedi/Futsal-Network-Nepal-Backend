const { Router } = require("express");
const router = Router();
const passport = require("passport");
const { issueJWT } = require("../../utils/passwordCrypt");

router.get("/failed", (req, res) => {
  res.status(409).json({ message: "Login Failed!" });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function(req, res) {
    // Successful authentication, redirect home.
    const tokenObject = issueJWT(req.user);
    res.redirect(
      `${process.env.CLIENT_DOMAIN}/login?token=${tokenObject.token}`
    );
  }
);

module.exports = router;
