/**
 * Module dependencies.
 */
import passport from 'passport';
import {
  join,
  resolve,
  dirname
} from 'path';
import _ from 'lodash';
import mongoose from 'mongoose';
import url from 'url';
const User = mongoose.model('User');
const Roles = mongoose.model('Roles');

/**
 * Module init function.
 */
export default async function (app) {
  let config = app.locals.config;

  // Serialize sessions
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize sessions
  passport.deserializeUser((id, done) => {
    User.findOne({
        _id: id
      })
      // Only retrieve values required for auth
      .select('username displayName email avatarUrl appName provider roles knownIPAddresses password salt')
      .lean()
      .exec(function (err, user) {
        if (err || !user) {
          let message = !user ? 'User not found!' : err;
          done(message);
        }
        // Get users role info based on assigned roles
        Roles.find({
            _id: {
              $in: _.map(user.roles, (id) => {
                return new mongoose.Types.ObjectId(id);
              })
            }
          })
          .select('name featurePermissions')
          .lean()
          .exec((err, roles) => {
            if (err) {
              return done(err);
            }

            // if user has no roles, provide user role by default
            user.roles = roles && roles.length ? roles : [{
              name: 'user'
            }];

            done(null, user);
          })
      });
  });

  const __dirname = dirname(url.fileURLToPath(import.meta.url));
  const strategies = config.utils.getGlobbedPaths(join(__dirname, 'strategies/*.js'));

  await Promise.all(strategies.map(async (strategyFile) => {
    let strategyPath = url.pathToFileURL(resolve(strategyFile)).href;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    await import(strategyPath).then(async (strategy) => {
      await strategy.default(config);
    }).catch((err) => {
      console.log(err);
    });
  }));

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
}
