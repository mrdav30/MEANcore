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
      .select('username displayName email appName provider roles knownIPAddresses password salt')
      .exec(function (err, user) {
        // Get users role info based on assigned roles
        Roles.find({
            name: {
              $in: _.map(user.roles, (name) => {
                return name;
              })
            }
          })
          .select('name permissions')
          .lean()
          .exec((err, roles) => {
            if (err) {
              return done(err);
            }
            
            const permissions = _.chain(roles)
              .map('permissions')
              .flatten()
              .uniq()
              .value();

            user.set('permissions', permissions, {
              strict: false
            });
            done(err, user);
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
