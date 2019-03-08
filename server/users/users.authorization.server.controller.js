'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function (err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return next(new Error('Failed to load User ' + id));
		}
		req.profile = user;
		next();
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function (req, res, appBase, next) {
	if (!req.isAuthenticated() && !req.apiAuthed) {
		var redirectUrl = appBase ? appBase + 'sign-in' : '/sign-in';
		return res.redirect(redirectUrl);
	}

	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function (roles, appBase) {
	var _this = this;

	return function (req, res, next) {
		_this.requiresLogin(req, res, appBase, function () {
			if (_.intersection(req.user.get('roles'), roles).length) {
				return next();
			} else {
				var redirectUrl = appBase ? appBase : '/';
				req.flash('unauthorizedMsg', 'User is not authorized');
				return res.redirect(redirectUrl);
			}
		});
	};
};