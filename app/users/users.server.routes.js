'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function (app) {
	// User Routes
	var users = require('./users.server.controller');

	// Setting up the users profile api
	app.route('/users/me').get(users.me);
	app.route('/users').put(users.updateProfile);
	app.route('/users/accounts').delete(users.removeOAuthProvider);

	// Setting up the users password api
	app.route('/users/password').post(users.changePassword);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token')
		.get(users.validateResetToken)
		.post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/validate').post(users.validateUser);
	app.route('/auth/signup').post(users.signUp);
	app.route('/auth/signin').post(users.signIn);
	app.route('/auth/signout').get(users.signOut);

	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));
	app.route('/auth/google/callback').get(users.oauthCallback('google'));

	// Setting the github oauth routes
	app.route('/auth/github').get(passport.authenticate('github'));
	app.route('/auth/github/callback').get(users.oauthCallback('github'));

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};