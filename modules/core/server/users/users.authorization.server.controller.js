/**
 * Module dependencies.
 */
import _ from 'lodash';
import mongoose from 'mongoose';
const  User = mongoose.model('User');

/**
 * User middleware
 */
export function userByID (req, res, next, id) {
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
}

/**
 * Require login routing middleware
 */
export function requiresLogin (req, res, appBaseUrl, next) {
  if (!req.isAuthenticated() && !req.apiAuthed) {
    const redirectUrl = appBaseUrl ? appBaseUrl + 'sign-in' : '/sign-in';
    return res.redirect(redirectUrl);
  }

  next();
}

/**
 * User authorizations routing middleware
 */
export function hasAuthorization (roles, appBaseUrl) {
  const _this = this;

  return function (req, res, next) {
    _this.requiresLogin(req, res, appBaseUrl, function () {
      const userRoles = req.user && req.user.roles ? _.map(req.user.roles, (role) => {
        return role.name;
      }) : ['user'];
      if (_.intersection(userRoles, roles).length) {
        return next();
      } else {
        const redirectUrl = appBaseUrl ? appBaseUrl + 'unauthorized' : '/unauthorized';
        req.flash('unauthorizedMsg', 'User is not authorized');
        return res.redirect(redirectUrl);
      }
    });
  };
}
