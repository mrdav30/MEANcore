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
exports.requiresLogin = function (req, res, appBaseUrl, next) {
  if (!req.isAuthenticated() && !req.apiAuthed) {
    var redirectUrl = appBaseUrl ? appBaseUrl + 'sign-in' : '/sign-in';
    return res.redirect(redirectUrl);
  }

  next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function (roles, appBaseUrl) {
  var _this = this;

  return function (req, res, next) {
    _this.requiresLogin(req, res, appBaseUrl, function () {
      var userRoles = req.user && req.user.roles ? _.map(req.user.roles, (role) => {
        return role.name;
      }) : ['user'];
      if (_.intersection(userRoles, roles).length) {
        return next();
      } else {
        var redirectUrl = appBaseUrl ? appBaseUrl + 'unauthorized' : '/unauthorized';
        req.flash('unauthorizedMsg', 'User is not authorized');
        return res.redirect(redirectUrl);
      }
    });
  };
};
