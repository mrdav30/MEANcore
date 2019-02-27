'use strict';
var async = require('async'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

// returns true if username exists
var validateUserData = function (usernameOrEmail, cb) {
  User.findOne({
    $or: [{
        username: usernameOrEmail
      },
      {
        email: usernameOrEmail
      }
    ]
  }).exec(function (err, user) {
    if (err) {
      return cb(err, null);
    } else if (!user) {
      return cb(null, false);
    }

    cb(null, user);
  });
}
exports.validateUserData = validateUserData;

function validateChanges(req, userUpdates, callback) {
  let currentUser = req.user;

  // For security measurement we remove the roles from the req.body object
  delete userUpdates.roles;

  if (currentUser) {
    async.series([
      function (cb) {
        if (currentUser.get('username') != userUpdates.username) {
          // check to ensure username isn't already taken
          validateUserData(userUpdates.username, function (err, userExists) {
            if (err) {
              return cb(err);
            } else if (userExists) {
              // User name already exists, provide other possibilities
              var possibleUsername = userUpdates.username || ((userUpdates.email) ? userUpdates.email.split('@')[0] : '');

              User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
                cb(true, {
                  userExists: true,
                  availableUsername: availableUsername
                });
              });
            } else {
              cb(null);
            }
          });
        } else {
          cb(null);
        }
      },
      function (cb) {
        // Merge existing user
        currentUser = _.extend(currentUser.toObject(), userUpdates);

        currentUser.updated = Date.now();
        currentUser.displayName = currentUser.firstName + ' ' + currentUser.lastName;

        //fields to update
        var set = _.omit(currentUser, '_id');

        User.updateOne({
          _id: mongoose.Types.ObjectId(currentUser._id)
        }, {
          $set: set
        }, function (err, doc) {
          if (err) {
            return cb(err);
          }

          // Remove sensitive data before login
          currentUser.password = undefined;
          currentUser.salt = undefined;

          req.login(currentUser, function () {
            // Manually save session before redirect. See bug https://github.com/expressjs/session/pull/69
            req.session.save(function (err) {
              if (err) {
                return cb(err);
              }

              cb(null);
            })
          });
        });
      }
    ], function (err, result) {
      if (err) {
        return callback(err, result[0] ? result[0] : null);
      }

      callback(null, null);
    })
  } else {
    return callback('User is not signed in');
  }
}
exports.validateChanges = validateChanges;
