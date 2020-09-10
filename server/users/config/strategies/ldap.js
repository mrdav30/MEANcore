/**
 * Module dependencies
 */
import passport from 'passport';
import strategy from 'passport-ldapauth';

export default function (config) {
  // Use LDAP strategy

  const LDAP_OPTS = config.ldap;
  passport.use(new strategy(LDAP_OPTS));
}
