/**
 * Module dependencies.
 */
import passport from 'passport';
import strategy from 'passport-http';
import mongoose from 'mongoose';
const User = mongoose.model('User');

const BasicStrategy = strategy.BasicStrategy;

export default function () {
  // Use basic strategy
  // Retrieve required fields for auth only
  passport.use(new BasicStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function (username, password, done) {
      User.findOne({
          username: username
        })
        .exec(function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {
              message: 'Unknown user or invalid password'
            });
          }
          if (!user.authenticate(password)) {
            return done(null, false, {
              message: 'Unknown user or invalid password'
            });
          }

          return done(null, user);
        });
    }
  ));
}
