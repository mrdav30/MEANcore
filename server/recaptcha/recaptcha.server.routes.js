'use strict';

module.exports = function (app) {
	// Recaptcha Routes
	var recaptcha = require('./recaptcha.server.controller');

	// Setting up the users profile api
	app.route('/api/validate_captcha').get(recaptcha.getRecaptchaValdiation);
};