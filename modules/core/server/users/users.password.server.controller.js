/**
 * Module dependencies.
 */
import mongoose from 'mongoose';
const User = mongoose.model('User');
import {
  randomBytes
} from 'crypto';
import async from 'async';

/**
 * Forgot for reset password (forgot POST)
 */
export const forgot = (req, res, next) => {
  const config = req.app.locals.config;
  async.waterfall([
    // Generate random token
    (done) => {
      randomBytes(20, (err, buffer) => {
        const token = buffer.toString('hex');
        done(err, token);
      });
    },
    // Lookup user by username
    (token, done) => {
      const usernameOrEmail = String(req.body.usernameOrEmail).toLowerCase();

      User.findOne({
        $or: [{
            username: usernameOrEmail
          },
          {
            email: usernameOrEmail
          }
        ]
      }, '-salt -password', (err, user) => {
        if (user.provider !== 'local') {
          return res.status(400).send({
            message: 'It seems like you signed up using your ' + user.provider + ' account'
          });
        } else {
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save((err) => {
            done(err, token, user);
          });
        }
      });
    },
    // If valid email, send reset email using service
    (token, user, done) => {
      const mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Password Reset',
        path: 'server/users/templates/reset-password-email.server.html',
        data: {
          name: user.displayName,
          appTitle: config.app.title,
          url: res.locals.host + '/api/auth/reset/' + user.username + '/' + token
        }
      };

      config.services.sendEmail(req, res, mailOptions, (err) => {
        if (!err) {
          res.send({
            message: 'An email has been sent to ' + user.email + ' with further instructions.',
            isSecretReset: true
          });
        }

        done(err);
      });
    }
  ], (err) => {
    if (err) {
      return next(err)
    }
  });
}

/**
 * Reset password GET from email token
 */
export const validateResetToken = (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, (err, user) => {
    if (!user) {
      return res.redirect(req.baseUrl + '/password/reset/' + req.params.username + '/invalid');
    }

    res.redirect(req.baseUrl + '/password/reset/' + req.params.username + '/' + req.params.token);
  });
}

/**
 * Reset password POST from email token
 */
export const reset = (req, res, next) => {
  const config = req.app.locals.config;
  // Init Variables
  const passwordDetails = req.body;

  async.waterfall([
    (done) => {
      User.findOne({
          resetPasswordToken: req.params.token,
          resetPasswordExpires: {
            $gt: Date.now()
          }
        })
        // .select('username displayName email roles password salt')
        .exec((err, user) => {
          if (!err && user) {
            if (!user.authenticate(passwordDetails.newPassword)) {
              user.password = passwordDetails.newPassword;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;

              user.save((err) => {
                if (err) {
                  return res.status(400).send({
                    message: config.helpers.getErrorMessage(err)
                  });
                } else {
                  // Remove sensitive data before login
                  user.password = undefined;
                  user.salt = undefined;

                  req.login(user, (err) => {
                    if (err) {
                      res.status(400).send({
                        message: config.helpers.getErrorMessage(err)
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
    (user, done) => {
      const mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Your password has been changed',
        path: 'server/users/templates/reset-password-confirm-email.server.html',
        data: {
          name: user.displayName,
          appTitle: config.app.title
        }
      };

      config.services.sendEmail(req, res, mailOptions, (err) => {
        done(err);
      });
    }
  ], (err) => {
    if (err) {
      return next(err);
    }
  });
}

/**
 * Change Password
 */
export const changePassword = (req, res) => {
  const config = req.app.locals.config;
  // Init Variables
  const passwordDetails = req.body;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user._id).exec((err, user) => {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            user.password = passwordDetails.newPassword;

            user.save((err) => {
              if (err) {
                return res.status(400).send({
                  message: config.helpers.getErrorMessage(err)
                });
              } else {
                // Remove sensitive data before login
                user.password = undefined;
                user.salt = undefined;

                req.login(user, (err) => {
                  if (err) {
                    res.status(400).send({
                      message: config.helpers.getErrorMessage(err)
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
