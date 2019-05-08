'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function (app) {
  // User Routes
  var users = require('./users.server.controller');

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);

  app.route('/api/users/profile/current').get(users.getCurrentProfile);
  app.route('/api/users/profile/:_id')
      .get(users.getProfileById)
      .put(users.updateProfile)
      .delete(users.deleteProfile)

  // Setting up the users password api
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/auth/forgot').post(users.forgot);
  app.route('/api/auth/reset/:username/:token')
    .get(users.validateResetToken)
  app.route('/api/auth/reset/:token')
    .post(users.reset);

  // Setting up the users authentication api
  app.route('/api/auth/validate').post(users.validateUser);
  app.route('/api/auth/signup').post(users.signUp);
  app.route('/api/auth/signin').post(users.signIn);
  app.route('/api/auth/signout').get(users.signOut);

  // Setting the google oauth routes
  app.route('/api/auth/google').get(passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));
  app.route('/api/auth/google/callback').get(users.oauthCallback('google'));

  // Setting the github oauth routes
  app.route('/api/auth/github').get(passport.authenticate('github'));
  app.route('/api/auth/github/callback').get(users.oauthCallback('github'));

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
