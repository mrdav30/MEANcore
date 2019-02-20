'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  passportJWT = require("passport-jwt"),
  User = require('mongoose').model('User');

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

module.exports = function () {
  // Use jwt strategy
  passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret'
    },
    function (jwtPayload, done) {
      //find the user in db if needed
      return User.findById(jwtPayload._id).exec(function (err, user) {
        if (err) {
          return done(err);
        } else if (!user) {
          return done(null, false, {
            message: 'Invalid user!'
          });
        }

        return done(null, user);
      })
    }
  ));
};
