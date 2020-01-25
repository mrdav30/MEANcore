'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Roles = mongoose.model('Roles');

/**
 * Module init function.
 */
module.exports = function (app) {
  var config = app.locals.config;

  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    User.findOne({
        _id: id
      })
      // Only retrieve values required for auth
      .select('username displayName email avatarUrl appName provider roles knownIPAddresses password salt')
      .lean()
      .exec(function (err, user) {
        if (err || !user) {
          var message = !user ? 'User not found!' : err;
          done(message);
        }
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
  });

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
};
