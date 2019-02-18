'use strict';

/**
 * Module dependencies
 */
var passport = require('passport');
var LdapStrategy = require('passport-ldapauth');

module.exports = function (config) {
  // Use LDAP strategy

  var LDAP_OPTS = config.ldap;
  passport.use(new LdapStrategy(LDAP_OPTS));
};
