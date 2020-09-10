/**
 * Module dependencies.
 */
import passport from 'passport';
import url from 'url';
import { resolve } from 'path';
import strategy from 'passport-google-oauth';
import config from '../../../../config/config.js';
const usersPath = url.pathToFileURL(resolve('./server/users/users.server.controller.js'));
// eslint-disable-next-line node/no-unsupported-features/es-syntax
const users = import(usersPath);

const GoogleStrategy = strategy.OAuth2Strategy;

export default function() {
	// Use google strategy
	passport.use(new GoogleStrategy({
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			let providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			// Create the user OAuth profile
			let providerUserProfile = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				username: profile.username,
				provider: 'google',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
}
