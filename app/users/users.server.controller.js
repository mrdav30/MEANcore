'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./users.authentication.server.controller'),
	require('./users.authorization.server.controller'),
	require('./users.password.server.controller'),
	require('./users.profile.server.controller')
);