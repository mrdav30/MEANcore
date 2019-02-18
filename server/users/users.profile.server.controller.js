'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	userValidation = require('./users.validation.server');

/**
 * Update user details
 */
exports.updateProfile = function (req, res) {
	userValidation.validateChanges(req, req.body, function (err, userExists, user) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else if (userExists) {
			return res.status(200).send({
				userExists: true,
				possibleUsername: user
			});
		} else {
			res.json(user);
		}
	});
};

/**
 * Send User
 */
exports.me = function (req, res) {
	res.json(req.user || null);
};