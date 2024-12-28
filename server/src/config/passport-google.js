const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const crypto = require("crypto");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/user/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await User.create({
          email: profile.emails[0].value,
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          isEmailVerified: true,
          password: crypto.randomBytes(32).toString("hex"),
          avatar: profile.photos[0].value,
        });

        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Thêm serialize và deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
