const passport = require("passport");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");

const { JWT_SECRET } = process.env;

//Creating a token
exports.getToken = function(user) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: 3600 });
};

//Extracting a token
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

// Verifying a token
exports.jwtPassport = passport.use(
  new JwtStrategy(options, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload.userId }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

//Creating a function to verify logged in user using Passport-Jwt
exports.requireLogin = passport.authenticate("jwt", { session: false });
