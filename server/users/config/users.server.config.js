'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  User = require('mongoose').model('User'),
  path = require('path');

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
        done(err, user);
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
