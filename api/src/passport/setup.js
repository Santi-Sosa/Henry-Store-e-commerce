const { Users } = require("../db.js");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_CLIENT_SECRET } = process.env;
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Users.findByPk(id)
    .then((user) => done(null, user))
    .catch((err) => {
      if (err) {
        return done(err);
      }
    });
});

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      Users.findOne({ where: { email: email } })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "El correo electrónico no existe",
            });
          }
          if (!user.checkPassword(password)) {
            return done(null, false, {
              message: "La contraseña es incorrecta",
            });
          }
          return done(null, user);
        })
        .catch((err) => {
          if (err) {
            return done(err);
          }
        });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3100/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile._json.email)
      Users.findOrCreate({ 
        where: {email: profile._json.email},
        defaults: {
          name: profile.displayName,
          username: 'Google User',
          email: profile._json.email,
          role: 'client'
        }
      }).then(user => {
        return done(null, user[0].dataValues)
      }).catch(err => done(err))
    }
  )
);

module.exports = passport;
