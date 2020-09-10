/**
 * Module dependencies.
 */
import {
  getErrorMessage
} from '../errors.server.controller.js';
import mongoose from 'mongoose';
const User = mongoose.model('User');
import config from '../../config/config.js';
import {
  randomBytes
} from 'crypto';
import async from 'async';

/**
 * Forgot for reset password (forgot POST)
 */
export function forgot(req, res, next) {
  async.waterfall([
    // Generate random token
    function (done) {
      randomBytes(20, function (err, buffer) {
        const token = buffer.toString('hex');
        done(err, token);
      });
    },
    // Lookup user by username
    function (token, done) {
      const usernameOrEmail = String(req.body.usernameOrEmail).toLowerCase();

      User.findOne({
        $or: [{
            username: usernameOrEmail
          },
          {
            email: usernameOrEmail
          }
        ]
      }, '-salt -password', function (err, user) {
        if (user.provider !== 'local') {
          return res.status(400).send({
            message: 'It seems like you signed up using your ' + user.provider + ' account'
          });
        } else {
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        }
      });
    },
    // If valid email, send reset email using service
    function (token, user, done) {
      const mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Password Reset',
        path: 'server/users/templates/reset-password-email.server.view.html',
        data: {
          name: user.displayName,
          appTitle: config.app.title,
          url: res.locals.host + '/api/auth/reset/' + user.username + '/' + token
        }
      };

      config.services.sendEmail(req, res, mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'An email has been sent to ' + user.email + ' with further instructions.',
            isSecretReset: true
          });
        }

        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err)
    }
  });
}

/**
 * Reset password GET from email token
 */
export function validateResetToken(req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (!user) {
      return res.redirect(req.baseUrl + '/password/reset/' + req.params.username + '/invalid');
    }

    res.redirect(req.baseUrl + '/password/reset/' + req.params.username + '/' + req.params.token);
  });
}

/**
 * Reset password POST from email token
 */
export function reset(req, res, next) {
  // Init Variables
  const passwordDetails = req.body;

  async.waterfall([
    function (done) {
      User.findOne({
          resetPasswordToken: req.params.token,
          resetPasswordExpires: {
            $gt: Date.now()
          }
        })
        // .select('username displayName email roles password salt')
        .exec(function (err, user) {
          if (!err && user) {
            if (!user.authenticate(passwordDetails.newPassword)) {
              user.password = passwordDetails.newPassword;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;

              user.save(function (err) {
                if (err) {
                  return res.status(400).send({
                    message: getErrorMessage(err)
                  });
                } else {
                  // Remove sensitive data before login
                  user.password = undefined;
                  user.salt = undefined;

                  req.login(user, function (err) {
                    if (err) {
                      res.status(400).send({
                        message: getErrorMessage(err)
                      });
                    } else {
                      // Return authenticated user
                      res.status(200).send({
                        user: req.user,
                        secretReset: true
                      });

                      done(err, user);
                    }
                  });
                }
              });
            } else {
              return res.status(200).send({
                invalidSecret: true,
                message: 'You cannot use a previous password.'
              });
            }
          } else {
            return res.status(200).send({
              tokenInvalid: true,
              message: 'Password reset token is invalid or has expired.'
            });
          }
        });
    },
    // If valid email, send reset email using service
    function (user, done) {
      const mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Your password has been changed',
        path: 'server/users/templates/reset-password-confirm-email.server.view.html',
        data: {
          name: user.displayName,
          appName: config.app.title
        }
      };

      config.services.sendEmail(req, res, mailOptions, function (err) {
        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
}

/**
 * Change Password
 */
export function changePassword(req, res) {
  // Init Variables
  const passwordDetails = req.body;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user._id).exec(function (err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            user.password = passwordDetails.newPassword;

            user.save(function (err) {
              if (err) {
                return res.status(400).send({
                  message: getErrorMessage(err)
                });
              } else {
                // Remove sensitive data before login
                user.password = undefined;
                user.salt = undefined;

                req.login(user, function (err) {
                  if (err) {
                    res.status(400).send({
                      message: getErrorMessage(err)
                    });
                  } else {
                    res.send({
                      message: 'Password changed successfully'
                    });
                  }
                });
              }
            });
          } else {
            res.status(400).send({
              message: 'Current password is incorrect'
            });
          }
        } else {
          res.status(400).send({
            message: 'User is not found'
          });
        }
      });
    } else {
      res.status(400).send({
        message: 'Please provide a new password'
      });
    }
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
}
