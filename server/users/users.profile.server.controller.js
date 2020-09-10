/**
 * Module dependencies.
 */
import {
  getErrorMessage
} from '../errors.server.controller.js';
import {
  validateChanges
} from './users.validation.service.js';
import mongoose from 'mongoose';
const User = mongoose.model('User');

export function getCurrentProfile(req, res) {
  const user = req.user || null;

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
          message: getErrorMessage(err)
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

export function getProfileById(req, res) {
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
export function me(req, res) {
  const user = req.user || null;

  if (user) {
    // Remove sensitive data
    user.password = undefined;
    user.salt = undefined;
  }

  res.status(200).send(user);
}

/**
 * Update user details
 */
export function updateProfile(req, res) {
  const profile = req.body;

  validateChanges(req, profile, function (err, result) {
    if (err && !result) {
      res.status(200).send({
        message: getErrorMessage(err),
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

export function deleteProfile(req, res) {
  let user = req.user || null;
  if (req.params._id !== user._id) {
    // can only delete own account
    return res.status(401).send('You can only delete your own account');
  }

  User.deleteOne({
    _id: mongoose.helper.toObjectID(user._id)
  }).exec(function (err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    }

    res.status(200).send({
      message: 'Success!'
    });
  });
}
