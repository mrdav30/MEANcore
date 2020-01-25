'use strict';

/**
 * Module dependencies.
 */
var errorHandler = require('../errors.server.controller.js'),
  _ = require('lodash'),
  userValidation = require('./users.validation.service'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.getCurrentProfile = function (req, res) {
  var user = req.user || null;

  if (!user) {
    return res.status(200).send({
      message: 'User not logged in!'
    });
  }

  User.findById(user._id)
    .lean()
    .exec(function (err, profile) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      // Remove sensitive data
      profile.password = undefined;
      profile.salt = undefined;

      res.send({
        profile: profile
      });
    });
}

exports.getProfileById = function (req, res) {
  User.findById(req.params._id)
    .lean()
    .exec(function (err, profile) {
      if (err) {
        return res.status(400).send({
          message: err
        });
      }

      if (profile) {
        res.send({
          profile: profile
        });
      } else {
        res.status(404).send();
      }
    });
}

/**
 * Send User from session
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

/**
 * Update user details
 */
exports.updateProfile = function (req, res) {
  var profile = req.body;

  userValidation.validateChanges(req, profile, function (err, result) {
    if (err && !result) {
      res.status(200).send({
        message: errorHandler.getErrorMessage(err),
        msgType: 'error'
      });
    } else if (result && result.userExists) {
      res.status(200).send({
        userExists: true,
        possibleUsername: result.availableUsername
      });
    } else {
      res.status(200).send({
        message: 'Success!'
      });
    }
  });
}

exports.deleteProfile = function (req, res) {
  let user = req.user || null;
  if (req.params._id !== user._id) {
    // can only delete own account
    return res.status(401).send('You can only delete your own account');
  }

  User.deleteOne({
    _id: mongo.helper.toObjectID(user._id)
  }).exec(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.status(200).send({
      message: 'Success!'
    });
  });
}
