'use strict';

/**
 * Module dependencies.
 */
var errorHandler = require('../errors.server.controller.js'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  userValidation = require('./users.validation.service');

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

exports.getUsers = function (req, res) {
  User.find({}).sort({
    _id: -1
  }).select('-password -salt').exec(function (err, users) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to retrieve users'
      });
    }

    res.status(200).send(users);
  })
}

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
