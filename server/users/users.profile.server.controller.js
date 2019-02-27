'use strict';

/**
 * Module dependencies.
 */
var errorHandler = require('../errors.server.controller.js'),
  _ = require('lodash'),
  userValidation = require('./users.validation.server');

/**
 * Update user details
 */
exports.updateProfile = function (req, res) {
  userValidation.validateChanges(req, req.body, function (err, result) {
    if (err && !result) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (result && result.userExists) {
      return res.status(200).send({
        userExists: true,
        possibleUsername: result.availableUsername
      });
    } else {
      res.status(200).send({
        message: 'Success!'
      });
    }
  });
};

/**
 * Send User
 */
exports.me = function (req, res) {
  var user = req.user || null;

  if (user) {
    // Remove sensitive data
    user.password = undefined;
    user.salt = undefined;
  }

  res.status(200).send(user);
};
