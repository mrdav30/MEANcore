/**
 * Module dependencies.
 */
import passport from 'passport';
import * as users from './users.server.controller.js';

export default async function (app) {
  // User Routes

  // Setting up the users profile api
  app.route('/api/users/me').get(users.usersProf.me);
  app.route('/api/users/accounts').delete(users.usersAuthn.removeOAuthProvider);

  app.route('/api/users/profile/current').get(users.usersProf.getCurrentProfile);
  app.route('/api/users/profile/:_id')
      .get(users.usersProf.getProfileById)
      .put(users.usersProf.updateProfile)
      .delete(users.usersProf.deleteProfile)

  // Setting up the users password api
  app.route('/api/users/password').post(users.usersPass.changePassword);
  app.route('/api/auth/forgot').post(users.usersPass.forgot);
  app.route('/api/auth/reset/:username/:token')
    .get(users.usersPass.validateResetToken)
  app.route('/api/auth/reset/:token')
    .post(users.usersPass.reset);

  // Setting up the users authentication api
  app.route('/api/auth/validate').post(users.usersAuthn.validateUser);
  app.route('/api/auth/signup').post(users.usersAuthn.signUp);
  app.route('/api/auth/signin').post(users.usersAuthn.signIn);
  app.route('/api/auth/signout').get(users.usersAuthn.signOut);

  // Setting the google oauth routes
  app.route('/api/auth/google').get(passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));
  app.route('/api/auth/google/callback').get(users.usersAuthn.oauthCallback('google'));

  // Setting the github oauth routes
  app.route('/api/auth/github').get(passport.authenticate('github'));
  app.route('/api/auth/github/callback').get(users.usersAuthn.oauthCallback('github'));

  // Finish by binding the user middleware
  app.param('userId', users.usersAuthz.userByID);
}
