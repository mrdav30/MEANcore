'use strict';

/**
 * Module dependencies.
 */
var async = require('async'),
  _ = require('lodash'),
  errorHandler = require('../errors.server.controller'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User'),
  Roles = mongoose.model('Roles'),
  userValidation = require('./users.validation.service');

exports.validateUser = function (req, res) {
  var usernameOrEmail = String(req.body.usernameOrEmail).toLowerCase();

  userValidation.validateUserData(usernameOrEmail, function (err, user) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (!user) {
      return res.status(200).send({
        userExists: false
      });
    }

    res.status(200).send({
      userExists: true
    });
  })
};

/**
 * Sign up
 */
exports.signUp = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init Variables
  var user = new User(req.body);

  // check to ensure username isn't already taken
  userValidation.validateUserData(user.username, function (err, userExists) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (userExists) {
      // User name already exists, provide other possibilities
      var possibleUsername = user.username || ((user.email) ? user.email.split('@')[0] : '');

      User.findUniqueUsername(possibleUsername, null, function (err, availableUsername) {
        return res.status(200).send({
          userExists: true,
          possibleUsername: availableUsername
        });
      });
    } else {
      // Add missing user fields
      user.provider = 'local';
      user.displayName = user.firstName + ' ' + user.lastName;
      var config = req.app.locals.config;
      user.appName = config.app.name.toLowerCase();
      // Set IP of a successful signup to prevent logins from unknown IPs.
      user.knownIPAddresses.push(req.connection.remoteAddress);

      user.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }

        // Remove sensitive data before login
        user.password = undefined;
        user.salt = undefined;

        req.login(user, function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }

          return res.status(200).send({
            user: req.user
          });
        });
      });
    }
  });
};

/**
 * Sign in after passport authentication
 */
exports.signIn = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return res.status(400).send({
        err: errorHandler.getErrorMessage(err)
      });
    } else if (!user) {
      return res.status(200).send({
        invalidSecret: true
      });
    } else {
      async.series([
        // Set last known IP of a successful login to prevent logins from unknown IPs.
        function (done) {
          var userIPAddresses = user.knownIPAddresses ? user.knownIPAddresses : [];
          if (!userIPAddresses.includes(req.connection.remoteAddress)) {
            User.updateOne({
              _id: mongoose.Types.ObjectId(user._id)
            }, {
              $addToSet: {
                knownIPAddresses: req.connection.remoteAddress
              }
            }, function (err) {
              done(err);
            });
          } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            done(null);
          }
        }
      ], function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }

        req.login(user, function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }

          return res.status(200).send({
            user: req.user
          });
        });
      });
    }
  })(req, res, next);
};

/**
 * Sign out
 */
exports.signOut = function (req, res) {
  req.logout();
  return res.status(200).send({
    message: 'You are now logged out of the system'
  });;
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    passport.authenticate(strategy, function (err, user, redirectURL) {
      if (err || !user) {
        return res.redirect('/#!/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/#!/signin');
        }

        return res.redirect(redirectURL || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (err, availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // And save the user
            user.save(function (err) {
              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) user.additionalProvidersData = {};
      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.updateOne({
        _id: mongoose.Types.ObjectId(user.get('_id'))
      }, {
        $set: _.omit(user, '_id')
      }, function (err) {
        return done(err, user, '/#!/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.param('provider');

  if (user && provider) {
    // Delete the additional provider
    if (user.additionalProvidersData[provider]) {
      delete user.additionalProvidersData[provider];

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');
    }

    user.updateOne({
      _id: mongoose.Types.ObjectId(user.get('_id'))
    }, {
      $set: _.omit(user, '_id')
    }, function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });;
          } else {
            return res.status(200).send(user);
          }
        });
      }
    });
  }
};
