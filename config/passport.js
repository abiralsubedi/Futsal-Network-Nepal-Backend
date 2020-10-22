const passport = require("passport");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

const generateRandomString = require("../utils/generateRandomString");

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

// verifies if a user is admin
exports.verifyAdmin = (req, res, next) => {
  if (req.user.role === "Admin") {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized." });
  }
};

// verifies if a user is vendor
exports.verifyVendor = (req, res, next) => {
  if (req.user.role === "Vendor") {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized." });
  }
};

// verifies if a user is vendor
exports.verifyUser = (req, res, next) => {
  if (req.user.role === "User") {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized." });
  }
};

// verifies if a user is admin or vendor
exports.verifyAdminVendor = (req, res, next) => {
  const { role } = req.user;
  if (role === "Vendor" || role === "Admin") {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized." });
  }
};

// verifies if a user is admin or user
exports.verifyAdminUser = (req, res, next) => {
  const { role } = req.user;
  if (role === "User" || role === "Admin") {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized." });
  }
};

// verifies if a user is vendor or user
exports.verifyUserVendor = (req, res, next) => {
  const { role } = req.user;
  if (role === "User" || role === "Vendor") {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized." });
  }
};

// verifying google user
exports.googlePassport = passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${GOOGLE_CALLBACK_URL}/auth/google/callback`
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        const { emails, id, displayName, photos } = profile;
        const emailAddress = emails[0].value;

        const user =
          (await User.findOne({ googleId: id })) ||
          (await User.findOne({ emailAddress }));

        if (user) {
          return done(null, user);
        }

        let [username] = emailAddress.split("@");

        const oldUser = await User.findOne({ username });
        if (oldUser) {
          username = username + `-${generateRandomString()}`;
        }

        const newUser = new User({
          username,
          emailAddress,
          googleId: id,
          fullName: displayName,
          photoUri: photos[0].value
        });

        newUser.save((err, user) => {
          if (err) {
            return done(err, false);
          } else {
            return done(null, user);
          }
        });
      } catch (error) {
        return done(err);
      }
    }
  )
);
