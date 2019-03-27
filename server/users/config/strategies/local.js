'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  mongoose = require('mongoose'),
  _ = require('lodash'),
  User = mongoose.model('User'),
  Roles = mongoose.model('Roles');

module.exports = function () {
  // Use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'usernameOrEmail',
      passwordField: 'password'
    },
    function (usernameOrEmail, password, done) {
      User.findOne({
          $or: [{
            username: usernameOrEmail.toLowerCase()
          }, {
            email: usernameOrEmail.toLowerCase()
          }]
        })
        .exec(function (err, user) {
          if (err) {
            return done(err);
          } else if (!user || !user.authenticate(password)) {
            return done(null, false, {
              message: 'Invalid username or password (' + (new Date()).toLocaleTimeString() + ')'
            });
          }

          // Convert doc to plain javascript object
          user = user.toObject();

          // Get users role info based on assigned roles
          Roles.find({
              _id: {
                $in: _.map(user.roles, (id) => {
                  return new mongoose.Types.ObjectId(id);
                })
              }
            })
            .select('name featurePermissions')
            .lean()
            .exec((err, roles) => {
              if (err) {
                return done(err);
              }

              // if user has no roles, provide user role by default
              user.roles = roles && roles.length ? roles : [{
                name: 'user'
              }];

              done(null, user);
            })
        });
    }
  ));
};
