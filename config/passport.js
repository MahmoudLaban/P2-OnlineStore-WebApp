const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

// Both serializeUser and deserializedUser are used to support persistent login sessions.

passport.serializeUser((user, done) => { // determines which data of the user object should be stored in the session
  done(null, user.id);
});

passport.deserializeUser((id, done) => { // retrieves the full user object from the data stored in the session.
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// This strategy checks if a user already exists in the database with the given email, and returns an error if the user already exists. It also checks if the two password fields match, and returns an error if they don`t. If the email is unique and the passwords match, the strategy creates a new user and stores it in the database using the save () method.

passport.use( // define a new authentication strategy. The "local.signup" and "local.signin" strategies are defined here using an instance of the LocalStrategy class.
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (user) {
          return done(null, false, { message: "Email already exists" });
        }
        if (password != req.body.password2) {
          return done(null, false, { message: "Passwords must match" });
        }
        const newUser = await new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.username = req.body.name;
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

// The second strategy, "local.signin", also takes in an email, password, and callback function. It checks if a user exists in the database with the given email, and returns an error if the user doesn't exist. It then checks if the given password is valid using the validPassword() method defined on the User model, and returns an error if it's not valid. If the email and password are both valid, the strategy returns the user object to the callback function.

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: false,
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "User doesn't exist" });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Wrong password" });
        }
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);
