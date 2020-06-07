const passport = require("passport");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

const {
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL
} = process.env;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

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

// verifying google user
exports.googlePassport = passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${GOOGLE_CALLBACK_URL}/auth/google/callback`
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ googleId: profile.id }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!err && user !== null) {
          return done(null, user);
        } else {
          user = new User({ username: profile.id });
          user.googleId = profile.id;
          user.save((err, user) => {
            if (err) {
              return done(err, false);
            } else {
              return done(null, user);
            }
          });
        }
      });
    }
  )
);
