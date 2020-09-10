/**
 * Module dependencies.
 */
import passport from 'passport';
import url from 'url';
import {
  resolve
} from 'path';
import strategy from 'passport-github';
import config from '../../../../config/config.js';
const usersPath = url.pathToFileURL(resolve('./server/users/users.server.controller.js'));
// eslint-disable-next-line node/no-unsupported-features/es-syntax
const users = import(usersPath);

const GithubStrategy = strategy.Strategy;

export default function () {
  // Use github strategy
  passport.use(new GithubStrategy({
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackURL,
      passReqToCallback: true
    },
    function (req, accessToken, refreshToken, profile, done) {
      // Set the provider data and include tokens
      let providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      let providerUserProfile = {
        displayName: profile.displayName,
        email: profile.emails[0].value,
        username: profile.username,
        provider: 'github',
        providerIdentifierField: 'id',
        providerData: providerData
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  ));
}
