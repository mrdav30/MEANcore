'use strict';
var _ = require('lodash'),
    async = require('async'),
        errorHandler = require('../errors.server.controller.js'),
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
        async.waterfall([
            function (cb) {
                if (currentUser.get('username') != userUpdates.username) {
                    // check to ensure username isn't already taken
                    validateUserData(userUpdates.username, function (err, userExists) {
                        if (err) {
                            return cb(errorHandler.getErrorMessage(err));
                        } else if (userExists) {
                            // User name already exists, provide other possibilities
                            var possibleUsername = userUpdates.username || ((userUpdates.email) ? userUpdates.email.split('@')[0] : '');

                            User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
                                cb(true, {
                                    userExists: true,
                                    user: availableUsername
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
                currentUser = _.extend(currentUser, userUpdates);

                currentUser.updated = Date.now();
                currentUser.displayName = currentUser.firstName + ' ' + currentUser.lastName;

                currentUser.save(function (err) {
                    if (err) {
                        return cb(errorHandler.getErrorMessage(err));
                    } else {
                        req.login(currentUser, function () {
                            // Manually save session before redirect. See bug https://github.com/expressjs/session/pull/69
                            req.session.save(function (err) {
                                if (err) {
                                    return cb(errorHandler.getErrorMessage(err));
                                }

                                cb(null, {
                                    userExists: false,
                                    user: currentUser
                                });
                            })
                        });
                    }
                });
            }
        ], function (err, result) {
            if (err) {
                return callback(errorHandler.getErrorMessage(err));
            }

            callback(null, result.userExists, result.user);
        })
    } else {
        return callback('User is not signed in');
    }
}
exports.validateChanges = validateChanges;